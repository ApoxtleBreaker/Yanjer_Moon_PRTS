const { exec } = require('child_process');
let loadScss = (scssFilePath, cssFilePath) => {
    // 执行 Shell 命令
    exec(`scss ${scssFilePath} ${cssFilePath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`执行错误: ${error.message}`);
            return;}
        if (stderr) {
            console.error(`标准错误输出: ${stderr}`);
            return;}
        console.log(`标准输出: ${stdout}`);});}

const scssFiles = [];
scssFiles.push('loading')
scssFiles.forEach((file) => {
    const path = require('path'); 
    // SCSS 文件路径
    const scssFilePath = path.join(__dirname, 'clickgui', file+ '.scss');
    // 输出的 CSS 文件路径
    const cssFilePath = path.join(__dirname, 'clickgui', file   +'.css');
    loadScss(scssFilePath, cssFilePath);
});

const fs = require('fs');
const path = require('path');
let loadedCfgJson//初次的json
const cfgJsonPath = path.join(__dirname, './clickgui/positions.json');
// const cfgJsonPath = path.join(__filename, '../clickgui/positions.json');
console.log('位置文件路径:', cfgJsonPath);
fs.readFile(cfgJsonPath, 'utf8', (err,data) => {
    if (err) {
        console.error('无法读取位置文件:', err);
        return;
    }
    loadedCfgJson = JSON.parse(data);
});