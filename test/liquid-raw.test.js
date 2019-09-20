const { obfuscate, deobfuscate } = require('../liquid-raw')
const { test } = require('tap')

test('liquidRaw module', async t => {
  await t.test('obfuscate(template)', async t => {
    await t.test('works on inline raw templates', async t => {
      const input = `
        For example: {% raw %} {% include cool_header.html %} {% endraw %}.
      `
      const output = 'For example: {---% raw %---} {---% include cool_header.html %---} {---% endraw %---}.'
      t.equal(obfuscate(input), output)
    })

    await t.test('works on multiline raw templates', async t => {
      const input = `{% raw %}
  {% include cool_header.html %}
  {{ foo.bar.baz }}
{% endraw %}`

      const output = `{---% raw %---}
  {---% include cool_header.html %---}
  {---{ foo.bar.baz }---}
{---% endraw %---}`
      t.equal(obfuscate(input), output)
    })
  })

  await t.test('deobfuscate(template)', async t => {
    await t.test('works on inline/one-liner raw templates', async t => {
      const input = 'For example: {---% raw %---} {---% include cool_header.html %---} {---% endraw %---}.'
      const output = 'For example: {% raw %} {% include cool_header.html %} {% endraw %}.'
      t.equal(deobfuscate(input), output)
    })

    await t.test('works on multiline raw templates', async t => {
      const input = `{---% raw %---}
  {---% include cool_header.html %---}
  {---{ foo.bar.baz }---}
{---% endraw %---}`

      const output = `{% raw %}
  {% include cool_header.html %}
  {{ foo.bar.baz }}
{% endraw %}`

      t.equal(deobfuscate(input), output)
    })
  })
})
