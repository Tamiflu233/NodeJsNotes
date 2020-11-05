let a = 123;
let b = 456;
let c = 789;
let s1 = {username:'学生'}
console.log(s1);
// exports就是默认导出的对象
exports.a = a;
module.exports.c = c;
// 系统默认设置了: exports = module.exports
// exports = {user: "小明"}找的还是a和c，因为系统回去找module.exports
// 而exports默认指向module.exports，可以间接修改它
// 但如果改了exports的指向，exports其实就没啥用了

// module.exports = {user: '小明'}
module.exports = s1

// 注意使用exports时，只能单个设置属性exports.a = a;
// 使用module.exports可以单个设置属性，也可以整个赋值