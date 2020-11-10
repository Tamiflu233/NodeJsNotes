const fs = require("fs")

// 创建读取流，语法:fs.createReadStream(路径[,可选配置项])
// let rs = fs.createReadStream("./hello.txt",{flags: "r", encoding: "utf-8"})
let rs = fs.createReadStream("./video1.mp4",{flags: "r"})
let ws = fs.createWriteStream("./target.mp4",{flags: "w"})


let res = "";

// 读取流的监听
rs.on("open", () => {
  console.log("读取文件已打开");
})
// 每一批数据流入完成
rs.on("data",chunk => {
  console.log("单批数据流入: " + chunk.length);
  console.log(chunk);
  ws.write(chunk,err => {
    if(err) {
      console.log(err);
    } else {
      console.log("单批数据流入完成");
    }
  })
  // res += chunk
})

/* rs.on("end",() => {
  console.log("文件读取结束");
}) */

/* rs.on("err", err => {
  console.log(err.stack);
}) */

rs.on("close",() => {
  console.log("读取流结束");
  ws.end();
})

ws.on("close", () => {
  console.log("写入流结束");
})



