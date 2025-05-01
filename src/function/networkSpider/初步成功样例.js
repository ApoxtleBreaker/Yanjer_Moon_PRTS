const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

(async function example() {
    let options = new chrome.Options();
    options.addArguments('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

    try {
        // 打开目标网页
        await driver.get('https://space.bilibili.com/1979641484');
        await driver.wait(until.elementLocated(By.id('h-name')), 1000);
        let userName = await driver.findElement(By.id('h-name')).getText();
        console.log(`用户名: ${userName}`);
    } finally {
        // 关闭浏览器
        await driver.quit();
    }
})();