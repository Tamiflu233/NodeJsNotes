// 1. 数组不能进行二进制数据的操作
// 2. js数组不像java、python等语言效率高
// 3. 为了提高数组效率,就有了buffer,buffer在内存空间开辟出固定大小的内存

// 将字符串转成buffer对象
var str = "helloworld"
// 将str以二进制形式存放到buffer里
let buf = Buffer.from(str)
console.log(buf);

// 输出buffer内容
console.log(buf.toString());


// 开辟一个空的buffer(缓存区)
let buf1 = Buffer.alloc(10) //开辟10B的buffer
buf1[0] = 255
console.log(buf1);

let buf2 = Buffer.allocUnsafe(10) //没给buffer初始化为0,效率高但是不安全(数据泄露)
console.log(buf2);