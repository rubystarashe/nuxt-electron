const path = require('path')
const url = require('url')
const { app, BrowserWindow, protocol } = require('electron')

let mainWindow

const createWindow = () => {
  const WEB_FOLDER = 'web'
  const PROTOCOL = 'file'

  protocol.interceptFileProtocol(PROTOCOL, (req, cb) => {
      let url = req.url.substr(PROTOCOL.length + 1)
      url = path.join(__dirname, WEB_FOLDER, url)
      url = path.normalize(url)
      cb({ path: url })
  })

  mainWindow = new BrowserWindow({width: 800, height: 600})

  mainWindow.loadURL(url.format({
    pathname: 'index.html',
    protocol: PROTOCOL + ':',
    slashes: true
  }))

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})