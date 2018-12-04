const path = require('path')
const url = require('url')
const { app, BrowserWindow, protocol } = require('electron')
const isDev = process.env.NODE_ENV === 'DEV'

let mainWindow

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false
  })

  if (isDev) {
    (async () => {
      require('vue-devtools').install()
      const devUri = await require('./dev')
      mainWindow.loadURL(devUri)
    })()
  }
  else {
    const WEB_FOLDER = 'web'
    const PROTOCOL = 'file'
  
    protocol.interceptFileProtocol(PROTOCOL, (req, cb) => {
      let url = req.url.substr(PROTOCOL.length + 1)
      url = path.join(__dirname, WEB_FOLDER, url)
      url = path.normalize(url)
      cb({ path: url })
    })

    mainWindow.loadURL(url.format({
      pathname: 'index.html',
      protocol: PROTOCOL + ':',
      slashes: true
    }))
  }

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    if (isDev) mainWindow.webContents.openDevTools()
  })

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