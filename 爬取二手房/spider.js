const puppeteer = require('puppeteer');
const fs = require('fs');
const { resolve } = require('path');
const ObjectsToCsv = require('objects-to-csv');
// 爬取二手房网


// 省份选择网站
let httpUrl = 'https://www.fang.com/SoufunFamily.htm';

let options = {
  headless: true
}
// 延迟函数
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
  
  for(let i = 516;i < cityList.length;i++){
    await writeCityHouseInfo(browser, cityList[i])
    await wait(1000)
  }
  
  await browser.close();
})()

// 爬取所有的省市以及它们对应的二手房地址
async function getCities(browser) {
  let page = await browser.newPage()
  await page.goto(httpUrl)
  let cityList = await page.$$eval('#senfe tr:not(#sffamily_B03_30) td a', elements => {
    let cities = []

    elements.forEach((item, index) => {
      let cityName = item.innerHTML;
      let cityUrl = item.getAttribute('href').trim().replace('.fang.com', '.esf.fang.com')
      if(cityUrl.search('cq') !== -1 && cityUrl !== 'http://cq.fang.com/') {
        cityUrl = cityUrl.replace('cq','');
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
  await page.goto(cityUrl + '/house/' + `h316-i3${pageId}`)
  let houseInfos = await page.$$eval('dl[dataflag="bg"]', elements => {
    let infos = []
    elements.forEach((item, index) => {
      // console.log(item.innerHTML);
      let houseName = item.querySelector('.tit_shop').innerText
      let houseDetail = item.querySelector('.tel_shop').innerText.split(' | ')
      let addressInfo = item.querySelector('.add_shop').innerText.split('\n')
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
    pageNum = await getPageNum(browser, cityObj.cityUrl)
  } catch (error) {
    console.log(cityObj.cityName+"没有二手房");
  }
  console.log('当前爬取'+cityObj.cityName+', 共'+pageNum+'页');
  let cityHouseInfo = []
  for (let i = 1; i <= pageNum; i++) {
    let infos = await getPageInfo(browser, cityObj.cityUrl, i)
    console.log('第' + i + '页爬取完毕');
    if (infos.length === 0){
      console.log("爬了个寂寞");
      process.exit(0);
    }
    cityHouseInfo.push(...infos)
    await wait(500)
  }
  let csv = new ObjectsToCsv(cityHouseInfo)
  await csv.toDisk(`./二手房信息/${cityObj.cityName}.csv`)
  // let jsonInfos = JSON.stringify(cityHouseInfo)
  // fs.writeFile(`./二手房信息/${cityObj.cityName}.json`, jsonInfos, { flag: "a" }, () => {
  //   console.log("房产信息写入完成");
  // })
}