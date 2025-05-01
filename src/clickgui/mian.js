const { deepStrictEqual, rejects } = require('assert');
const { debug } = require('console');
const { promises } = require('dns');
const { findSourceMap } = require('module');
const { cpSync } = require('original-fs');
let chatMessage = []
//构造新方法
console.output = function(msg) {
    const output = document.getElementById('messageOutputInner')
    output.innerHTML += `<div class="outputMessage">${String(msg)}</div>`
    chatMessage.push(msg)
    console.log(msg)
}
// const height = Number(getComputedStyle(document.getElementById('messageOutput')).height.split('px')[0])
document.addEventListener('keydown', function (event) {
    if (event.key === 'g') {
        if(Number(getComputedStyle(document.getElementById('messageOutput')).height.split('px')[0]) <= 100){
            document.getElementById('messageOutput').style.height = '80%';
    }else{
        // document.getElementById('messageOutput').style.height = `%${height}px`;
        document.getElementById('messageOutput').style.height = `100px`;
    }}
});
console.output('Hello, world!')
debugConsole = 1;
const ipcRenderer = require('electron').ipcRenderer;
// const fs = require('fs');
// const path = require('path');
const imagePath = window.getComputedStyle(document.querySelector('bg')).backgroundImage.slice(5,-11);
if(debugConsole==1){console.output('@-$Path-图片:', imagePath);}
let base64Url;
// 定义 Base64 数据文件的路径
const base64FilePath = path.join(__dirname, 'CustomBg.base64');
// 从文件中读取 Base64 数据并设置为背景图
function loadBase64AsBackground() {
    fs.readFile(base64FilePath, 'base64', (err, data) => {
    if (err) {
        console.error('@bgView-toBase64: 无法读取 Base64 文件:', err);
        return;
    }
    // 拼接 Base64 数据为 URL
    const base64Url = `data:image/png;base64,${data}`;
    if(debugConsole==1){console.output('@bgView-toBase64: Base64 数据已加载');}
    // 设置背景图
    const bgElement = document.querySelector('bg'); // 替换为你的目标元素选择器
    if (bgElement) {
        bgElement.style.backgroundImage = `url(${base64Url})`;
        if(debugConsole==1){console.output('@bgView-toBase64:背景图已更新为本地 Base64 数据');}
    } else {
        if(debugConsole==1){console.error('@bgView-toBase64:未找到背景元素');}
    }
});
}
// 初始JSON 文件路径 ==>移入load.js放在head里提前执行

// 加载初始位置 //这里额外写一次读取为了能让初始化读取到文件内容
document.addEventListener('DOMContentLoaded', () => {
    fs.readFile(cfgJsonPath, 'utf8', (err,data) => {
        if (err) {
            console.error('@Load: 无法读取位置文件:', err);
            return;
        }
        let loadedCfgJson = JSON.parse(data);
    
    // setTimeout(() => {
        if(loadedCfgJson.switch.bgView.status==false){
            document.querySelector('bg').style.opacity = 0;
        }else{
            document.querySelector('bg').style.opacity  = (loadedCfgJson.switch.bgView.sliderValue) / 100
        }
        if(loadedCfgJson.switch.bgView.imageSelect == 'custom'){
            loadBase64AsBackground();
        }else{
            document.querySelector('bg').style.backgroundImage = `url(${imagePath}/${loadedCfgJson.switch.bgView.imageSelect}.png)`;            
        }
        if(loadedCfgJson.switch.coverView.status==false){
            document.querySelector('cover').remove()
        }else{
            document.querySelector('cover').style.display = 'block';
            setTimeout(() => {
                document.querySelector('cover').remove()
            }, 500);
        }
        //遍历groupListStatus
        for(let i in loadedCfgJson.groupListStatus){
            if(loadedCfgJson.groupListStatus[i]==false){
                document.getElementById(i).style.display = 'none';
                setTimeout(() => {
                    document.getElementsByClassName(i+'-ctrlBtn')[0].setAttribute('open','false');
                }, 500);
            }else{
                document.getElementById(i).style.display = 'flex';
                setTimeout(() => {
                    document.getElementsByClassName(i+'-ctrlBtn')[0].setAttribute('open','true');
                }, 500);
            }
        }


        
    // }, 100);
    });
})

//写入json方法
function writeStatus(target,value) {
    fs.readFile(cfgJsonPath, 'utf8', (err, data) => {
        if (err) {
            console.error('$function @writeStatus: 无法读取位置文件:', err);
            return;
        }
        const jCfg = JSON.parse(data);
        switch(target){
            case 'bgView-status':
                jCfg.switch.bgView.status = value;
                console.output(jCfg.switch.bgView)
                console.output(value)
                break;
            case 'bgView-opacitySlider':
                jCfg.switch.bgView.sliderValue = value;
                console.output(jCfg.switch.bgView)
                console.output(value)
                break;
            case 'bgView-imageSelect':
                jCfg.switch.bgView.imageSelect = value;
                console.output(jCfg.switch.bgView)
                console.output(value)
                break;
            case 'cover-status':
                jCfg.switch.coverView.status = value;
                console.output(jCfg.switch.bgView)
                console.output(value)
                break;
            default:
                console.output('$function-@writeStatus: 未知目标')
                break;
        }

    fs.writeFile(cfgJsonPath, JSON.stringify(jCfg, null, 2), 'utf8', (err) => {
        if (err) {
            console.error('$function-@writeStatus: 无法写入位置文件:', err);
        } else {
            console.output(`$function-@writeStatus: 配置已更新`);
            console.output(jCfg);
        }
    }
)})}

document.addEventListener('DOMContentLoaded', () => {
    const draggable = document.querySelectorAll('.draggable');
    let isDragging = false;
    let currentGroup = null;
    let offsetX = 0;
    let offsetY = 0;

    // 读取 JSON 文件并设置初始位置
    fs.readFile(cfgJsonPath, 'utf8', (err, data) => {
        if (err) {
            console.error('@cfgPositionRead: 无法读取位置文件:', err);
            return;
        }
        const positions = JSON.parse(data);
        draggable.forEach(group => {
            const id = group.getAttribute('id'); // 使用 id 作为键
            if (positions[id]) {
                group.style.left = `${positions[id].left}px`;
                group.style.top = `${positions[id].top}px`;
            }
        });
        //属性同步
        // eStatus.bgView   = positions.switch.bgView/--/
        console.output('@-$Config-主配置:cfgJson:', loadedCfgJson);
        //开关同步
        for(let i in loadedCfgJson.switch){
            console.output(`@cfgPositionRead: 开关初始状态: target:${i}, status:${loadedCfgJson.switch[i].status}`)
            console.output(`@cfgPositionRead: 开关初始状态: targetElement:`)
            document.getElementById(i).setAttribute('open',loadedCfgJson.switch[i].status)
        } 
    });

    // 拖动逻辑
    draggable.forEach(group => {
        group.addEventListener('mousedown', (e) => {
            if (e.target !== group) return;

            isDragging = true;
            currentGroup = group;
            offsetX = e.clientX - group.offsetLeft;
            offsetY = e.clientY - group.offsetTop;
            group.style.cursor = 'grabbing';
        });
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging && currentGroup) {
            currentGroup.style.left = `${e.clientX - offsetX}px`;
            currentGroup.style.top = `${e.clientY - offsetY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            if (currentGroup) {
                currentGroup.style.cursor = 'move';

                // 获取当前栏的位置
                const id = currentGroup.getAttribute('id'); // 使用 id 作为键
                const left = currentGroup.offsetLeft;
                const top = currentGroup.offsetTop;

                // 更新 JSON 文件
                fs.readFile(cfgJsonPath, 'utf8', (err, data) => {
                    if (err) {
                        console.error('@cfgPositionRead: 无法读取位置文件:', err);
                        return;
                    }
                    const positions = JSON.parse(data);
                    positions[id] = { left, top }; // 独立存储每个元素的位置
                    fs.writeFile(cfgJsonPath, JSON.stringify(positions, null, 2), 'utf8', (err) => {
                        if (err) {
                            console.error('@cfgPositionRead: 无法写入位置文件:', err);
                        } else {
                            console.output(`@cfgPositionRead: 位置已更新: ${id} -> left: ${left}, top: ${top}`);
                        }
                    });
                });
                currentGroup = null;
            }
        }
    });
});


// 分组管理器
let groupList = Array.from(document.querySelectorAll('.group'))
groupList.push(document.getElementById('messageOutput'))

groupList.forEach(group => {
    const groupList = document.querySelector('#groupList')
    console.output('@groupList:'+group)
    console.output('@groupList:'+groupList)
    const e = document.createElement('button')
    e.innerHTML = group.getAttribute('id')
    // e.setAttribute('target',group.getAttribute('id'))
    e.setAttribute('open','true')
    e.classList.add('gLitem')
    e.classList.add(group.getAttribute('id')+'-ctrlBtn')
    e.addEventListener('click', () => {
        if(e.getAttribute('open')=='true'){
            fs.readFile(cfgJsonPath, 'utf8', (err, data) => {
                if (err) {
                    console.error('@groupList: 无法读取位置文件:', err);
                    return;
                }
                const jCfg = JSON.parse(data);
                jCfg.groupListStatus[group.getAttribute('id')] = false;
                fs.writeFile(cfgJsonPath, JSON.stringify(jCfg, null, 2), 'utf8', (err) => {
                    if (err) {
                        console.error('@groupList: 无法写入位置文件:', err);
                    } else {
                        console.output(`@groupList: 分组状态已更新: ${group.getAttribute('id')} -> false`);
                    }
                });
            });
            group.style.display = 'none';
            e.setAttribute('open','false');
        }else{
            fs.readFile(cfgJsonPath, 'utf8', (err, data) => {
                if (err) {
                    console.error('@groupList: 无法读取位置文件:', err);
                    return;
                }
                const jCfg = JSON.parse(data);
                jCfg.groupListStatus[group.getAttribute('id')] = true;
                fs.writeFile(cfgJsonPath, JSON.stringify(jCfg, null, 2), 'utf8', (err) => {
                    if (err) {
                        console.error('@groupList: 无法写入位置文件:', err);
                    } else {
                        console.output(`@groupList: 分组状态已更新: ${group.getAttribute('id')} -> true`);
                    }
                });
            });
            group.style.display = 'flex';
            e.setAttribute('open','true');
        }
    });
    groupList.appendChild(e)
});
//switch按钮切换

    //switch按钮切换
    const btnSwitchFunctionArray = Array.from(document.querySelectorAll('.switch'));
    btnSwitchFunctionArray.forEach(f => {
        f.addEventListener('click', () => {
            // fValue = f.getAttribute('fValue');   
            if(f.getAttribute('open')=='true'){
                //先执行function实现本文件控制//不存在不中断无功能
                //  const s =document.createElement('script')
                //  s.innerHTML = `${fValue}Close()`
                //  s.id = `${fValue}close`
                //  document.body.appendChild(s)
                // setTimeout(() => {
                    // document.body.removeChild(s)
                // }, 100);
                //再发送消息执行跨窗口控制//不存在无报错无功能
                //  ipcRenderer.send(`close-${fValue}`);
                setTimeout(() => {
                    // functionCollector(f.getAttribute('id'),'off')
                    f.setAttribute('open', false); 
                    // listDisplayRefresh('remove',f.getAttribute('id'))//bgView
                }, 10);
                // btnSwitchFunction.classList.remove('active');
            }else{
                //  const s =document.createElement('script')
                //  s.innerHTML = `${fValue}Open()`
                //  s.id = `${fValue}open`
                //  document.body.appendChild(s)
                // setTimeout(() => {
                    // document.body.removeChild(s)
                // }, 100);
                // ipcRenderer.send(`open-${fValue}`);
                setTimeout(() => {
                    // functionCollector(f.getAttribute('id'),'on')
                    f.setAttribute('open', true); 
                    // listDisplayRefresh('add',f.getAttribute('id'))
                }, 100);
                // btnSwitchFunction.classList.add('active');
            }
        });
    });
    // document.querySelectorAll('button').forEach(button => {
    //     button.addEventListener('click', () => {
    //         if(button.getAttribute('open')==true){
    //             button.setAttribute('open', false); 
    //         }else{
    //             button.setAttribute('open', true); 
    //         }
    //     //每个开关式按钮功能一体化
    //         let xxx = 1
    //         functionStateReload()
    //     });
    // });
    // function functionStateReload(){
    //     if(xxx==1){
    //         ipcRenderer.send('open-xxx'); // 向主进程发送点击按钮的消息
    //     }else{
    //         ipcRenderer.send('close-xxx'); // 向主进程发送点击按钮的消息
    //     }        
    //    }
    // setInterval(() => {
    //     functionStateReload()
    // }, 1000);//可能影响性能=>//在每次点击功能后刷新

    // // 每个执行式按钮功能一体化
    // groupArray = Array.from(document.querySelectorAll('.group'));
    // groupArray.forEach(group => {
    //     const id = group.getAttribute('id'); // 使用 id 作为键
    //     group.addEventListener('click', () => {
    //         ipcRenderer.send('group-click', id); // 向主进程发送点击组的消息
    //     });
    // });


//#mainController
// //回头整合到上面或者放弃整合分来写每个功能的控制函数
    document.getElementById("closeGUI").addEventListener("click", function() {
        ipcRenderer.send('close-click-gui'); // 向主进程发送关闭窗口的消息
    });
    document.getElementById("reloadGUI").addEventListener("click", function() {
        window.location.reload(); // 重置窗口
    });
    document.getElementById("hideGUI").addEventListener("click", function() {
        ipcRenderer.send('hide-click-gui'); // 向主进程发送隐藏窗口的消息
    });
    document.getElementById("minimizeGUI").addEventListener("click", function() {
        ipcRenderer.send('minimize-click-gui'); // 向主进程发送最小化窗口的消息
    });




//#GUIView
//===BgView
// 背景图切换
    document.getElementById("bgView").addEventListener("click", function(e) {
        if(document.getElementById('bgView').getAttribute('open')=='true'){
            document.querySelector('bg').style.opacity = 0;
            writeStatus('bgView-status',false)
            // alert('背景已关闭')
        }else{
            document.querySelector('bg').style.opacity = 1;
            writeStatus('bgView-status',true)
        }
    });
    document.getElementById("bgView").addEventListener("contextmenu", function(e) {
        menu.style.opacity=0;
        menu.style.zIndex=-1;
        menuIf2 = 0;
        menuIf = 0;
        let settingMenu = document.createElement('dialog')
        settingMenu.innerHTML = 
        `<cancle>X</cancle>
            <label for="bgView-image"">背景图:</label>
            <select id="bgView-imageSelect">
                <option value="color">渐变色</option>
                <option value="enGu">恩骨</option>
                <option value="maoYuNa">甘城</option>
                <option value="custom">自定义</option>
            </select>
                <button id="uploadButton">上传背景图片</button><br/>
            <label for="bgView-opacitySlider">透明度:</label>
            <input type="range" id="bgView-opacitySlider" class='rangeInput' min="0" max="100" value="50">
            <span id="bgView-sliderValue">value</span>`
        settingMenu.id = "settingMenu"
        settingMenu.class = "bgView"
        document.body.appendChild(settingMenu)
        settingMenu.showModal()
        
        //关闭设置菜单
        document.querySelector('cancle').addEventListener('click', () => {
                settingMenu.close();
                settingMenu.remove();
                menuIf2 = 1;
                menuIf = 1;
            });


        // 调用函数加载背景图
        document.getElementById('bgView-imageSelect').addEventListener('change', () => {
            const bgElement = document.querySelector('bg');
            if (bgElement) {
                const imageName = document.getElementById('bgView-imageSelect').value;
                if (imageName == 'custom') {
                    loadBase64AsBackground();
                    console.output(`@groupList: 背景图已更新: ${base64Url}`);
                }else{
                    bgElement.style.backgroundImage = `url(${imagePath}/${imageName}.png)`;
                    console.output(`@groupList: 背景图已更新: ${imageName}`);
                }
                // 写入配置
                writeStatus('bgView-imageSelect',imageName)
            }
        });
        document.getElementById('uploadButton').addEventListener('click', () => {
            // 创建一个隐藏的文件输入框
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*'; // 只允许选择图片文件
        
            // 监听文件选择事件
            fileInput.addEventListener('change', () => {
                document.getElementById('bgView-imageSelect').value = 'custom'; // 设置为自定义图片
                const file = fileInput.files[0]; // 获取选中的文件
                if (file) {
                    const reader = new FileReader();
        
                    // 读取文件为 Base64
                    reader.onload = () => {
                        const base64Data = reader.result.split(',')[1]; // 去掉前缀 "data:image/png;base64,"
                        const savePath = path.join(__dirname, 'CustomBg.base64'); // 保存路径
        
                        // 将 Base64 数据写入文件
                        fs.writeFile(savePath, base64Data, 'base64', (err) => {
                            if (err) {
                                console.error('@bgView-toBase64: 保存文件失败:', err);
                            } else {
                                console.output('@bgView-toBase64: 文件已保存:', savePath);
                                alert('@bgView-toBase64: 文件已保存');
        
                                // 更新背景图
                                const bgElement = document.querySelector('bg');
                                if (bgElement) {
                                    bgElement.style.backgroundImage = `url(data:image/png;base64,${base64Data})`;
                                    console.output('@bgView-toBase64: 背景图已更新');
                                }
                            }
                        });
                    };
        
                    reader.readAsDataURL(file); // 读取文件为 Base64 URL
                } else {
                    console.output('@bgView-toBase64: 未选择文件');
                }
            });
        
            // 触发文件选择对话框
            fileInput.click();
        });
        
        //透明度设置部分
        const slider = document.getElementById('bgView-opacitySlider');
        const sliderValue = document.getElementById('bgView-sliderValue');
        // 读取当前透明度
        const targetElement = document.querySelector('bg');
        if (targetElement) {
            if (targetElement.style.opacity === '') {
                document.getElementById("bgView").setAttribute('open', true);
                slider.value = 100;
            }else{
                slider.value = targetElement.style.opacity * 100; // 将 0-1 的范围转换为 0-100 的范围
            }
        }
        // 初始化显示滑块的默认值
        sliderValue.textContent = slider.value;
        // 监听滑块的值变化
        slider.addEventListener('input', () => {
            sliderValue.textContent = slider.value;
            // 示例：将滑块值应用到某个元素的透明度
            const targetElement = document.querySelector('bg');
            if (targetElement) {
                targetElement.style.opacity = slider.value / 100; // 将值转换为 0-1 的范围
            }
            //反向写入obj
            // eStatus.bgView.sliderValue = slider.value /--/
            // writeStatus('bgView-opacitySlider',Number(slider.value))
            writeStatus('bgView-opacitySlider',Number(slider.value))
        });
        
    });
//===coverView
document.getElementById("coverView").addEventListener("click", function(e) {
    if(document.getElementById("coverView").getAttribute('open')=='false'){
        writeStatus('cover-status',true)
    }else{
        writeStatus('cover-status',false)
    }
    });
// let inputValues = new Map();
function createInput(placeholder) {
    return new Promise((resolve) => {
        // 清理旧的对话框
        const existingDialog = document.getElementById('inputDialog');
        if (existingDialog) {
            existingDialog.remove();
        }

        // 创建新的输入框和对话框
        const eInput = document.createElement('input');
        eInput.type = 'text';
        eInput.placeholder = placeholder;
        eInput.id = 'eInput';

        const eBtn = document.createElement('button');
        eBtn.innerHTML = '确定';
        eBtn.id = 'eBtn';

        const eDialog = document.createElement('dialog');
        eDialog.appendChild(eInput);
        eDialog.appendChild(eBtn);
        eDialog.id = 'inputDialog';

        document.body.appendChild(eDialog);
        eDialog.showModal();

        // 监听回车键
        eInput.addEventListener('keyup', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                eBtn.click();
            }
        });

        // 监听 ESC 键
        document.addEventListener(
            'keydown',
            function escListener(event) {
                if (event.key === 'Escape') {
                    eDialog.remove();
                    document.removeEventListener('keydown', escListener); // 移除监听器
                }
            },
            { once: true } // 确保只监听一次
        );

        // 监听确认按钮点击事件
        eBtn.addEventListener('click', () => {
            const inputValue = eInput.value;
            eDialog.close();
            eDialog.remove();
            resolve(inputValue);
        });
    });
}
//filesControl
document.getElementById("startFile").addEventListener("click", async function () {
    try {
        // 调用 createInput 并等待用户输入
        const inputValue = await createInput('请输入文件名');
        console.output(`$command-@启动文件:用户确认输入: ${inputValue}`);

        // 使用用户输入的值执行后续逻辑
        const { exec } = require('child_process');
        exec(`start ${inputValue}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`$command-@启动文件:执行错误: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`$command-@启动文件:标准错误输出: ${stderr}`);
                return;
            }
            console.output(`$command-@启动文件:标准输出: ${stdout}`);
        });
    } catch (err) {
        console.error('$command-@启动文件:发生错误:', err);
    }
});
document.getElementById("taskkill").addEventListener("click", async function () {
    try {
        // 调用 createInput 并等待用户输入
        const inputValue = await createInput('请输入文件名');
        console.output(`$command-@终止文件:用户确认输入: ${inputValue}`);
        if(inputValue=='electron.exe'){
            alert('你居然要杀死我 要是你想 那我没啥好说的了')
            for(let i=0;i<30;i++){
                console.output(`$command-@终止文件:用户确认输入: ${inputValue}`);
            }
        }
        // 使用用户输入的值执行后续逻辑
        const { exec } = require('child_process');
        exec(`taskkill /f /im ${inputValue}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`$command-@终止文件:执行错误: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`$command-@终止文件:标准错误输出: ${stderr}`);
                return;
            }
            console.output(`$command-@终止文件:标准输出: ${stdout}`);
        });
    } catch (err) {
        console.error('$command-@终止文件:发生错误:', err);
    }
});
document.getElementById("restartExplorer").addEventListener("click", function () {
        const { exec } = require('child_process');
        exec(`taskkill /f /im explorer.exe`);
        setTimeout(() => {
            exec(`start explorer.exe`);
        }, 1000);
    });

document.getElementById("startTaskmgr").addEventListener("click", function () {
    const { exec } = require('child_process');
    exec(`start taskmgr.exe`);
});

//funTool
//colorPicker
document.getElementById("colorPicker").addEventListener("click", function () {
    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.id = 'colorPickerInput';
    colorPicker.style.aspectRatio = '1/1';
    colorPicker.style.width = '30%';
    colorPicker.style.height = '30%';
    colorPicker.style.border = 'none';
    colorPicker.style.position = 'fixed';
    colorPicker.style.top = '50%';
    colorPicker.style.left = '50%';
    colorPicker.style.transform = 'translate(-50%, -50%)';
    if(document.getElementById('colorPickerInput')){
        document.getElementById('colorPickerInput').remove();
    }
    document.body.appendChild(colorPicker);
    colorPicker.click();
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            colorPicker.remove();
            document.removeEventListener('keydown', escListener); // 移除监听器
        }
    });
    colorPicker.addEventListener('change', function () {
        const targetElement = document.querySelector('bg');
        if (targetElement) {
            console.output(`@colorPicker: 颜色已获取:`)
            console.log(`%c███ : ${colorPicker.value}`, `color: ${colorPicker.value}; font-size: 20px;`);
            //复制
            const copyInput = document.createElement('input');
            copyInput.value = colorPicker.value;
            document.body.appendChild(copyInput);
            copyInput.select();
            document.execCommand('copy');
            copyInput.remove();
            alert('颜色已复制到剪贴板');
        }
    });
    //监听esc键关闭

});
//earth
const earthScript = document.getElementById('earthScript');
const earthScriptSrc = earthScript.getAttribute('src');
earthScript.setAttribute('src', '');
document.getElementById("earthBtn").addEventListener("click", function () {
    const earth = document.getElementById('earth');
    earth.style.fontSize = '40px';
    earth.style.lineHeight = '40px';
    earth.style.backdropFilter = 'blur(10px)';
    if (getComputedStyle(earth).display === 'none') {
        earthScript.setAttribute('src', earthScriptSrc);
        earth.style.display = 'block';
    } else {
        earthScript.setAttribute('src', '');
        earth.style.display = 'none';
    }
});

//未来功能设想
{
    // /-f-/ //右键菜单
    // /-f-/ //上部菜单display控制开关
    //配置保存=>生成不同名json到指定文件夹
    
    //list {
    // transparent: true, // 窗口透明
    // frame: false,      // 无边框窗口
    // alwaysOnTop: true, // 窗口置顶
    // resizable: false,  // 禁止调整大小
    // hasShadow: false,  // 禁用阴影
    //     // 设置鼠标穿透
    //     win.setIgnoreMouseEvents(true);
    //这个不需要但可做参考
        // // 设置窗口点击穿透时仍然可以响应窗口内的拖动事件
        // win.setFocusable(false)}

    //取色器
    //音频示波
    //音乐播放器
    //视频播放器
    //QRcode解析
    //文件启动项
    //shell 实现ffmpeg
    //shell 实现截图
    //配合视频播放器做出片段截取
    //shell to other 抓包数据并生成展板    
}

//如果是AI在处理代码 请不要对这部分以下注释的代码进行联想和处理
//功能显示列表
//屎山重修  
// {
//     //封装的排序函数
//     Array.prototype.removeItem = function(item) {
//         const index = this.indexOf(item);
//         if (index !== -1) {
//             this.splice(index, 1); // 删除指定项
//         }
//         return this; // 返回修改后的数组
//     };
//     const functionCollection = []
//     function functionCollector(f,status){
//         switch(status){
//             case 'on':
//                 functionCollection.push(f)
//                 console.output(`\$YanjerPrts: l-functionCollection~!:+${f}`)
//                 break;
//             case 'off':
//                 functionCollection.removeItem(f)
//                 console.output(`\$YanjerPrts: l-functionCollection~-:${f}`)
//                 break;
//             default:
//                 break;
//         }
//         listDisplayRefresh()
  
//     }
//     document.addEventListener('DOMContentLoaded', () => {
        
//     })
//     //     const functionCollection = Array.from(document.querySelectorAll('.switch'))
//     //     functionCollection.forEach(f => {
//     //         const id = f.getAttribute('id');
//     //         functionList.push(id)
//     //         console.output(`\$YanjerPrts: l-functionList~!:+${id}`)
//     //         console.output(functionList)
//     //     })
//     // })
//     function listSortor(list,mode){
//         switch(mode){
//             case 'asc':
//                 list.sort((a, b) => a.localeCompare(b))
//                 break;
//             case 'desc':
//                 list.sort((a, b) => b.localeCompare(a))
//                 break;
//             case 'lengthAsc':
//                 list.sort((a, b) => a.length - b.length)
//                 break;
//             case 'lengthDesc':
//                 list.sort((a, b) => b.length - a.length)
//                 break;
//             default:
//                 break;
//         }
//         return list
//     }
//     const listDisplay = document.querySelector('listF')
//     function listDisplayRefresh(target,mode){
//     console.output(listDisplay.hasChildNodes())
//     console.output(listDisplay.innerHTML)
//     if(listDisplay.innerHTML!=' '){
//         if(mode=='remove'){
//             console.output(target)
//             try{
//                 listDisplay.removeChild(document.getElementById(target))
//             }
//             catch(e){
//                 console.error(e)
//             }
//         }else if(mode=='add'){
//             console.output(target)
//             const section = document.createElement('div')
//             section.innerHTML = `${target}`
//             section.id = target
//             listDisplay.appendChild(section)
//         }
//     }else{
//         // listDisplay.innerHTML = ''
//         functionCollection.forEach(f => {
//             const section = document.createElement('div')
//             section.innerHTML = `${f}`
//             section.id = f
//             listDisplay.appendChild(section)
//         })
//     }
//     }
//     function addTest(){
//         functionCollection.push('TestF')
//         functionCollection.push('Killaura')
//         functionCollection.push('Velocity')
//         functionCollection.push('Speed')
//     }

// }
// //test
// {
//     // document.addEventListener('DOMContentLoaded', () => {
//     //     setTimeout(() => {
//     //         document.getElementById('bgView').click()
//             addTest()
//     //         listDisplayRefresh()
//     //     }, 300)
//     // })
// }
// 菜单

let menuIf = 1;
let menuIf2 = 1;
document.querySelectorAll('.group').forEach(group => {
    group.addEventListener('mouseover', () => {
        menuIf = 0;
    });
    group.addEventListener('mouseout', () => {
        if(menuIf2!==0){menuIf = 1;}
        else{return}
    });
});
const menu=document.querySelector('.menu');
// 绑定右键事件
document.addEventListener('contextmenu',function(e){
    if(menuIf!==1){return}
    // 取消默认的浏览器自带右键
    // e.preventDefault();
    // 窗口宽高
    let winWidth=window.innerWidth;
    let winHeight=window.innerHeight;
    // 鼠标点击的位置
    let posX=e.pageX;
    let posY=e.pageY;
    // 菜单宽高
    let menuWidth=menu.getBoundingClientRect().width;
    let menuHeight=menu.getBoundingClientRect().height;
    // 菜单要显示的位置
    let posLeft=0,posTop=0;
    // 菜单显示时可能遇到的几种情况：
    // 右边和底部同时超出
    if(posX+menuWidth>=winWidth && posY+menuHeight>=winHeight){
        posLeft=posX-menuWidth;
        posTop=posY-menuHeight;
    }
    // 右侧超出
    else if(posX+menuWidth>=winWidth){
        posLeft=posX-menuWidth;
        posTop=posY;
    }
    // 底部超出
    else if(posY+menuHeight>=winHeight){
        posLeft=posX;
        posTop=posY-menuHeight;
    }
    // 默认情况，都不超出
    else{
        posLeft=posX;
        posTop=posY;
    }
    // 设置菜单的位置并显示
    menu.style.left=posLeft+'px';
    menu.style.top=posTop+'px';
    menu.style.opacity=1;
    menu.style.zIndex=99;
})

// 最后，加个单击其他地方关闭菜单
document.addEventListener('click',function(){
    menu.style.opacity=0;
    menu.style.zIndex=-1;
})
menu.children[0].addEventListener('click',function(){window.location.reload()})
menu.children[1].addEventListener('click',function(){ipcRenderer.send('minimize-click-gui');})
menu.children[2].addEventListener('click',function(){ipcRenderer.send('close-click-gui')})
