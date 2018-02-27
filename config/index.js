const path = require('path')

let env = process.env.NODE_ENV || 'production'

env = env.toLowerCase()

let file = path.resolve(__dirname, env)
try {
  module.exports = require(file)
  console.log('load config: [%s] %s', env, file)
} catch(err) {
  console.log('load config: [%s] %s', env, file)
  throw err
}