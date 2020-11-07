const fs = require("fs")
let {fsWrite,fsRead} = require("./lcfs")

const txtPath = 'all.txt'
fs.readdir('../../02-文件系统fs/1.读文件', (err,files) => {
  if(err){
    console.log(err);
  }else {
    console.log(files);
    files.forEach(async (filename, i ) => {
      let content = await fsRead('../../02-文件系统fs/1.读文件/' + filename)
      await fsWrite(txtPath,content)
    })
  }
})