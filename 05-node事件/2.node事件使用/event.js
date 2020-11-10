// 引入events模块
const events = require("events")
const fs = require("fs")

let ee = new events.EventEmitter()

ee.on("helloSuccess", (eventMsg) => {
  console.log("1.吃夜宵");
  console.log(eventMsg);
})
ee.on("helloSuccess", (eventMsg) => {
  console.log("2.唱k");
})
ee.on("helloSuccess", (eventMsg) => {
  console.log("3.打王者");
})
ee.on("helloSuccess", (eventMsg) => {
  console.log("4.打dota");
})

function lcReadFile (path) {
  return new Promise((resolve,reject) => {
    fs.readFile(path,{flags: "r", encoding:"utf-8"},(err, data)=> {
      if(err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
    
    
  })
}

lcReadFile('hello.txt').then(data => {
  ee.emit("helloSuccess",data)
})

async function test () {
  let data = await lcReadFile('hello.txt')
  ee.emit("helloSuccess",data)
}

test()