const fs = require('fs')
const path = require('path')
const Liquid = require('liquid')
const liquid = new Liquid.Engine()
const { paramCase } = require('change-case')
const { promisify } = require('util')

// This widget expects one parameter, a language-agnostic href:
//
// {% article_widget /articles/set-up-git %}
//
// It renders a link to the given article using the article's `title` and `intro`
// frontmatter data. The href, title, and intro are all dynamic based on the
// current language (English, Japanese, etc..)
//
// Liquid Docs: https://github.com/liquid-lang/liquid-node#registering-new-tags

module.exports = class LinkWithIntro extends Liquid.Tag {
  constructor (template, tagName, href) {
    super()
    this.href = href.trim()
    this.tagName = tagName
    this.templatePath = path.join(__dirname, `../../includes/${paramCase(this.constructor.name)}.html`)
    this.template = null
    return this
  }

  async render (context) {
    if (!this.template) {
      this.template = await promisify(fs.readFile)(this.templatePath, 'utf8')
    }

    const ctx = context.environments[0]
    const fullPath = `/${ctx.currentLanguage}${this.href}`
    const page = ctx.pages[fullPath]
    if (!page) throw new Error(`${this.tagName} href not found: ${this.href}`)
    const title = await page.renderProp('title', ctx, { textOnly: true, encodeEntities: true })
    const intro = await page.renderProp('intro', ctx, { textOnly: true, encodeEntities: true })
    return liquid.parseAndRender(this.template, { fullPath, title, intro })
  }
}
