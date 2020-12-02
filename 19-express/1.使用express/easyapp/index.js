const express = require('express');
let app = express();

app.get('/', (req, res) => {
  res.send(`<h1 style='color: blue'>我的express项目</h1>`)
})

app.listen(8000,() => {
  console.log('127.0.0.1:8000','服务器启动成功');
})