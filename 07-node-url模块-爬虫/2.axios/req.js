const axios = require("axios")

// console.log(axios);

// let httpUrl = "https://www.dytt8.net/index.htm"
// let httpUrl = "https://api.apiopen.top/getJoke?page=1&count=10&type=image"
let httpUrl = "https://www.bilibili.com/video/BV1i7411G7kW?p=9"

axios.get(httpUrl, {
  headers: {
    'Upgrade-Insecure-Requests': 1,
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36'
  }
}).then(
  res => {
    console.log(res.data);
  }
)