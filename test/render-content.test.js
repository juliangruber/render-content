const cheerio = require('cheerio')
const renderContent = require('..')
const { test } = require('tap')

test('renderContent', async t => {
  await t.test('takes a template and a context and returns a string (async)', async t => {
    const template = 'my favorite color is {{ color }}.'
    const context = { color: 'orange' }
    const output = await renderContent(template, context)
    t.equal(output, '<p>my favorite color is orange.</p>')
  })

  await t.test('preserves content within {% raw %} tags', async t => {
    const template = `
      For example: {% raw %}{% include cool_header.html %}{% endraw %}.
    `
    const expected = '<p>For example: {% include cool_header.html %}.</p>'
    const output = await renderContent(template)
    t.equal(output, expected)
  })

  await t.test('preserves content within {% raw %} tags in data files', async t => {
    // see https://github.com/github/help-docs/issues/10299
    const site = {
      en: {
        site: {
          data: {
            reusables: {
              fake_reusable_file: {
                foo: '{% raw %}{% include cool_header.html %}{% endraw %}'
              }
            }
          }
        }
      }
    }
    const template = `
      For example: {{ site.data.reusables.fake_reusable_file.foo }}.
    `
    const expected = '<p>For example: {% include cool_header.html %}.</p>'
    const context = site.en
    const output = await renderContent(template, context)

    t.equal(output, expected)
  })

  await t.test('removes extra newlines to prevent lists from breaking', async t => {
    const template = `
1. item one
1. item two


1. item three`

    const html = await renderContent(template)
    const $ = cheerio.load(html, { xmlMode: true })
    t.equal($('ol').length, 1)
    t.equal($('ol > li').length, 3)
  })
})
