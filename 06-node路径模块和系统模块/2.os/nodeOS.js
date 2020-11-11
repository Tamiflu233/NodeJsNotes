const os = require("os")

// 查看cpu信息
console.log(os.cpus());
console.log(os.cpus().length + "核CPU");
// 查看整个内存大小
console.log(os.totalmem() + "B内存");
// 查看系统架构
console.log(os.arch()+"架构的CPU");

// 查看剩余闲置内存
console.log(os.freemem()+"B内存");

// 查看系统平台
console.log(os.platform()+"系统");
