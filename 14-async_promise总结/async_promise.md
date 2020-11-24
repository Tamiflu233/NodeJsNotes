## async和Promise总结
---
### 一.写法不同
 - ES5正常写法
```js
  getAjax(url,() => {})
```
- Promise写法
```js
  get(url).then(() => {})
```
- async/await
```js
  (async () => {
    let res = await get(url)
  })()
 ```
 - 总结: 
   - ES5写法和Promise写法，主要区别在写法的不同，可以让回调函数划分出去在.then函数里去执行，使得代码更加的灵活(解决回调地狱), 也可以将两个不同的参数划分开来写
   - async和Promise的区别，主要在于async时Promise的语法糖，这种形式的写法在底层编译之后会自动转化成Promise的写法

### 二.Promise实现原理
 1. Promise需要实现的功能
```js
  function fn(resolve, reject) {
    setTimeout(() => {
      if(true) {
        resolve()
      }else{
        reject()
      }
    })
  }
  var p1 = new LcPromise(fn)
  p1.then(function(res){
    document.body.style.background = "greenyellow"
    console.log("这是成功做的事情")
    console.log(res)
  })
  p1.catch(function(res){
    document.body.style.background = "pink"
    console.log("这是失败做的事情")
    console.log(res)
  })
```
  p1这个Promise对象发送了异步操作，必然会有1个未来事件，在未来要执行，这个过程由传入的函数对象fn执行，函数fn里必然需要由成功执行和失败执行的参数
1. 创建类构造函数
```js
  class LcPromise {
    constructor (fn) {
      // 将成功的事件函数集成在successList数组里
      this.successList = []
      // 将这里所有的失败函数集成到failList里
      this.failList = []
      // pending,fullfilled,rejected
      this.state = "pending"
      // 传入的函数对象，（异步操作的函数内容）
      fn(this.resolveFn.bind(this),this.rejectFn.bind(this))
    } 
  }
```
- 构造函数的作用：
  - 声明成功函数放置的数组对象
  - 声明失败函数放置的数组对象
  - 定义初始化状态
  - 调用传入进行执行异步内容的函数(在未来有成功的结果时调用传入进去的成功函数，在未来失败时调用传入进行的失败函数0)
2. 传入成功或者失败时需要调用的函数
```js
  class LcPromise {
    constructor (fn) {
      // 将成功的事件函数集成在successList数组里
      this.successList = []
      // 将这里所有的失败函数集成到failList里
      this.failList = []
      // pending,fullfilled,rejected
      this.state = "pending"
      // 传入的函数对象，（异步操作的函数内容）
      fn(this.resolveFn.bind(this),this.rejectFn.bind(this))
    }
    then(successFn,failFn) {
      if(typeof successFn === 'function') {
        this.successList.push(successFn)
      }
      if(typeof failFn === 'function') {
        this.failList.push(failFn)
      }
    }
    catch(failFn) {
      if(typeof failFn === 'function') {
        this.failList.push(failFn)
      }
    }
  }
```
- 作用:
  - 将成功和失败的函数传入值成功和失败的数组里

3. 定义调用成功和失败的函数
```js
  class LcPromise {
    constructor (fn) {
      // 将成功的事件函数集成在successList数组里
      this.successList = []
      // 将这里所有的失败函数集成到failList里
      this.failList = []
      // pending,fullfilled,rejected
      this.state = "pending"
      // 传入的函数对象，（异步操作的函数内容）
      fn(this.resolveFn.bind(this),this.rejectFn.bind(this))
    }
    then(successFn,failFn) {
      if(typeof successFn === 'function') {
        this.successList.push(successFn)
      }
      if(typeof failFn === 'function') {
        this.failList.push(failFn)
      }
    }
    catch(failFn) {
      if(typeof failFn === 'function') {
        this.failList.push(failFn)
      }
    }
    resolveFn(res) {
      this.state = "fullfilled"
      this.successList.forEach(function(item,index) {
        // 将成功的事件循环调用
        item(res)
      })
    }
    rejectFn(res) {
      this.state = 'rejected'
      // 注册到的所有失败的事件进行调用
      this.failList.forEach(function(item, index) {
        item(res)
      })
      throw Error(res)
    }
  }
```
- 作用：
  - 成功时调用成功数组里所有的函数
  - 失败时调用失败数组里所有的函数

### 三.应用
- 如何将promise与async和await结合使用
- 典型异步读写的回调操作
```js
  fs.readFile(path,{flag: 'r',encoding: "utf-8"},(err, data) => {
      if(err) {
        // 失败执行的代码
        reject(err);
      }else {
        // 成功执行的代码
       resolve(data);
      }
    })
```
  转换成promise对象
```js
  new Promise((resolve,reject) => {
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
```
  由于每次使用，都不想写这么多代码，那么就会把这样的写法直接进行函数的封装
```js
  function fsRead(path) {
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
```
  使用的时候，就可以使用promise写法
```js
  p1 = fsRead(path) //就可以得到promise对象
  p1.then(data => {
    console.log('输出数据： '，data)
  })
```
async/await写法
```js
  ;(async () => {
    let data = await fsRead(path)
    console.log('输出数据： '，data)
  })()
```
异步async函数调用之后也是一个Promise对象
```js
  async function test() {
    let data = await fsRead(path)
    return data
  }
  //let a = test()一开始拿不到结果，因为async函数是异步函数
  // 会在所有同步代码执行玩之后，再在event loop里面排队执行
  //所以这时候会先拿到undefined，等到异步执行了test()
  // 才会拿到返回的Promise,所以要打印data不能直接写
  // 得写到.then函数里面
  let a = test()  //异步函数调用后，也是一个Promise对象
  a.then(function(data) {
    console.log(data)
  })
```
当然，你也可以在最外面包一个async函数，这样就可以用await
```js
;(async () => {
  async function test() {
    let data = await fsRead(path)
    return data
  }
  let p = test()  //不用await
  p.then(data => {
    console.log(data)
  })
  let a = await test()  //用await
  console.log(a)
})()

```
