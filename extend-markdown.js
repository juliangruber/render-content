'use strict'

const tags = {
  mac: '',
  windows: '',
  linux: '',
  all: '',
  tip: 'border rounded-1 mb-4 p-3 border-blue bg-blue-light f5',
  note: 'border rounded-1 mb-4 p-3 border-blue bg-blue-light f5',
  warning: 'border rounded-1 mb-4 p-3 border-red bg-red-light f5',
  danger: 'border rounded-1 mb-4 p-3 border-red bg-red-light f5'
}

function replaceOpening (match, p1) {
  return `<div class="extended-markdown ${p1} ${tags[p1]}">`
}

function extendMarkdown (string) {
  for (const tag in tags) {
    const opening = new RegExp(`{{#(${tag})}}`, 'gm')
    const closing = new RegExp(`{{/(${tag})}}`, 'gm')
    string = string.replace(opening, replaceOpening).replace(closing, '</div>')
  }

  return string
}

module.exports = extendMarkdown
