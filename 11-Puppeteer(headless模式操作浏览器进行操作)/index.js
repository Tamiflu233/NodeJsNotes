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
    }
  }
  let browser = await puppeteer.launch(options)
  // 打开页面
  let page = await browser.newPage()
  // 访问页面
  await page.goto('https://www.bilibili.com')
  // 页面截图
  await page.screenshot({
    path: 'screenshot.png'
  })
  // 获取页面内容
  /* 
    page.$$eval()/$eval(): 参数是选择器(querySelectAll/querySelector)和一个回调函数，
    调用后会把选择到的元素/元素们，作为回调函数的参数/用Array.from先将NodeList转换成Array再作为或吊函数的参数。
  */
  page.on('console',(...args) => {
    console.log(args);
  })
  let res = await page.$$eval('.nav-link-item .link',(elements) => {
    let lst = []
    elements.forEach((item,index) => {
      console.log(item.innerHTML);
      lst.push(item.innerHTML)
    })
    return lst;
  })
  console.log(res);
}

test()