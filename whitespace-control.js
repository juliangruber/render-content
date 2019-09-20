// ref: https://github.com/Shopify/liquid/pull/773
// whitespace control is not part of `liquid` (see https://git.io/fhpIa)
module.exports = function whitespaceControl (markdown) {
  if (!markdown) return markdown // don't choke on blank placeholders like category files
  if (!markdown.match(/\{%-|-%\}/)) return markdown

  const tagStart = /\n.*?(\{%)-/g
  const tagEnd = /-(%\}).*?\n/g
  markdown = markdown.replace(tagStart, '$1').replace(tagEnd, '$1')
  return markdown
}
