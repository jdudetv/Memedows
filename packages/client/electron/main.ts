import { app, BrowserWindow, ipcMain } from "electron";
import * as isDev from "electron-is-dev";

let win: BrowserWindow | null = null;

app.commandLine.appendSwitch("disable-features", "OutOfBlinkCors");
app.commandLine.appendSwitch("disable-renderer-backgrounding");
app.allowRendererProcessReuse = false;

ipcMain.on("log", (_, arg) => console.log(arg));

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      webSecurity: false,
      backgroundThrottling: false,
    },
  });

  if (isDev) {
    win.loadURL("http://localhost:3002/index.html");
  } else {
    // 'build/index.html'
    win.loadURL(`file://${__dirname}/../index.html`);
  }

  win.on("closed", () => (win = null));

  // // DevTools
  // installExtension(REACT_DEVELOPER_TOOLS)
  //   .then((name) => console.log(`Added Extension:  ${name}`))
  //   .catch((err) => console.log('An error occurred: ', err));

  if (isDev) {
    win.webContents.openDevTools();
  }
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (win === null) {
    createWindow();
  }
});
