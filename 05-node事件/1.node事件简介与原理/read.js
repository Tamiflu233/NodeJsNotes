const fs = require("fs")

fs.readFile("hello.txt", { flags: "r", encoding: "utf-8" }, (err, data) => {
  if (err) {
    console.log(err);
  } else {
    console.log(data);
    lcEvent.emit('fileSuccess', data)
    // 1.数据库查看所有用户的详细信息
    // 2.统计所有用户的年龄比例
    // 3.查看所有用户学校的详细信息
  }
});
/* 
  node事件原理
*/
let lcEvent = {
  event: {
    fileSuccess: []
  },
  on(eventName, eventFn) {
    if (this.event[eventName]) {
      this.event[eventName].push(eventFn)
    } else {
      this.event[eventName] = []
      this.event[eventName].push(eventFn)
    }
  },
  emit(eventName, eventMsg) {
    if (this.event[eventName]) {
      this.event[eventName].forEach(itemFn => {
        itemFn(eventMsg);
      })
    }
  }
}

lcEvent.on('fileSuccess', (eventMsg) => {
  console.log("1.数据库查看所有用户的详细信息");
})

lcEvent.on('fileSuccess', (eventMsg) => {
  console.log("2.统计所有用户的年龄比例");
})

lcEvent.on('fileSuccess', (eventMsg) => {
  console.log("3.查看所有用户学校的详细信息");
})