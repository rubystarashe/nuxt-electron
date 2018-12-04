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
  }
}
