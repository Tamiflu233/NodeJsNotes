const puppeteer = require('puppeteer');
const axios = require('axios');
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
    bookLinkPage(elementAHref,bookObj.title)
    await page.close()
  }
  async function bookLinkPage (linkUrl,title) {
    let page = await browser.newPage()
    // 截取谷歌请求
    await page.setRequestInterception(true);
    // 监听请求事件，拦截小广告
    page.on('request', interceptedRequest => {
      // 用url模块解析出主机名
      let urlObj = url.parse(interceptedRequest.url())
      // console.log(urlObj.hostname);
      // 14804066.ch1.ctc.data.tv002.com
      if (urlObj.hostname.search(/\.tv002\.com$/igs) !== -1) {
        // 拦截到的请求是发给谷歌广告联盟的，拒绝掉它(谷歌广告请求响应太慢)
        console.log('截获地址: ');
        console.log(urlObj.href);
        interceptedRequest.abort()
        let ws = fs.createWriteStream('./book/'+title+".epub")
        axios.get(urlObj.href, {responseType: 'stream'}).then(res => {
          res.data.on("close",() => {
            ws.close()
          })
          ws.on('close',() => {
            console.log('下载已完成: '+title);
            // 下完一本再下一本，没下完就下其他的就会被反爬503
            downloadBook()
            page.close()
          })
          res.data.pipe(ws)
        })
        
      } else {
        interceptedRequest.continue()
      }
    })
    await page.goto(linkUrl)
    await page.waitForSelector('.btn.btn-outline-secondary.fs--1')
    let btn = await page.$('.btn.btn-outline-secondary.fs--1')
    await btn.click()
    // 判断请求完成
    // page.on('requestfinished', (req) => {
    //   console.log("下载已完成: "+req.url());
    // })

  }
  downloadBook()

})();


