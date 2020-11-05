const fs = require('fs')

// 异步删除文件
// unlink(path,callback)
fs.unlink('./lc.html',err => {
  if(err) {
    console.log("删除失败");
  }else{
    console.log("删除成功");
  }
})