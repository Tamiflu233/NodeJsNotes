const express = require('express');

let app = express()

// 1.字符串的路由模式
app.get('/',(req,res) => {
  res.send('这是首页')
})

// 2.类字符串的正则模式
app.get('/ab?cd',(req,res) => {
  res.send('这是abcd/acd')
})

/* app.get('/ab+cd',(req,res) => {
  res.send('这是abbb....cd')
})

app.get('/ab*cd',(req,res) => {
  res.send('这是acd/ab...cd')
}) */

// 3.正则模式
app.get(/\/a\d{10,}/,(req ,res) => {
  res.send('新闻页面')
})

// 4.动态路由
app.get('/news/:category/a:newsid',(req ,res) => {
  res.send('新闻id页面:'+req.params.newsid+'分类id:'+req.params.category)
})

// app.listen(8000,() => {
//   console.log('服务器开启成功: 127.0.0.1:8000');
// })
module.exports = app