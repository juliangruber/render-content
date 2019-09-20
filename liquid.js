const Liquid = require('liquid')
const semver = require('semver')
const path = require('path')
const engine = new Liquid.Engine()
engine.registerFileSystem(
  new Liquid.LocalFileSystem(path.join(__dirname, '../includes'))
)

// GHE versions are not valid SemVer, but can be coerced...
// https://github.com/npm/node-semver#coercion

Liquid.Condition.operators.ver_gt = (cond, left, right) => {
  if (!startsWithNumber(left)) return false
  return semver.gt(semver.coerce(left), semver.coerce(right))
}

Liquid.Condition.operators.ver_lt = (cond, left, right) => {
  if (!startsWithNumber(left)) return false
  return semver.lt(semver.coerce(left), semver.coerce(right))
}

// Include custom tags like {% link_with_intro /article/foo %}
engine.registerTag('link_with_intro', require('./liquid-tags/link-with-intro'))

module.exports = engine

function startsWithNumber (input) {
  return input && input.match(/^\d+/)
}
