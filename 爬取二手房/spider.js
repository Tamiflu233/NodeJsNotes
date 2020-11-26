const puppeteer = require('puppeteer');
const fs = require('fs');
const { resolve } = require('path');
const ObjectsToCsv = require('objects-to-csv');
// 爬取二手房网


// 省份列表网站
let httpUrl = 'https://www.fang.com/SoufunFamily.htm';

let options = {
  headless: true
}
// 延迟函数(爬取页面需要延迟)
async function wait(millisec) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('延迟成功')
    }, millisec);
  })
}

// 爬虫主程序
; (async function spider() {
  let browser = await puppeteer.launch(options)
  let cityList = await getCities(browser)
  let jsonCityList = JSON.stringify(cityList)
  fs.writeFile('cityInfo.json', jsonCityList, { flag: "w" }, () => {
    console.log('写入成功, 共有'+cityList.length+"个城市");
  })

  // console.log(pageNum);
  // 爬取633个城市
  for(let i = 0;i < cityList.length;i++){
    await writeCityHouseInfo(browser, cityList[i])
    await wait(1000)
  }
  // 关闭浏览器
  await browser.close();
})()

// 爬取所有的省市以及它们对应的二手房地址
async function getCities(browser) {
  let page = await browser.newPage()
  await page.goto(httpUrl)
  // 获取所有城市的url
  let cityList = await page.$$eval('#senfe tr:not(#sffamily_B03_30) td a', elements => {
    let cities = []

    elements.forEach((item, index) => {
      let cityName = item.innerHTML;
      let cityUrl = item.getAttribute('href').trim().replace('.fang.com', '.esf.fang.com')
      // 特殊处理一些城市的url
      if(cityUrl.search('cq') !== -1 && cityUrl !== 'http://cq.fang.com/') {
        cityUrl = cityUrl.replace('cq','');
      }else if(cityName === '香港') {
        cityUrl = 'https://hk.esf.fang.com'
      }else if(cityName === '昌吉') {
        cityUrl = 'https://changji.esf.fang.com'
      }else if(cityName === '绍兴') {
        cityUrl = 'https://shaoxing.esf.fang.com'
      }else if(cityName === '吴江') {
        cityUrl = 'https://wj.esf.fang.com'
      }
      let obj = {
        cityName,
        cityUrl
      }
      cities.push(obj)
    })
    return cities
  })
  await page.close()
  return cityList
}

// 爬取每个省市页面的总页数并返回
async function getPageNum(browser, cityUrl) {
  let page = await browser.newPage()
  await page.goto(cityUrl)
  let pageNum = 0
  try {
    // 获取总页码字符串
      pageNum = await page.$eval('.page_al span:last-child', element => {
        let numStr = element.innerHTML
        return numStr.slice(1, numStr.length - 1)
      })
  } catch (error) {
    console.log("该城市没有二手房: "+cityUrl);
  }
  await page.close()
  return parseInt(pageNum)
}

// 爬取每一页的所有房产信息并返回
async function getPageInfo(browser, cityUrl, pageId) {
  let page = await browser.newPage()
  // 跳转到每一页
  await page.goto(cityUrl + '/house/' + `h316-i3${pageId}`)
  // 获取该页面所有二手房信息
  let houseInfos = await page.$$eval('dl[dataflag="bg"]', elements => {
    let infos = []
    elements.forEach((item, index) => {
      // console.log(item.innerHTML);
      // 二手房名称
      let houseName = item.querySelector('.tit_shop').innerText
      // 二手房详细信息
      let houseDetail = item.querySelector('.tel_shop').innerText.split(' | ')
      // 二手房地址
      let addressInfo = item.querySelector('.add_shop').innerText.split('\n')
      // 二手房房价
      let price = item.querySelector('.price_right span:last-child').innerText
      let houseInfo = {
        houseName,
        houseScale: houseDetail[0],
        houseArea: houseDetail[1],
        houseLayers: houseDetail[2],
        houseDirect: houseDetail[3],
        builtDate: houseDetail[4],
        owner: houseDetail[5],
        community: addressInfo[0],
        detailAddress: addressInfo[1],
        price
      }
      infos.push(houseInfo)
    })
    return infos
  })
  await page.close()
  return houseInfos
}

// 爬取一个省市所有的房产信息并写到文件中
async function writeCityHouseInfo(browser, cityObj) {
  let pageNum = 0
  try {
    // 获取页数
    pageNum = await getPageNum(browser, cityObj.cityUrl)
  } catch (error) {
    // 若没有二手房，则输出提示
    console.log(cityObj.cityName+"没有二手房");
  }
  console.log('当前爬取'+cityObj.cityName+', 共'+pageNum+'页');
  let cityHouseInfo = []
  for (let i = 1; i <= pageNum; i++) {
    let infos = await getPageInfo(browser, cityObj.cityUrl, i)
    console.log('第' + i + '页爬取完毕');
    if (infos.length === 0){
      // 若有验证码出现，直接提示并退出
      console.log("爬了个寂寞");
      process.exit(0);
    }
    cityHouseInfo.push(...infos)
    await wait(500)
  }
  // 写入csv
  let csv = new ObjectsToCsv(cityHouseInfo)
  await csv.toDisk(`./二手房信息/${cityObj.cityName}.csv`)
  
}