const http = require('http');
const path = require('path');
const url = require('url');
const fs = require('fs');
class lcApp {
  constructor() {
    this.server = http.createServer()
    this.reqEvent = {}
    this.staticDir = '/static'
    this.server.on('request', (req, res) => {
      // 判断是否正则路径匹配成功
      let resState = false  //这里不能设置为类的属性，不然只要首次请求将其设置为true，之后其他请求，如对static的图片的请求都进不去
      // 解析路径
      let pathObj = path.parse(req.url)
      // 顺便把pathObj放进req,gnxw页需要查看base
      req.pathObj = pathObj
      // 把render渲染函数放入res,用于渲染数据
      res.render = render
      // 循环匹配正则路径
      for(let key in this.reqEvent) {
        let regStr = key
        let reg = new RegExp(regStr, 'igs')
        if(reg.test(req.url)){
          this.reqEvent[key](req,res)
          resState = true
          break;
        }
      }
      if(!resState) {
        try {
          if (pathObj.dir === this.staticDir) {
            res.setHeader("content-type", this.getContentType(pathObj.ext))
            let rs = fs.createReadStream('./static/'+pathObj.base)
            rs.pipe(res)
          } else {
            res.setHeader('content-type','text/html; charset=utf-8')
            res.end("<h1>404!页面找不到</h1>")
          }
        } catch (error) {
          console.log(error);
          res.end(`<h1>500!${error}</h1>`);
        }
        
      }
    })
  }
  on(url, fn) {
    this.reqEvent[url] = fn;
  }
  run(port, callback) {
    this.server.listen(port,callback)
  }
  getContentType(extName){
    switch(extName){
        case ".jpg":
            return "image/jpeg";
        case ".html":
            return "text/html;charset=utf-8";
        case ".js":
            return "text/javascript;charset=utf-8";
        case ".json":
            return "text/json;charset=utf-8";
        case ".gif":
            return "image/gif";
        case ".css":
            return "text/css";
    }
  }
}
function render (options,path) {
  fs.readFile(path,{flag: 'r', encoding: 'utf-8'}, (err,data) => {
    if(err){
      console.log(err);
    } else {
      console.log(data);
      try {
        // 匹配循环的变量，并且替换循环的内容
        data = replaceArr(data, options)
        // 匹配普通的变量，并且替换内容
        data = replaceVar(data, options)
      } catch (error) {
        console.log(error);
      }
      

      // 因为是箭头函数，会依次向外层作用域找this，而render函数在上面赋值给了res的render方法，自然this就是res
      this.end(data)
    }
  })
}

function replaceVar (data,options) {
  let reg = /\{\{(.*?)\}\}/igs
  let result
  while(result = reg.exec(data)) {
    // console.log("当前数据为: ");
    // console.log(data);
    console.log("当前匹配到的列表项数据:",result[0]);
    let strKey = result[1].trim()
    let strValue = eval('options.'+strKey)
    data = data.replace(result[0],strValue)
  }
  return data
}

function replaceArr (data, options) {
  let reg = /\{\%for \{(.*?)\} \%\}(.*?)\{\%endfor\%\}/igs
  while(result = reg.exec(data)) {
    let strKey = result[1].trim()
    // 通过key值获取数组内容
    let strValueArr = options[strKey]
    let listStr = ''
    strValueArr.forEach((item,index) => {
      // 替换每一项内容里的变量
      listStr += replaceVar(result[2], {"item":item,"index":index})

    })
    data = data.replace(result[0],listStr)
  }
  return data
}
module.exports = lcApp;