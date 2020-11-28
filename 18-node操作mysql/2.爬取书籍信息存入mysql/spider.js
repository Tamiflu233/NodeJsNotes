const mysql = require('mysql');
const axios = require('axios');
const cheerio = require('cheerio');

let page = 1;
let count = 1;
let options = {
  host:"localhost",
  // port:"3306", //可选，默认3306
  user:"root",
  password:"weng6622",
  database:"book"
}
let con = mysql.createConnection(options)

//获取第n个页面所有书籍的链接
async function getPageUrl (num) {
  let httpUrl = 'https://sobooks.cc/page/' + num;
  let res = await axios.get(httpUrl);
  // console.log(res.data);
  let $ = cheerio.load(res.data)
  $("#cardslist .card-item .thumb-img > a").each((index,elem) => {
    let href = $(elem).attr("href")
    // console.log(href);
    // 根据地址访问书籍详情页面
  })
}

async function getBookInfo (href) {
  let res = await axios.get(href)
  let $ = cheerio.load(res.data)
  // 书籍图片
  let bookimg = $('.article-content .bookpic img').attr("src")
  // 书籍名称
  let bookname = $('.article-content .bookinfo ul li:nth-child(1)').text()
  bookname = bookname.substring(3,bookname.length)
  // 书籍作者
  let author = $(".article-content .bookinfo ul li:nth-child(2)").text()
  author = author.substring(3,author.length)
  // 浏览次数
  let viewcount = $(".article-content .bookinfo ul li:nth-child(3)").text()
  viewcount = viewcount.substring(3,viewcount.length - 1)
  // 标签
  let tag = $(".article-content .bookinfo ul li:nth-child(4)").text()
  tag = tag.substring(3,tag.length)
  // 发布时间
  let pubtime = $(".article-content .bookinfo ul li:nth-child(5)").text()
  pubtime = pubtime.substring(3,pubtime.length)
  // 评分
  let score = $(".article-content .bookinfo ul li:nth-child(6) b").attr("class")
  score = score.substring(9,score.length)

  // 书号
  let ISBN = $(".article-content .bookinfo ul li:nth-child(7)").text()
  ISBN = ISBN.substring(3,ISBN.length)
  // 分类
  let category = $('#mute-category > a').text().trim()
  // 简介
  let brief = $('.article-content').html()
  //书籍链接
  let bookurl = href
  // 下载链接
  let download = $('body > section > div.content-wrap > div > article > table > tbody > tr:nth-child(3) > td > a:nth-child(3)').attr('href')
  if(download) {
    download = download.split("?url=")[1]
  }

  let arr = [bookname,author,viewcount,tag,pubtime,score,ISBN,bookimg,category,brief,bookUrl,download]
  // console.log(arr);
  // 插入数据库
  let strSql = 'insert into book (bookname,author,viewcount,tag,pubtime,score,ISBN,bookimg,category,brief,bookUrl,download) values (?,?,?,?,?,?,?,?,?,?,?,?)'
  con.query(strSql,arr,(err,results) => {
    if(err) {
      console.log('数据插入失败');
      console.log(err);
    } else {
      console.log('数据插入成功');
    }
  })
}

// getPageUrl(page)

let bookUrl = 'https://sobooks.cc/books/14633.html'
getBookInfo(bookUrl)

