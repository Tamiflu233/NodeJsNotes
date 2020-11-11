const path = require("path")
const fs = require("fs")

// console.log(path);

let strPath = "//123p1.sogoucdn.com/imgu/2019/08/20190819144807_847.png"
// 获取路径信息的扩展名
let info = path.extname(strPath)
console.log(info);

let arr = ['/sxt', 'qianduan', 'zhongji']//这里的斜杠表示根目录,即F盘下的第一个目录，你不加斜杠就会从当前文件所在目录开始拼接
let info1 = path.resolve(...arr)  //F:\sxt\qianduan\zhongji(不加参数默认返回当前文件所在路径)
console.log(info1);

// 获取当前执行目录的完整路径
console.log(__dirname);
let info2 = path.join(__dirname, 'sxt', 'qianduan', 'zhongji')
// console.log(__filename);
console.log(info2);

// 
let str = "http://www.sxt.com/xinwen/guonei.html";

// 解析出请求目录
let arrParse = str.split('/')
console.log(arrParse);
arr = arrParse.slice(arrParse.length - 2,arrParse.length)

let filePath = path.join(__dirname,...arr)
console.log(filePath);

function fileReader (path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path,{flags: "r",encoding: "utf8"}, (err, data) => {
      if(err) {
        reject(err)
      }else {
        resolve(data)
      }
    })
  })
}

async function readHtml () {
  let data = await fileReader(filePath)
  console.log(data);
}

readHtml()