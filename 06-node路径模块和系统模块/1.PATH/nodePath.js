const path = require("path")

// console.log(path);

let strPath = "//123p1.sogoucdn.com/imgu/2019/08/20190819144807_847.png"
// 获取路径信息的扩展名
let info = path.extname(strPath)
console.log(info);