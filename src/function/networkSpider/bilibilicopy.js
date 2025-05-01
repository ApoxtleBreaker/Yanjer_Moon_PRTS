const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
let uid = '1979641484';

(async function example() {
    let options = new chrome.Options();
    options.addArguments('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

    try {
                // 打开目标网页
                await driver.get(`https://space.bilibili.com/${uid}`);
        
                // 等待动态内容加载完成
                //h-name用户名
                await driver.wait(until.elementLocated(By.id('h-name')), 1000);
                //n-data-v  0关注 1粉丝 2获赞  3播放 5粉丝 6获赞
                await driver.wait(until.elementLocated(By.css('.n-data-v')), 1000);
                //
                let userName = await driver.findElement(By.id('h-name')).getText();
                let followers = await driver.findElement(By.css('.n-data-v:nth-child(1)')).getText();
                let fans = await driver.findElement(By.css('.n-data-v:nth-child(2)')).getText();
                let likes = await driver.findElement(By.css('.n-data-v:nth-child(3)')).getText();
                let views = await driver.findElement(By.css('.n-data-v:nth-child(4)')).getText();
                console.log(`用户名: ${userName}`);
                console.log(`关注: ${followers}`);
                console.log(`粉丝: ${fans}`);
                console.log(`获赞: ${likes}`);
                console.log(`播放: ${views}`);
    } finally {
        // 关闭浏览器
        await driver.quit();
    }
})();


//每次运行会在C:\Users\ApoxtleBreaker\AppData\Local\Temp生成临时文件 会占用大量磁盘空间，建议定时清理
//为了避免多次使用临时文件夹导致堆积无用记录，可以在程序运行结束时清理临时文件夹中创建的内容。以下是一些方法来管理和清理临时文件夹：

// 1. 使用 Node.js 的 fs 模块清理临时文件夹
// 在程序结束时，删除临时文件夹中创建的文件或目录。

// 示例代码：
// 说明：
// os.tmpdir()：获取系统的临时文件夹路径。
// fs.rmSync()：递归删除指定目录及其内容。
// user-data-dir：指定 Chrome 使用的用户数据目录。
// 2. 使用 tmp 库自动管理临时文件夹
// tmp 是一个专门用于管理临时文件和目录的库，可以在程序结束时自动清理。

// 安装 tmp：
// 示例代码：
// 说明：
// tmp.dirSync()：创建一个临时目录。
// unsafeCleanup: true：允许递归删除目录及其内容。
// removeCallback()：在程序结束时自动清理临时目录。
// 3. 定期清理系统临时文件夹
// 如果临时文件夹中堆积了大量无用文件，可以定期清理系统的临时文件夹。

// 手动清理：
// 打开临时文件夹：
// 按下 Win + R，输入 %TEMP%，然后按回车。
// 删除不需要的文件和文件夹。
// 自动清理脚本：
// 可以编写一个脚本定期清理临时文件夹中的旧文件。

// 4. 使用 Docker 或虚拟环境隔离临时文件
// 如果你的项目运行在 Docker 容器中，可以通过销毁容器来清理所有临时文件。

// 示例 Dockerfile：
// 运行容器后，临时文件会被隔离在容器中，销毁容器即可清理所有文件。

// 总结
// 推荐方法：
// 使用 fs.rmSync() 或 tmp 库在程序结束时清理临时文件夹。
// 定期清理：
// 编写脚本定期清理系统临时文件夹中的旧文件。
// 隔离环境：
// 使用 Docker 或虚拟环境隔离临时文件，避免污染主机系统。
// 通过这些方法，可以有效避免临时文件夹堆积无用记录的问题