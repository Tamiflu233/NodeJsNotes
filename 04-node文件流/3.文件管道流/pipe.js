const fs = require("fs")

// 创建一个可读流
let readerStream = fs.createReadStream("./video1.mp4",{flags:"r"})

// 创建一个可写流
let writerStream = fs.createWriteStream("./target.mp4",{flags: "w"})

readerStream.on("open", () => {
  console.log("文件打开");
})

readerStream.on("close",() => {
  console.log("文件读取完关闭");
})

// 管道读写操作
readerStream.pipe(writerStream)
