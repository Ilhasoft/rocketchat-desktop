const { app, BrowserWindow, ipcMain, shell } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    icon: path.join(__dirname, "assets/logo.ico"),
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true,
    },
  });

  win.setMenuBarVisibility(false);

  ipcMain.on("changeMessagesCounter", (event, totalMessages) => {
    let fileName = "";

    if (totalMessages === "•") {
      fileName = "messages.png";
    } else if (totalMessages >= 1 && totalMessages <= 9) {
      fileName = `messages_${totalMessages}.png`;
    } else if (totalMessages > 9) {
      fileName = "messages_+9.png";
    }

    if (fileName) {
      win.setOverlayIcon(
        path.join(__dirname, "assets", fileName),
        `${totalMessages} messages`
      );
    } else {
      win.setOverlayIcon(null, "");
    }
  });

  win.loadFile("index.html");
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("web-contents-created", (event, contents) => {
  if (contents.getType() == "webview") {
    contents.on("new-window", (event, url) => {
      event.preventDefault();
      shell.openExternal(url);
    });
  }
});
