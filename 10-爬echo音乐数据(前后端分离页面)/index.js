const axios = require('axios');
const fs = require('fs');
const path = require('path');

// 目标：下载音乐
// 1. 获取音乐相关的信息，通过音乐相关的信息获取mp3的地址
// 2. 如何获取大量的音乐信息，获取音乐列表
// 3. 通过音乐的分类页，获取音乐列表
// ps.echo回声网已凉，爬不了了



async function getPage (num) {
  let httpUrl = 'https://www.app-echo.com/api/recommend/sound-day?page='+num
  let res = await axios.get(httpUrl)
  // console.log(res.data);
  res.data.list.forEach((item,index) => {
    let title = item.sound.name
    let mp3Url = item.sound.source
    let filename = path.parse(mp3Url).name
    let content = `${title},${mp3Url},${filename}\n`
    fs.writeFile('music.txt',content,{ flag: "a", encoding: "utf-8" },() => {
      console.log('写入完成: '+content);
    })
    download(mp3Url,filename)
  })

}

async function download (mp3Url, title) {
  let res = null
  try {
    res = await axios.get(mp3Url,{responseType: 'stream'})
  } catch (error) {
    console.log('请求不到数据');
  }
  let ws = fs.createWriteStream('./mp3/'+title+'.mp3')
  if(res !== null) {
    res.data.on('close', () =>{
      ws.close()
    })
    res.data.pipe(ws)
  }else {
    ws.close()
  }
}

getPage(1)