const { app, BrowserWindow, ipcMain } = require('electron');
const {autoUpdater} = require('electron-updater');


let mainWindow;
let secondWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 540,
    height: 500,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
  }
  });
  mainWindow.loadFile('index.html');

  mainWindow.on('closed', function () {
    mainWindow = null;
    createSecondWindow()
  });


  mainWindow.once('ready-to-show', () => {
    autoUpdater.checkForUpdatesAndNotify();
  });

}

function createSecondWindow(){
  secondWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
  }
  });
  secondWindow.loadFile('second.html');
  secondWindow.on('closed', function () {
    secondWindow = null;
  });
}

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
  else if (secondWindow === null) {
    createSecondWindow();
  }
});

ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});


ipcMain.on('restart_app', () => {
    autoUpdater.quitAndInstall();
});

autoUpdater.on('checking-for-update' , () => {
  mainWindow.webContents.send('checking-for-update');
});


autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update-available');
});


autoUpdater.on("update-not-available" , () => {
  mainWindow.webContents.send('update-not-available');
});

autoUpdater.on("download-progress" , (progressObj) => {
    let percent = progressObj.percent;
    mainWindow.webContents.send('percent' , percent);
});


autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update-downloaded');
});

