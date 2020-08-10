const fs = require('fs')

const version = '80'

fs.mkdir(`./node_modules/node-sass/vendor/win32-x64-${version}/`, () => {
  fs.copyFile('./node_modules/node-sass/build/Release/binding.node',
  `./node_modules/node-sass/vendor/win32-x64-${version}/binding.node`, error => {
    if (error) console.log(error)
    else console.log('node-sass rebuild complete')
  })
})
