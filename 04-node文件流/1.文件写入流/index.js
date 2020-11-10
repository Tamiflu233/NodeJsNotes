const fs = require("fs");

// 1.创建写入流
// --语法: fs.createWriteStream(文件路径，[可选配置操作option])
let ws = fs.createWriteStream("hello.txt", { flags: "w", encoding: "utf-8" });
// console.log(ws);
// 监听文件打开事件
ws.on("open", () => {
  console.log("文件打开成功");
})
// 监听准备事件
ws.on("ready", () => {
  console.log("文件写入已准备状态");
})
// 监听文件关闭事件
ws.on("close", () => {
  console.log("文件写入完毕，并关闭");
})

// 文件流式写入
ws.write("hello world1!!!!", err => {
  if(err) {
    console.log(err);
  }else {
    console.log("内容1流入完成");
  }
})
ws.write("hello world2!!!!", err => {
  if(err) {
    console.log(err);
  }else {
    console.log("内容2流入完成");
  }
})
ws.write("hello world3!!!!", err => {
  if(err) {
    console.log(err);
  }else {
    console.log("内容3流入完成");
  }
})
ws.write("hello world4!!!!", err => {
  if(err) {
    console.log(err);
  }else {
    console.log("内容4流入完成");
  }
})

// 文件写入完成
ws.end(() => {
  console.log("文件写入关闭");
});