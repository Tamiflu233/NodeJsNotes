let readline = require("readline")
// 导入readline
let {fsWrite} = require("./lcfs")
// 实例化接口对象
let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})
/* 
  像Vue-cli创项目结构，会有一系列的询问，根据用户的输入来生成package.json
  但一条条的输入有先后顺序，而且都是异步操作，要想实现得嵌套，
  为了解决这种回调地狱，可以用async和await来解决
*/
// 设置rl提问事件
/* rl.question("请输入姓名: ", answer => {
  console.log("我的名字是: " + answer);
  rl.close()  //不加close输入不会结束
}) */

function lcQuestion(title) {
  return new Promise((resolve, reject) => {
    rl.question(title, answer => {
      resolve(answer)
    })
  })
}

async function createPackage() {
  let name = await lcQuestion("您的包名叫什么? ")
  let description = await lcQuestion("您的包如何描述? ")
  let main = await lcQuestion("您的包主程序入口文件是什么? ")
  let author = await lcQuestion("您的包的作者是谁? ")
  let content = `{
    "name": "${name}",
    "version": "1.0.0",
    "description": "${description}",
    "main": "${main}",
    "dependencies": {
      "_jquery@3.5.1@jquery": "^3.5.1",
      "jquery": "^3.5.1"
    },
    "devDependencies": {},
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1"
    },
    "keywords": [
      "'node'"
    ],
    "author": "${author}",
    "license": "ISC"
  }
  `
  /* let content = JSON.stringify({
    name,
    description,
    main,
    author
  }) */
  await fsWrite('package.json',content)
  // 最终写完内容，关闭输入进程
  rl.close();
}
createPackage()
// 监听readline的close
rl.on("close", () => {
  // 结束程序
  process.exit(0)
})


