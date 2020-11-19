const puppeteer = require('puppeteer');
const url = require('url');
const fs = require('fs');
const { fsRead, fsWrite } = require('./lcfs');
(async function () {
  let debugOptions = {
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
    timeout: 60000
  }
  let options = {
    headless: true
  }
  let browser = await puppeteer.launch(debugOptions)

  // 将延迟函数封装成Promise对象
  async function lcWait(milliSeconds) {
    return new Promise((resolve, reject) => {
      setTimeout(function () {
        resolve('成功执行延迟函数，延迟: ' + milliSeconds)
      }, milliSeconds)
    })
  }

  async function parseTxt() {
    // 读取文本内容
    let textContent = await fsRead('./book.txt')
    // 正则表达式匹配json字符串对象
    let reg = /(\{.*?\})---/igs;
    let tempRes;
    let bookArr = []
    while (tempRes = reg.exec(textContent)) {
      // 获取匹配结果
      let jsonStr = tempRes[1];
      // 将字符串解析成对象
      let jsonObj = JSON.parse(jsonStr);
      // 获取链接属性
      // let href = jsonObj.href;
      bookArr.push(jsonObj)
    }
    return bookArr
  }

  let bookArr = await parseTxt();
  let index = 0;

  async function downloadBook () {
    // 根据索引值下载书
    // 如果索引值大于书数量的总长度
    if(index === bookArr.length) {
      return "完成";
    }
    let bookObj = bookArr[index]
    index++;
    // 打开新页面下载书籍
    let page = await browser.newPage()
    await page.goto(bookObj.href)
    // 因为a链接是js渲染出来的内容，并不是页面请求回来就有的内容，而是js通过ajax访问后台之后获取链接地址才有的内容
    await page.waitForSelector("#table_files tbody .even a")
    // 获取a链接对象
    let elementA = await page.$('#table_files tbody .even a')
    let elementAHref = await elementA.getProperty('href')
    elementAHref = elementAHref._remoteObject.value
    page.close()
    bookLinkPage(elementAHref)
  }
  async function bookLinkPage (linkUrl) {
    let page = await browser.newPage()
    await page.goto(linkUrl)
    let btn = await page.$('.btn.btn-outline-secondary.fs--1')
    await btn.click()

  }
  downloadBook()

})();


