const renderContent = require('./')

const main = async () => {
  const markdown = `
# Beep
{{ foo }}
  `
  const html = await renderContent(markdown, {
    foo: 'bar'
  })
  console.log(html)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
