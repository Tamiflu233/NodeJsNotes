const puppeteer = require('puppeteer');

async function test() {
  // puppeteer.launch实例开启浏览器
  // 可以传入一个options对象，可以配置为无界面浏览器，也可以配置为有界面浏览器
  // 无界面浏览器性能更高更快，有界面一般用于调试开发
  let options = {
    // 设置是否为无界面浏览器
    headless: false,
    // 设置视窗大小
    defaultViewport: {
      width: 1400,
      height: 800
    },
    // 设置放慢每个步骤的毫秒数
    slowMo: 250,
    // 设置超时时间 
    timeout: 30000
  }
  let browser = await puppeteer.launch(options)
  // 打开页面
  let page = await browser.newPage()
  // 访问页面
  await page.goto('https://www.dytt8.net/index.htm')
  // 获取页面对象(获取的是ElementHandle对象而不像$$eval得到的是js的dom,操作元素的方式也和dom不一样)
  // let elementHandles = await page.$$('#menu li a')
  // 单击页面上的导航栏的第二个超链接
  // elementHandles[2].click()

  // 通过表单输入进行搜索
  let inputEle = await page.$('.searchl .formhue');
  // 让光标进入到输入框
  await inputEle.focus()
  // 往输入框输入内容
  await page.keyboard.type('蝙蝠侠')
  // 点击按钮
  let btnEle = await page.$('.searchr input[name="Submit"]')
  await btnEle.click()
  // page.waitForSelector(selector)用于让页面等待某个元素完全加载完再获取

}

test()