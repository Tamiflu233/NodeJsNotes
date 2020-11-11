const path = require("path")

// 获取当前执行文件的目录
console.log(__dirname);

// 获取当前的执行文件
console.log(__filename);

console.log(path.extname(__filename));

// 解析路径，可以将路径信息直接解析出来，解析出根路径，目录，文件完整名称，扩展名，文件名
console.log(path.parse(__filename));