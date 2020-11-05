var fs = require('fs');
// 导入文件模块
// node,读写文件也有同步和异步的接口


// 同步方式打开文件,fs.openSync(path[,flags,mode]) -> flags设置读写还是追加(r/w/a,和c语言差不多),mode设置读写模式(用默认值就好)
// var fd = fs.openSync('./hello.txt', "r")
// console.log(fd); //返回了一个3,表示打开的文件在内存中的标识



/* 同步方式读取文件 fs.readSync(fd,buffer,offset,length,position) */
/* 
fd 打开的文件的标识
buffer      缓冲区，数据将被写入。

offset      buffer写入的偏移量

length     （integer）   指定文件读取字节数长度

position   （integer）   指定文件读取的起始位置，如果该项为null，将从当前文件指针的位置开始读取数据

返回读取的字节数
*/
// 开辟缓存
var buf = Buffer.alloc(20)
/* var content = fs.readSync(fd,buf,0,20,0) */


// 同步方式读取文件高度封装版 fs.readFileSync(path,options),不需要先打开再读取，可以一次性完成俩操作
//返回读取内容的buffer16进制数据，可以用toString转换成文本(或者在options里面设置编码)
/* var content = fs.readFileSync('./hello.txt',{
  flag:'r', //读标志
  encoding:"utf-8"  //要和读取的文件的编码一致
}) */



// 异步读取文件(和readFileSync类似,不过读取到的数据是回调函数的参数而不是函数返回值) fs.readFile(path[,options],callback)
/* fs.readFile("./hello.txt",{flag: 'r',encoding: "utf-8"},(err, data) => {
  if(err) {
    console.log(err);
  }else {
    console.log(data);
  }
  console.log(456);
})

console.log(123); */



// 自己用Promise封装一个文件读取对象(避免回调地狱)
function fsRead (path) {
  return new Promise((resolve,reject) => {
    fs.readFile(path,{flag: 'r',encoding: "utf-8"},(err, data) => {
      if(err) {
        // 失败执行的代码
        reject(err);
      }else {
        // 成功执行的代码
       resolve(data);
      }
    })
  })
}

var w1 = fsRead('./hello.txt')
w1.then(res => {
  console.log(res);
}).catch(err => {
  console.log(err);
})