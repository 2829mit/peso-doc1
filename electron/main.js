import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // For simple functionality
    },
    autoHideMenuBar: true,
  });

  // Load the index.html of the app.
  // In development, you might want to load 'http://localhost:5173'
  // But for the build script to work simply, we load the file.
  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  } else {
    // During dev, load the built file or dev server if configured
    win.loadFile(path.join(__dirname, '../dist/index.html'));
    // win.loadURL('http://localhost:5173'); // Alternate dev method
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});