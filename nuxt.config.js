module.exports = {
  dev: process.env.NODE_ENV === 'DEV',
  mode: 'spa',
  router: {
    mode: 'hash'
  },
  build: {
    publicPath: '/app/'
  },
  generate: {
    dir: 'web'
  },
  build: {
    extend(config, ctx) {
      if (ctx.isClient) {
				config.target = 'electron-renderer'
			}
    }
  },
  plugins: [
    '~plugins/vue-electron.js'
  ]
}
