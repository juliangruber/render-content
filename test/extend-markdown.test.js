const extendMarkdown = require('../extend-markdown')
const cheerio = require('cheerio')
const { test } = require('tap')

const text = `
{{#tip}}
  I am a tip
{{/tip}}

{{#tip}}
  I am another tip
{{/tip}}

{{#note}}
  I am a note
{{/note}}

{{#mac}}
  I'm only for macOS
{{/mac}}

{{#windows}}
  I'm only for Windows
{{/windows}}

{{#linux}}
  I'm only for Linux
{{/linux}}

{{#warning}}
  I am a warning
{{/warning}}

{{#danger}}
  I am dangerous
{{/danger}}

{{#rock}}
  I am a rock
{{/rock}}
`

const extended = extendMarkdown(text)
const $ = cheerio.load(extended, { xmlMode: true })

test('extendMarkdown', async t => {
  await t.test('converts stings like `{{#tip}}` to HTML elements', async t => {
    t.equal($('.extended-markdown.tip').eq(0).text().trim(), 'I am a tip')
  })

  await t.test('converts multiple instances of the same tag', async t => {
    t.equal($('.extended-markdown.tip').eq(1).text().trim(), 'I am another tip')
  })

  await t.test('tips', async t => {
    const tip = $('.extended-markdown.tip').eq(0)

    await t.test('are blue', async t => {
      t.ok(tip.hasClass('border-blue'))
      t.ok(tip.hasClass('bg-blue-light'))
    })

    await t.test('are not red', async t => {
      t.notOk(tip.hasClass('border-red'))
      t.notOk(tip.hasClass('bg-red-light'))
    })
  })

  await t.test('warnings', async t => {
    const warning = $('.extended-markdown.warning').eq(0)

    await t.test('are red', async t => {
      t.ok(warning.hasClass('border-red'))
      t.ok(warning.hasClass('bg-red-light'))
    })

    await t.test('are not blue', async t => {
      t.notOk(warning.hasClass('border-blue'))
      t.notOk(warning.hasClass('bg-blue-light'))
    })
  })

  await t.test('danger', async t => {
    await t.test('is red', async t => {
      const danger = $('.extended-markdown.danger').eq(0)
      t.ok(danger.hasClass('border-red'))
      t.ok(danger.hasClass('bg-red-light'))
    })
  })

  await t.test('notes', async t => {
    await t.test('are blue', async t => {
      const note = $('.extended-markdown.note').eq(0)
      t.ok(note.hasClass('border-blue'))
      t.ok(note.hasClass('bg-blue-light'))
    })
  })

  await t.test('platforms (Mac/Windows/Linux)', async t => {
    await t.test('mac does not have special styling', async t => {
      t.equal($('.extended-markdown.mac').attr('class').trim(), 'extended-markdown mac')
    })

    await t.test('windows does not have special styling', async t => {
      t.equal($('.extended-markdown.windows').attr('class').trim(), 'extended-markdown windows')
    })

    await t.test('linux does not have special styling', async t => {
      t.equal($('.extended-markdown.linux').attr('class').trim(), 'extended-markdown linux')
    })
  })

  await t.test('ignores unknown tags', async t => {
    t.ok(extended.includes('{{#rock}}'))
    t.ok(extended.includes('{{/rock}}'))
  })
})
