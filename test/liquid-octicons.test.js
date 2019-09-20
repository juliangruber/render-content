const { test } = require('tap')
const liquidOcticons = require('../liquid-octicons')

test('liquid octicons', async t => {
  await t.test('renders liquid octicons', async t => {
    const template = '{{ octicon-kebab-horizontal The horizontal kebab icon }}'
    const output = liquidOcticons(template)
    t.ok(/svg/.test(output))
  })

  await t.test('renders liquid octicons with optional color', async t => {
    const template =
      '{{ octicon-diff-removed The diff removed icon color-red }}'
    const output = liquidOcticons(template)
    t.ok(/svg/.test(output))
    t.ok(/#cb2431/.test(output))
  })
})
