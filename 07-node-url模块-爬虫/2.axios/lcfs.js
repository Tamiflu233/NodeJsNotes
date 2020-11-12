const fs = require("fs")

function fsRead (path) {
  return new Promise((resolve,reject) => {
    fs.readFile(path,{flag: 'r',encoding: "utf-8"},(err, data) => {
      if(err) {
        // 失败执行的代码
        reject(err);
      }else {
        // 成功执行的代码
       resolve(data);
      }
    })
  })
}

function fsWrite(path, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, content, { flag: "a", encoding: "utf-8" }, (err) => {
      if (err) {
        reject("写入内容失败")
      } else {
        resolve("写入内容成功")
      }
    })
  })
}

function fsDir (path) {
  return new Promise((resolve,reject) => {
    fs.mkdir(path, err => {
      if(err) {
        reject(err)
      } else {
        resolve("成功创建目录")
      }
    })
  })
}
module.exports = {
  fsRead,
  fsWrite,
  fsDir
}