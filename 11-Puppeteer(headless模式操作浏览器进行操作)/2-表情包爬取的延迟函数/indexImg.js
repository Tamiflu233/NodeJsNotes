// 可以获取HTML文档的内容，内容的获取和jquery一样(在服务端进行DOM操作/爬虫)
const cheerio = require("cheerio")
const axios = require("axios")
const fs = require('fs');
const url = require("url");
const path = require('path');

axios.default.timeout = 10000
// 我发现经常get请求图片的时候常会因为收不到响应无限卡死，必须得整个超时时间

let httpUrl = 'https://www.doutula.com/article/list/?page=1'

// 将延迟函数封装成Promise对象
async function lcWait(milliSeconds) {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      resolve('成功执行延迟函数，延迟: ' + milliSeconds)
    }, milliSeconds)
  })
}

// 获取页面总数
async function getNum() {
  res = await axios.get(httpUrl)
  let $ = cheerio.load(res.data)
  let btnLength = $('.pagination li').length
  let allNum = $('.pagination li').eq(btnLength - 2).find('a').text()
  return allNum
}

async function spider() {
  // 获取所有页面的页面总数
  let allPageNum = await getNum()
  for (let i = 1; i <= allPageNum; i++) {
    // 这里await会阻塞后面，所以我认为不需要*i(然后后面爬电子书发现还是要乘以i的),如果你不加await延时就会失效(不管你有没有*i，因为是异步操作，你不阻塞它就不能确定顺序)
    // 除非你把延时后的操作写在延时的.then里面，并且延时的事件要乘以i才能做到延时，所以还是加await简单点
    // 总结下来，lcWait不需要*i的应该是用普通循环，且包在async函数内部，这样循环间也是同步的
    // 而用诸如forEach，对其回调函数开启async,那么必须*i,因为循环间是异步的
    await lcWait(2000)
    getListPage(i)
  }
}

async function getListPage(pageNum) {
  let httpUrl = 'https://www.doutula.com/article/list/?page=' + pageNum
  let res = await axios.get(httpUrl)
  // console.log(res.data);
  // 写正则提取数据太麻烦了，不如用cheerio解析html文档(可以像jquery操作dom一样来提取数据)
  let $ = cheerio.load(res.data)
  // 获取当前页面的所有表情页面的链接(jquery的dom操作代替正则，方便了很多)
  $('#home .col-sm-9 > a').each(async (index, element) => {
    let pageUrl = $(element).attr('href');
    let title = $(element).find('.random_title').text()
    let reg = /(.*?)\d/igs
    title = reg.exec(title)[1]
    title = title.replace(/\?/g, '')
    fs.mkdir('./img/' + title, err => {
      if (err) {
        console.log(err);
      } else {
        console.log('目录创建成功: ' + './img/' + title);
      }
    })
    // console.log(title);
    // 这里得*index,因为这里的循环间是异步的，定时器会同时开启(async加载了回调里面，而不是整个函数上)
    await lcWait(50 * index)
    parsePage(pageUrl, title)
  })
}

let count = 0;
async function parsePage(pageUrl, title) {
  let res = await axios.get(pageUrl);
  let $ = cheerio.load(res.data)
  // let count = 0;
  $('.pic-content img').each((index, element) => {
    let imgUrl = $(element).attr('src')
    // console.log(imgUrl);
    // console.log(url.parse(imgUrl));
    let extName = path.extname(imgUrl)
    // 可以用split来获取imgUrl最后面的名字来作为写入的文件名
    // let urlItems = imgUrl.split('/')
    // console.log(urlItems[urlItems.length - 1]);

    // 图片写入的路径和名字
    let imgPath = `./img/${title}/${title}-${index}${extName}`

    // 创建写入图片流
    let ws = fs.createWriteStream(imgPath)
    axios.get(imgUrl, { responseType: 'stream' }).then(res => {
      console.log(imgUrl);
      console.log(++count);
      // console.log(res.data);
      res.data.pipe(ws)
      // 关闭写入流
      res.data.on('close', function () {
        // 不知道为啥，可能是网络问题，每次都有些请求会卡死
        ws.close()
      })
      /* ws.on('close',() =>{
        process.exit(0)
      }) */
    }).catch(err => {
      ++count
      console.log(err);
    })

  })

}

spider()
