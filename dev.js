process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

const http = require('http')
const { Nuxt, Builder } = require('nuxt')
const  config = require('./nuxt.config.js')
config.rootDir = __dirname

const nuxt = new Nuxt(config)
const server = http.createServer(nuxt.render)
server.listen()

module.exports = new Promise((resolve, reject) => {
  new Builder(nuxt)
  .build()
  .then(() => {
    resolve(`http://localhost:${server.address().port}`)
  })
})
