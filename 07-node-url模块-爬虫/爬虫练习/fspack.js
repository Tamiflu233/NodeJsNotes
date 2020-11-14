const fs = require("fs")

function fsReader(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, { flags: "r", encoding: "utf-8" }, (err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

function fsWriter(path, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, { flags: "w", encoding: "utf-8" }, err => {
      if (err) {
        reject(err)
      } else {
        resolve("写入成功")
      }
    })
  })
}

function fsDir(path) {
  return new Promise((resolve, reject) => {
    fs.mkdir(path, err => {
      if (err) {
        reject(err)
      } else {
        resolve("目录创建完成")
      }
    })
  })
}


module.exports = {
  fsReader,
  fsWriter,
  fsDir
}