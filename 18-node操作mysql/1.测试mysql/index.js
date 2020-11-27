const mysql = require('mysql');
let options = {
  host:"localhost",
  // port:"3306", //可选，默认3306
  user:"root",
  password:"weng6622",
  database:"shop"
}

// 创建与数据库的连接的对象
let con = mysql.createConnection(options);
// 建立连接
con.connect(err => {
  if(err) {
    console.log("数据库连接失败");
    console.log(err);
  } else {
    console.log('数据库连接成功');
  }
})

// 执行数据库语句
// 执行查询语句
/* let strSql = 'select * from user';
con.query(strSql,(err, results, fields)=>{
  if(err) {
    console.log(err);
  } else {
    console.log(fields);
    console.log(results);
  }
}) */

// 删除表
/* let strSql2 = 'drop table user'
con.query(strSql2,(err, results, fields)=>{
  if(err) {
    console.log(err);
  } else {
    console.log("删除表成功");
  }
}) */

// 删除库
let strSql3 = "drop database shop"
con.query(strSql3,(err, results, fields)=>{
  if(err) {
    console.log(err);
  } else {
    console.log("删除数据库成功");
  }
})

// 创建数据库
/* let strSql4 = 'create database shop'
con.query(strSql4,(err, results, fields)=>{
  if(err) {
    console.log(err);
  } else {
    console.log("数据库创建成功");
  }
}) */

// 创建表
/* let strSql5 = `
create table user(
  id int,
  name varchar(20),
  gender varchar(10),
  primary key(id)
)
`
con.query(strSql5,(err, results, fields)=>{
  if(err) {
    console.log(err);
  } else {
    console.log("数据表创建成功");
  }
}) */