const {app, BrowserWindow,Menu ,Tray } = require('electron')
const path = require('path')
const url = require('url')

// 保持一个对于 window 对象的全局引用，如果你不这样做，
// 当 JavaScript 对象被垃圾回收， window 会被自动地关闭
let win



//托盘对象
var appTray = null;

function createWindow () {
 // 创建浏览器窗口。
  win = new BrowserWindow({
    show: false,
    width: 1100,
    height: 600,
    backgroundColor: '#2e2c29',
    frame: true,
    minWidth: 1100,
		minHeight: 600
    })

//系统托盘右键菜单
var trayMenuTemplate = [
  {
      label: '设置',
      click: function () {} //打开相应页面
  },
   {
      label: '调试',
      click: function () {
        win.webContents.openDevTools();
      }
  },
  {
      label: '最小化',
      click: function () {
        win.minimize();
      }
  },
  {
      label: '最大化',
      click: function () {
        win.maximize();
      }
  },
  {
      label: '退出程序',
      click: function () {
          //ipc.send('close-main-window');
           app.quit();
      }
  }
];

//系统托盘图标目录
trayIcon = path.join(__dirname, 'tray');
appTray = new Tray(path.join(trayIcon, 'logo.ico'));
//图标的上下文菜单
const contextMenu = Menu.buildFromTemplate(trayMenuTemplate);
//设置此托盘图标的悬停提示内容
appTray.setToolTip('This is my application.');
//设置此图标的上下文菜单
appTray.setContextMenu(contextMenu);
 //单点击 1.主窗口显示隐藏切换 2.清除闪烁
 appTray.on("click", ()=>{
  if(!!timer){
    clearInterval(timer);
    appTray.setImage(path.join(trayIcon, 'logo.ico'))
      //主窗口显示隐藏切换
      win.isVisible() ? win.hide() : win.show();
  }
})

    // let child = new BrowserWindow({parent: win})
    // child.show()

    //使用ready-to-show事件
    //在加载页面时，渲染进程第一次完成绘制时，会发出 ready-to-show 事件 。
    // 在此事件后显示窗口将没有视觉闪烁
    win.once('ready-to-show', () => {
      win.show()
    })
  // 然后加载应用的 index.html。
 // win.loadURL('https://www.baidu.com/')
 win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // 打开开发者工具。
 win.webContents.openDevTools()

  // 当 window 被关闭，这个事件会被触发。
  win.on('closed', () => {
    // 取消引用 window 对象，如果你的应用支持多窗口的话，
    // 通常会把多个 window 对象存放在一个数组里面，
    // 与此同时，你应该删除相应的元素。
    win = null
  })
}

// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', createWindow)

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // 在macOS上，当单击dock图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  if (win === null) {
    createWindow()
  }
})

// 在这文件，你可以续写应用剩下主进程代码。
// 也可以拆分成几个文件，然后用 require 导入。






const ipc = require('electron').ipcMain;
//登录窗口最小化
ipc.on('window-min',function(){
  win.minimize();
})
//登录窗口最大化
ipc.on('window-max',function(){
  if(win.isMaximized()){
    win.restore();  
  }else{
    win.maximize(); 
  }
})
ipc.on('window-close',function(){
  win.close();
})

var timer= null;
ipc.on('news-new',function(){
  var count = 0;
  timer=setInterval(()=> {
    count++;
    if (count%2 == 0) {
     appTray.setImage(path.join(trayIcon, 'empty.png'))
    } else {
     appTray.setImage(path.join(trayIcon, 'logo.ico'))
    }
}, 600);

})


 //系统托盘图标闪烁
//  var shanTime={
// //   var count = 0,timer = null;
// //   timer=setInterval(()=> {
// //       count++;
// //       if (count%2 == 0) {
// //        appTray.setImage(path.join(trayIcon, 'empty.png'))
// //       } else {
// //        appTray.setImage(path.join(trayIcon, 'logo.ico'))
// //       }
// //   }, 600);
//     count:0,
//     timer:()=>{
//       var that= this;
//       count = that.count;
//       setInterval(()=> {
//           count++;
//           if (count%2 == 0) {
//           appTray.setImage(path.join(trayIcon, 'empty.png'))
//           } else {
//           appTray.setImage(path.join(trayIcon, 'logo.ico'))
//           }
//       }, 600);
//     }
//  }
//  function shanTime(){
//   var count = 0,timer = null;
//     timer=setInterval(()=> {
//       count++;
//       if (count%2 == 0) {
//        appTray.setImage(path.join(trayIcon, 'empty.png'))
//       } else {
//        appTray.setImage(path.join(trayIcon, 'logo.ico'))
//       }
//   }, 600);
//  }





