const axios = require('axios');

let httpUrl = "https://www.doutula.com/article/list/?page=1"

// 挂代理
let options = {
  proxy: {
    host: '127.0.0.1',
    port: 9000,
    auth: {
      username: 'mikeymike',
      password: 'rapunz31'
    }
  }
}

axios.get(httpUrl, options).then((res) => {
  console.log(res.data);
})