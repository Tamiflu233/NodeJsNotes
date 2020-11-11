const url = require("url")

let httpUrl = "https://www.bilibili.com/video/BV1i7411G7kW?p=9#aa"
let urlObj = url.parse(httpUrl)
console.log(urlObj);

let targetUrl = "http://www.taobao.com/"
httpUrl = "./usst/author/Tamiflu.html"
let newUrl = url.resolve(targetUrl,httpUrl)
console.log(newUrl);