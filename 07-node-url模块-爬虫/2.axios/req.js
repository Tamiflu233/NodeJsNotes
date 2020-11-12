// const axios = require("axios");
const { get } = require("request");
const request = require('request')
const {fsRead,fsWrite,fsDir} = require("./lcfs")
const fs = require("fs")
// console.log(axios);

// let httpUrl = "https://www.dytt8.net/index.htm"
let httpUrl = "https://www.1905.com/vod/list/n_1/o3u1p1.html"
// let httpUrl = "https://api.apiopen.top/getJoke?page=1&count=10&type=image"
// let httpUrl = "https://www.bilibili.com/video/BV1i7411G7kW?p=9"

// axios请求数据
// axios.get(httpUrl, {
//   headers: {
//     'Upgrade-Insecure-Requests': 1,
//     'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36'
//   }
// }).then(
//   res => {
//     console.log(res.data);
//   }
// )

// request请求数据



// 根据电影链接获取电影的详细信息
function req(url) {
  return new Promise((resolve, reject) => {
    request.get(url, (err, response, body) => {
      // response是完整的request相应对象，body是请求来的数据
      if (err) {
        reject(err)
      } else {
        resolve({ response, body })
      }
    })
  })
}

// 获取起始页面的所有分类的地址
async function getClassUrl() {
  let { response, body } = await req(httpUrl)
  // console.log(body);
  /* 
    表达式 .* 就是单个字符dao匹配bai任意次，即贪婪匹配。 
    表达式 .*? 是满足du条件的情况只匹配一zhi次，即最小匹配.
  */
  let reg = /<span class="search-index-L">类型(.*?)<div class="grid-12x">/igs;  //s表示是否.*可以匹配换行符
  // 解析html内容
  /* 
    exec()
    如果没有找到匹配的字符串，那么返回null，否则将返回一个数组，数组的第0个元素存储的是匹配字符串，
    第1个元素存放的是第一个引用型分组(子表达式)匹配的字符串，第2个元素存放的是第二个引用型分组(子表达式)匹配的字符串，
    依次类推。同时此数组还包括两个对象属性，
    index属性声明的是匹配字符串的起始字符在要匹配的完整字符串中的位置，input属性声明的是对要匹配的完整字符串的引用。
    exec默认会找第一个，想继续找后面符合条件的几个就得多次调用(可以来个循环),每次都会从上一次找的位置后面继续找 
  */
  let result = reg.exec(body)[1]
  // location.href的.要转义,javascript:void(0)的括号当然也要转义,冒号貌似也要(正则的所有有意义的符号都得转义)
  let reg1 = /<a href="javascript\:void\(0\);" onclick="location\.href='(.*?)';return false;".*?>(.*?)<\/a>/igs
  let arrClass = []
  let res;
  while (res = reg1.exec(result)) {
    if(res[2] != "全部") {
      let obj = {
        className: res[2],
        url: res[1]
      }
      arrClass.push(obj)
      await fsDir("./movies/" + res[2])
      getMovies(res[1], res[2])
    }
  }

  // console.log(arrClass);
}

// 通过分类，获取页面中的电影链接
async function getMovies(url, moviesType) {
  let { response, body } = await req(url)
  let reg = /<a class="pic-pack-outer" target="_blank" href="(.*?)".*?"><img/igs
  let res;
  let arrList = []
  while (res = reg.exec(body)) {
    // 改进, 可以改为迭代器，提升性能
    arrList.push(res[1])
    parsePage(res[1], moviesType)

  }
  // console.log("分类: ", moviesType);
  // console.log(arrList);
}

async function parsePage (url, moviesType) {
  let {response, body} = await req(url)
  let reg = /<h1 class="playerBox-info-name playerBox-info-cnName">(.*?)<\/h1>.*?id="playerBoxIntroCon">(.*?)<a.*?导演.*?target="\_blank" title="(.*?)" data\-hrefexp/igs;
  let res = reg.exec(body)
  // console.log(res[1]);
  let movie = {
    name:res[1],
    brief: res[2],
    daoyan: res[3],
    movieUrl: url,
    moviesType
  }
  let strMovie = JSON.stringify(movie)
  fsWrite('./movies/' + moviesType + "/" + movie.name + ".json",strMovie)
  fs.watchFile("./")
}

getClassUrl()