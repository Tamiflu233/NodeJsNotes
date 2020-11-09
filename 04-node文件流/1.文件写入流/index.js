const fs = require("fs");

// 1.创建写入流
// --语法: fs.createWriteStream(文件路径，[可选配置操作option])
let ws = fs.createWriteStream("hello.txt", { flags: "w", encoding: "utf-8" });
// console.log(ws);
ws.on("open", () => {
  console.log("文件打开成功");
})