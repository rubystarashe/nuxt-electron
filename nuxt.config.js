module.exports = {
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
