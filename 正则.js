let reg = /http\:\/\/(.*?)\.fang\.com\//igs
let str = 'http://wanning.fang.com/'
let res = reg.exec(str)[1]
console.log(res);