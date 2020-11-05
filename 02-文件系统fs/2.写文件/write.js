const fs = require('fs')
// 异步写入文件
// writeFIle(path,data,options,callback)
/* fs.writeFile('./test.txt',"\n好吃吗",{flag: "a", encoding:"utf-8"}, (err) => {
  if(err) {
    console.log("写入内容出错");
  } else {
    console.log("写入内容成功");
  }
})
// 因为都是异步的，不能保证顺序正确，要保证顺序正确只能嵌套(所以最好用Promise封装)
fs.writeFile('./test.txt',"\n不好吃",{flag: "a", encoding:"utf-8"}, (err) => {
  if(err) {
    console.log("写入内容出错");
  } else {
    console.log("写入内容成功");
  }
}) */

// Promise封装写文件
function writefs(path, content) {
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

// 再用async
async function writeList () {
  await writefs('lc.html',"<h2>1.今天吃了烧烤</h2>")
  await writefs('lc.html',"<h2>2.今天吃了烧烤</h2>")
  await writefs('lc.html',"<h2>3.今天吃了烧烤</h2>")
  await writefs('lc.html',"<h2>4.今天吃了烧烤</h2>")
}

writeList()
