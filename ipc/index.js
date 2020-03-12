module.exports = app => {
  app.ipcMain.on('ping', (error, message) => {
    app.windows.mainWindow.webContents.send('pong', message)
  })
}
