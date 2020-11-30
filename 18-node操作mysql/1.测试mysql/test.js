const mysql = require('mysql');
let options = {
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: 'weng6622',
  database: 'book'
}

// 创建与数据库的连接对象
let con = mysql.createConnection(options);


function sqlQuery (strSql, arr) {
  return new Promise((resolve, reject) => {
    con.query(strSql, arr, (err, results) => {
      if(err) {
        reject(err)
      } else {
        resolve(results)
      }
    })
  })
}

async function getBookList (page) {
  let strSql = 'select * from book limit ?,20'
  let offsetIndex = (page - 1)*20
  let res = await sqlQuery(strSql,[offsetIndex])
  console.log(res);
}

// getBookList(1)
module.exports = getBookList