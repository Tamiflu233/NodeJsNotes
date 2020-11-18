// 可以获取HTML文档的内容，内容的获取和jquery一样(在服务端进行DOM操作/爬虫)
const cheerio = require("cheerio")
const axios = require("axios")
const fs = require('fs');
const url = require("url");
const path = require('path');

axios.default.timeout = 10000
// 我发现经常get请求图片的时候常会因为收不到响应无限卡死，必须得整个超时时间

let httpUrl = 'https://www.doutula.com/article/list/?page=1'

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
  for (let i = 1; i <= 1; i++) {
    getListPage(i)
  }
}

async function getListPage(pageNum){
  let httpUrl = 'https://www.doutula.com/article/list/?page='+pageNum
  let res = await axios.get(httpUrl)
  // console.log(res.data);
  // 写正则提取数据太麻烦了，不如用cheerio解析html文档(可以像jquery操作dom一样来提取数据)
  let $ = cheerio.load(res.data)
  // 获取当前页面的所有表情页面的链接(jquery的dom操作代替正则，方便了很多)
  $('#home .col-sm-9 > a').each((index, element) => {
    let pageUrl = $(element).attr('href');
    let title = $(element).find('.random_title').text()
    let reg = /(.*?)\d/igs
    title = reg.exec(title)[1]
    title = title.replace('?','')
    fs.mkdir('./img/' + title, err => {
      if (err) {
        console.log(err);
      } else {
        console.log('目录创建成功: ' + './img/' + title);
      }
    })
    // console.log(title);
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