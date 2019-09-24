const renderContent = require('./')

const main = async () => {
  const html = await renderContent(`
# Beep
{{ foo }}
  `, {
    foo: 'bar'
  })
  console.log(html)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})