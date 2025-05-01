const { BrowserWindow } = require('electron');
const path = require('path');
// const sass = require('sass');
const fs = require('fs');
// const { exec } = require('child_process');

// let loadScss = (scssFilePath, cssFilePath) => {
//     // 执行 Shell 命令
//     exec(`scss ${scssFilePath} ${cssFilePath}`, (error, stdout, stderr) => {
//         if (error) {
//             console.error(`执行错误: ${error.message}`);
//             return;}
//         if (stderr) {
//             console.error(`标准错误输出: ${stderr}`);
//             return;}
//         console.log(`标准输出: ${stdout}`);});}

// const scssFiles = [];
// scssFiles.push('loading')
// scssFiles.forEach((file) => {
//     // SCSS 文件路径
//     const scssFilePath = path.join(__dirname, 'clickgui', file+ '.scss');
//     // 输出的 CSS 文件路径
//     const cssFilePath = path.join(__dirname, 'clickgui', file   +'.css');
//     loadScss(scssFilePath, cssFilePath);
// });
// 编译 SCSS 文件
// sass.render(
//   {
//     file: scssFilePath,
//     outputStyle: 'compact', // 可选：'nested', 'expanded', 'compact', 'compressed'
//   },
//   (err, result) => {
//     if (err) {
//       console.error('SCSS 编译失败:', err);
//       alert('SCSS 编译失败，请检查文件路径是否正确。');
//     } else {
//       // 写入编译后的 CSS 文件
//       fs.writeFile(cssFilePath, result.css, (writeErr) => {
//         if (writeErr) {
//           console.error('写入 CSS 文件失败:', writeErr);
//           alert('写入 CSS 文件失败，请检查文件路径是否正确。');
//         } else {
//           console.log('SCSS 编译成功，CSS 文件已生成:', cssFilePath);
//           alert('SCSS 编译成功，CSS 文件已生成。');
//         }
//       });
//     }
//   }
// );



// document.getElementById('clickGUIBtn').addEventListener('click',() => {
//     clickGui();
//     alert('ClickGUI has been opened.');
// });

const { ipcRenderer } = require('electron');

// 监听按钮点击事件，向主进程发送消息
document.getElementById('clickGUIBtn').addEventListener('click', () => {
    ipcRenderer.send('open-click-gui'); // 向主进程发送打开窗口的消息
});

document.getElementById('closeGUIBtn').addEventListener('click', () => {
    ipcRenderer.send('close-click-gui'); // 向主进程发送关闭窗口的消息
});