const path = require('path')
const url = require('url')
const { app, BrowserWindow, protocol, ipcMain, dialog } = require('electron')
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
app.allowRendererProcessReuse = true
app.setAppUserModelId('nuxt-electron-example')

app.ipcMain = ipcMain
app.dialog = dialog
app.process = process
app.isDev = isDev

app.windows = {
  mainWindow: null
}

require('./ipc')(app)

const createMainWindow = () => {
  app.windows.mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    },
    width: 800,
    height: 600,
    show: false
  })

  if (isDev) {
    app.windows.mainWindow.loadURL(devUri)
  }
  else {
    app.windows.mainWindow.loadURL(url.format({
      pathname: 'index.html',
      protocol: PROTOCOL + ':',
      slashes: true
    }))
  }

  app.windows.mainWindow.on('ready-to-show', () => {
    app.windows.mainWindow.show()
    if (isDev) {
      const devtools = new BrowserWindow()
      app.windows.mainWindow.webContents.setDevToolsWebContents(devtools.webContents)
      app.windows.mainWindow.webContents.openDevTools({ mode: 'detach' })
    }
  })

  app.windows.mainWindow.on('closed', () => {
    app.windows.mainWindow = null
  })
}

const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (app.windows.mainWindow) {
      if (app.windows.mainWindow.isMinimized()) app.windows.mainWindow.restore()
      app.windows.mainWindow.show()
      app.windows.mainWindow.focus()
    }
  })
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (app.windows.mainWindow === null) {
    createWindow()
  }
})
