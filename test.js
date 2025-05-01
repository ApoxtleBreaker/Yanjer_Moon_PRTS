const { Builder, By, Key, until } = require('selenium-webdriver');

(async function example() {
    // 创建 WebDriver 实例
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        // 打开目标网页
        await driver.get('https://example.com');

        // 查找元素并获取内容
        let element = await driver.findElement(By.tagName('h1'));
        // console.log(await element.getText());
        console.log('元素内容:', await element.getText());

        // 等待某个条件（例如页面标题包含 "Example"）
        await driver.wait(until.titleContains('Example'), 10000);
    } finally {
        // 关闭浏览器
        await driver.quit();
    }
})();