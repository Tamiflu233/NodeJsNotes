const mysql = require('mysql');
let options = {
  host:"localhost",
  // port:"3306", //可选，默认3306
  user:"root",
  password:"weng6622",
  database:"mall"
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
/* let strSql3 = "drop database shop"
con.query(strSql3,(err, results, fields)=>{
  if(err) {
    console.log(err);
  } else {
    console.log("删除数据库成功");
  }
}) */

// 创建数据库
/* let strSql4 = 'create database mall'
con.query(strSql4,(err, results, fields)=>{
  if(err) {
    console.log(err);
  } else {
    console.log("数据库创建成功");
  }
}) */

// 创建表
/* let strSql5 = `
CREATE TABLE mall.UserAccount  (
  id int NOT NULL AUTO_INCREMENT,
  username varchar(255) NULL,
  password varchar(255) NULL,
  mail varchar(255) NULL,
  PRIMARY KEY (id)
);
`
con.query(strSql5,(err, results, fields)=>{
  if(err) {
    console.log(err);
  } else {
    console.log("数据表创建成功");
  }
}) */

// 插入数据
/* let strSql6 = "insert into UserAccount (id,username,password,mail) values (1,'Taa','123123','kk@qq.com')"
con.query(strSql6,(err, results, fields)=>{
  if(err) {
    console.log(err);
  } else {
    console.log("数据插入成功");
    console.log(results);
  }
})  */

// 使用占位符来插入数据
let strSql7 = "insert into UserAccount (username,password,mail) values (?,?,?)"
con.query(strSql7,["小红","666avv","123@126.com"],(err, results, fields)=>{
  if(err) {
    console.log(err);
  } else {
    console.log("数据插入成功");
    console.log(results);
  }
}) 