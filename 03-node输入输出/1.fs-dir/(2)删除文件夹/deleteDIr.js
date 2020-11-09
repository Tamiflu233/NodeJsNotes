const fs = require("fs")
/* 
  只能删除空的文件夹，里面有东西就删不掉
*/
fs.rmdir("./sb",err=>{
  if(err) {
    console.log("没删成功");
  }else{
    console.log("删除成功");
  }
})