const { app, BrowserWindow,ipcMain,ipcRenderer,dialog } = require('electron');
const path = require('node:path');

if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 173,
    height: 266,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      webSecurity: false,
      allowRunningInsecureContent: true,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.webContents.openDevTools();
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// const { app, BrowserWindow, ipcMain } = require('electron');
// const path = require('node:path');

let clickGuiWindow = null; // 用于存储 clickGui 窗口的引用

function clickGui() {
  // 如果窗口已经存在，则不重复创建
  if (clickGuiWindow) {
    clickGuiWindow.focus();
    return;
  }

  clickGuiWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    fullscreen: true,
    frame: false,
    transparent: true,
    resizable: true,
    movable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  clickGuiWindow.loadFile(path.join(__dirname, 'clickgui.html'));
  clickGuiWindow.webContents.openDevTools();
  // 当窗口关闭时，将引用置为 null
  clickGuiWindow.on('closed', () => {
    clickGuiWindow = null;
  });
}

// 监听渲染进程的消息
ipcMain.on('open-click-gui', () => {
  if (clickGuiWindow) {
    clickGuiWindow.focus();
    return;
  }
  //如果hide
  else if (clickGuiWindow && clickGuiWindow.isMinimized()) {
    clickGuiWindow.restore();
  }else{
    if (clickGuiWindow) {
      clickGuiWindow.show(); // 重新显示窗口
    }else{
      clickGui();
    }
  }
});

ipcMain.on('close-click-gui', () => {
  if (clickGuiWindow) {
    clickGuiWindow.close();
  }
});

ipcMain.on('hide-click-gui', () => {
  if (clickGuiWindow) {
    clickGuiWindow.hide();
  }
});
ipcMain.on('minimize-click-gui', () => {
  if (clickGuiWindow) {
    clickGuiWindow.minimize();
  }
});

