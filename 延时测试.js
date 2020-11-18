async function wait(ss) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('延时了' + ss + 'ms')
    }, ss);
  })
}

async function test() {
  for (let i = 0; i < 1000; i++) {
    await wait(5000)
    talk()
    /* 
      等价于
      wait(5000* i).then(res => {
        talk()
      })
    */
  }
}

async function talk() {
  await setTimeout(() => {
    console.log('haha');
  });
}
test()