const fs = require("fs")
const { fsReader, fsWriter, fsDir } = require("./fspack")
const request = require("request")
const { log } = require("console")
const { resolve } = require("path")

// 目标url
targetUrl = "https://www.1905.com/vod/list/n_1/o3u1p1.html"

// 发送GET请求
function reqData(url) {
  return new Promise((resolve, reject) => {
    request.get(url, (err, response, body) => {
      if (err) {
        reject(err)
      } else {
        resolve({
          response,
          body
        })
      }
    })
  })
}

// 获取分类标题和url
function getCateTitle(data) {
  let reg = /<span class="search-index-L">类型 :(.*?)<div class="grid-12x">/igs
  let htmData1 = reg.exec(data)[1];
  // console.log(htmData1);
  let titleReg = /<a href="javascript\:void\(0\);" onclick="location\.href='(.*?)';return false;" .*?>(.*?)<\/a>/igs
  let titleList = []
  let each;
  while (each = titleReg.exec(htmData1)) {
    if (each[2] !== "全部") {
      let obj = {
        classTitle: each[2],
        url: each[1]
      }
      titleList.push(obj)
    }
  }
  return titleList
}

async function getCateMovies(cateUrl) {
  let data;
  try {
    let { body } = await reqData(cateUrl)
    data = body
  } catch (error) {
    console.log(error.stack);
  }
  let movieReg = /<a class="pic-pack-outer" target="\_blank" href="(.*?)" title="(.*?)"><img/igs
  let each;
  let moviesInfo = []
  while (each = movieReg.exec(data)) {
    let obj = {
      movieTitle: each[2],
      url: each[1]
    }
    moviesInfo.push(obj)
  }
  resolve(moviesInfo)
}

// 爬取数据
async function getTargetData() {
  // 得到数据
  let data
  try {
    let { body } = await reqData(targetUrl)
    data = body;
  } catch (e) {
    console.err(e.stack);
  }
  // 正则提取数据
  // 获取分类标题和url
  let cateList = getCateTitle(data)
  let strCate = JSON.stringify(cateList)
  await fsWriter("./CateUrl.json", strCate)
  // console.log(cateList);
  let movieCateInfo = {}
  cateList.forEach(async item => {
    let movieInfo = await getCateMovies(item.url)
    movieCateInfo[item.classTitle] = movieInfo
  })
  console.log(movieCateInfo);
}

getTargetData()
