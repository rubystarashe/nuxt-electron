const path = require('path')
const url = require('url')
const { app, BrowserWindow, protocol } = require('electron')
const isDev = process.env.NODE_ENV === 'DEV'

const WEB_FOLDER = 'web'
const PROTOCOL = 'file'
let devUri

app.on('ready', async () => {
  if (isDev) {
    await require('vue-devtools').install()
    devUri = await require('./dev')
  }
  else {
    protocol.interceptFileProtocol(PROTOCOL, (req, cb) => {
      let url = req.url.substr(PROTOCOL.length + 1)
      url = path.join(__dirname, WEB_FOLDER, url)
      url = path.normalize(url)
      cb({ path: url })
    })
  }

  createMainWindow()
})

let mainWindow
const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    },
    width: 800,
    height: 600,
    show: false
  })

  if (isDev) {
    mainWindow.loadURL(devUri)
  }
  else {
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

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
