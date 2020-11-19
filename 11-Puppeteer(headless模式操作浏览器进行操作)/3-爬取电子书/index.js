const puppeteer = require('puppeteer');
const axios = require('axios');
const url = require('url');
const fs = require('fs');

let httpUrl = 'https://sobooks.cc/';
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
  let browser = await puppeteer.launch(options)

  // 将延迟函数封装成Promise对象
  async function lcWait(milliSeconds) {
    return new Promise((resolve, reject) => {
      setTimeout(function () {
        resolve('成功执行延迟函数，延迟: ' + milliSeconds)
      }, milliSeconds)
    })
  }

  async function getAllNum() {
    let page = await browser.newPage()
    // 截取谷歌请求
    await page.setRequestInterception(true);
    // 监听请求事件，拦截小广告
    page.on('request', interceptedRequest => {
      // 用url模块解析出主机名
      let urlObj = url.parse(interceptedRequest.url())
      if (urlObj.hostname === 'googleads.g.doubleclick.net') {
        // 拦截到的请求是发给谷歌广告联盟的，拒绝掉它(谷歌广告请求响应太慢)
        interceptedRequest.abort()
      } else {
        interceptedRequest.continue()
      }
    })
    await page.goto(httpUrl)
    // 设置选择器，获取总页数
    let pageNum = await page.$eval('.pagination li:last-child span', element => {
      let text = element.innerHTML
      text = text.substring(2, text.length - 2).trim()
      return text
    })
    await page.close()
    return pageNum
  }
  let pageNum = await getAllNum()
  console.log(pageNum);

  async function pageList(num) {
    let pageListUrl = 'https://sobooks.cc/page/' + num
    let page = await browser.newPage()

    // 截取谷歌请求
    await page.setRequestInterception(true);
    // 监听请求事件，拦截小广告
    page.on('request', interceptedRequest => {
      // 用url模块解析出主机名
      let urlObj = url.parse(interceptedRequest.url())
      if (urlObj.hostname === 'googleads.g.doubleclick.net') {
        // 拦截到的请求是发给谷歌广告联盟的，拒绝掉它(谷歌广告请求响应太慢)
        interceptedRequest.abort()
      } else {
        interceptedRequest.continue()
      }
    })

    // 访问列表页地址
    await page.goto(pageListUrl)
    let arrPage = await page.$$eval('.card .card-item .thumb-img > a', elements => {
      let arr = []
      elements.forEach((item, index) => {
        let obj = {
          href: elements[index].getAttribute('href'),
          title: elements[index].getAttribute('title')
        }
        arr.push(obj)
      })
      return arr
    })
    await page.close()
    // 通过获取的数组的地址和标题去请求书籍的详情页
    arrPage.forEach(async (item, index) => {
      await lcWait(3000 * index)
      getPageInfo(item)
    })
    /* 
      注意上面因为用的forEach,对forEach的回调函数设置async,也就是每次迭代之间并不会互相阻塞
      而每次迭代的lcWait和getPageInfo是同步阻塞的，导致了lcWait的定时器是同时开的
      所以这个时候要达到延时一个个开网页，必须给时间设置time *index让定时器依次递增
      但是如果用普通循环，外面包个async函数，循环里面await lcWait，这个时候async的是整个函数
      自然整个函数里面的循环间都会同步阻塞，自然定时器是同步的按顺序开的，不用*index,
      综上，上述代码想过上等同于：
      ;(async function(){
        for(let i = 0;i < arrPage.length;i++){
          await lcWait(200)
          getPageInfo(arrPage[i])
        }
      })()
    
    */
  }

  async function getPageInfo(pageObj) {
    let page = await browser.newPage()
    // 截取谷歌请求
    await page.setRequestInterception(true);
    // 监听请求事件，拦截小广告
    page.on('request', interceptedRequest => {
      // 用url模块解析出主机名
      let urlObj = url.parse(interceptedRequest.url())
      if (urlObj.hostname === 'googleads.g.doubleclick.net') {
        // 拦截到的请求是发给谷歌广告联盟的，拒绝掉它(谷歌广告请求响应太慢)
        interceptedRequest.abort()
      } else {
        interceptedRequest.continue()
      }
    })
    await page.goto(pageObj.href)
    let eleA = await page.$('.dltable tr:nth-child(3) a:last-child')
    if (eleA) {
      let aHref = await eleA.getProperty('href')
      // console.log(aHref); ElementHandle.getProperty返回的是一个JsHandle对象
      aHref = aHref._remoteObject.value
      aHref = aHref.split('?url=')[1]
      let content = `{"title":"${pageObj.title}","href":"${aHref}"}---\n`
      fs.writeFile('book.txt', content, { flag: "a" }, () => {
        console.log("已将书下载路径写入: " + pageObj.title);
        page.close()
      })

    }else {
      console.log(pageObj.title+"不提供下载链接！");
      page.close()
    }
  }
  await pageList(103)
  // getPageInfo({href: 'https://sobooks.cc/books/14620.html', title:"海明威作品精选系列（套装共6册）"})

})();

// 目标: 获取https://sobooks.cc/,所有书名和电子书的链接
// 进入网站，获取整个网站列表页的页数


// 获取列表页的所有链接


// 进入每个电子书的详情页，获取下载电子书的网盘地址

// 将获取的数据保存到book.txt文档里



