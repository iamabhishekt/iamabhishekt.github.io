// ```demo blocks: controls on top, then ---html and ---css. Each control drives a CSS
// variable of the same name, so the CSS reads var(--gap), var(--direction) and so on.
//
//   gap: 0..48px = 16px          slider from 0 to 48, unit px, starts at 16
//   direction: row | column      buttons, first one starts selected

import { markBroken, splitSections } from './sections'

type Control =
  | { kind: 'range'; name: string; min: number; max: number; unit: string; value: number }
  | { kind: 'choice'; name: string; options: string[]; value: string }

const RANGE = /^([\w-]+):\s*(-?[\d.]+)\s*\.\.\s*(-?[\d.]+)\s*([a-z%]*)\s*(?:=\s*(-?[\d.]+)[a-z%]*)?$/i
const CHOICE = /^([\w-]+):\s*(.+\|.+)$/

function parseControl(line: string): Control {
  const range = line.match(RANGE)
  if (range) {
    const [, name, min, max, unit, start] = range
    return { kind: 'range', name, min: +min, max: +max, unit, value: +(start ?? min) }
  }
  const choice = line.match(CHOICE)
  if (choice) {
    const options = choice[2].split('|').map((option) => option.trim())
    return { kind: 'choice', name: choice[1], options, value: options[0] }
  }
  throw new Error(`can't read control "${line}". Use "name: 0..100px = 50" or "name: a | b"`)
}

const cssValue = (control: Control) =>
  control.kind === 'range' ? `${control.value}${control.unit}` : control.value

function rangeInput(control: Extract<Control, { kind: 'range' }>, readout: HTMLElement, onInput: () => void) {
  const label = document.createElement('label')
  const input = document.createElement('input')
  input.type = 'range'
  input.min = String(control.min)
  input.max = String(control.max)
  input.step = control.max - control.min <= 5 ? '0.1' : '1'
  input.value = String(control.value)
  input.addEventListener('input', () => {
    control.value = Number(input.value)
    onInput()
  })
  label.append(readout, input)
  return label
}

function choiceInput(
  control: Extract<Control, { kind: 'choice' }>,
  readout: HTMLElement,
  group: string,
  onInput: () => void,
) {
  const fieldset = document.createElement('fieldset')
  const legend = document.createElement('legend')
  legend.append(readout)
  fieldset.append(legend)
  for (const option of control.options) {
    const label = document.createElement('label')
    const input = document.createElement('input')
    input.type = 'radio'
    input.name = group
    input.value = option
    input.checked = option === control.value
    input.addEventListener('change', () => {
      control.value = option
      onInput()
    })
    label.append(input, option)
    fieldset.append(label)
  }
  return fieldset
}

let demos = 0

function buildDemo(pre: HTMLElement) {
  const { head = '', html = '', css = '' } = splitSections(pre.textContent ?? '', 'head')
  const controls = head.split('\n').filter((line) => line.trim()).map((line) => parseControl(line.trim()))
  const id = demos++

  const figure = document.createElement('figure')
  figure.className = 'demo'
  const stage = document.createElement('div')
  stage.className = 'demo-stage'
  const shadow = stage.attachShadow({ mode: 'open' })
  shadow.innerHTML = `<style>:host{display:block}${css}</style>${html}`

  const panel = document.createElement('div')
  panel.className = 'demo-controls'
  for (const [i, control] of controls.entries()) {
    const row = document.createElement('div')
    row.className = 'demo-control'
    const readout = document.createElement('code')
    const apply = () => {
      stage.style.setProperty(`--${control.name}`, cssValue(control))
      readout.textContent = `${control.name}: ${cssValue(control)}`
    }
    row.append(
      control.kind === 'range'
        ? rangeInput(control, readout, apply)
        : choiceInput(control, readout, `demo-${id}-${i}`, apply),
    )
    panel.append(row)
    apply()
  }

  figure.append(stage, panel)
  return figure
}

export function mountDemos(blocks: HTMLElement[]) {
  for (const pre of blocks) {
    try {
      pre.replaceWith(buildDemo(pre))
    } catch (error) {
      markBroken(pre, `Demo error: ${error instanceof Error ? error.message : 'could not build'}`)
    }
  }
}
