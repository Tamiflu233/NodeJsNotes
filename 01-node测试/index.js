let a = require('./index1')
// 1.在没有任何内容导出的情况下获取某个文件的内容会获取一个空对象
// 2.require获取文件路径时，可以不加后缀名，默认是js
let b = require('./index1')
let $ = require('jquery')
console.log(a===b);
console.log($);
// console.log(a);