# 專案網站
## 主題： 空氣品質探測站
### https://www.airpullution.site/

### 網站功能
全台灣空氣污染指標

1. 全台即時空污詳細資訊 --> 每小時更新一次
2. 各地區探測站結合列表形式
3. 各地區一週前空氣品質歷史資料(圖表)
4. 推播當前空汙資料至 discord #bot 頻道

### 技術主題
1. SVG Graph and Animation
2. Chart.js
3. 串接 API，來源: 環境部環境資料開放平台開放資料
4. 串接 Discord Webhook 

### 組員
 張兆丞
 廖宜昀
 周意惠
 王妤甄

### 組員分工方式
#### 兆丞：

#### 宜昀：

#### 意惠：
1. 功能發想, 分工討論
2. 站點 API 、即時空氣品質 API 串接與資料整理
3. 探選單頁面、即時資料表格動態生成，並依空氣品質分級顯示不同顏色
4. discord button 串接後端路由
4. 提供共用function供組員使用 
```js
getAirData("tottal")
getCountyAndStation("新北市")
renderCountyStations("新北市")
renderStationAirDataDom("三重")
```
#### 妤甄：
