import { getCountyAndStation } from "../function/getCountyAndStation.js";
import { getAirData } from "../function/getAirData.js";

export const createAirDataTable = async () => {
  let newAirDataDom = document.createElement("div");
  let newAirDataTitle = document.createElement("div");
  let newAirDataTitleText = document.createTextNode("全國空氣指標即時觀測");
  let newAirSearchDiv = document.createElement("div");
  let newSearchTitle = document.createElement("div");
  let newSearchTitleText = document.createTextNode("直接點擊地圖選擇觀測站或是");
  let newSearchSelect = document.createElement("select");

  // 設定id，加入class
  newSearchSelect.id = "countySelect";
  newSearchSelect.className = "airData__search__countySelect text-base-400";
  newAirDataDom.classList.add("airData");
  newAirDataDom.id = "airDataDom";
  newAirDataTitle.className = "airData__Title text-2xl-700";
  newAirSearchDiv.className = "airData__search";
  newSearchTitle.className = "airDtat__search__title text-lg-700";

  // 建立初始選項
  let defaultOption = document.createElement("option");
  defaultOption.textContent = "縣市";
  defaultOption.value = "";
  defaultOption.disabled = true;
  defaultOption.selected = true;
  newSearchSelect.appendChild(defaultOption);

  // 建立選項
  let counties = await getCountyAndStation("county");
  counties.forEach((county) => {
    let option = document.createElement("option");
    option.value = county;
    option.textContent = county;
    newSearchSelect.appendChild(option);
  });

  // 組合DOM
  document.querySelector("main").appendChild(newAirDataDom);
  newAirDataDom.appendChild(newAirDataTitle);
  newAirDataTitle.appendChild(newAirDataTitleText);
  newAirDataDom.appendChild(newAirSearchDiv);
  newAirSearchDiv.appendChild(newSearchTitle);
  newSearchTitle.appendChild(newSearchTitleText);
  newAirSearchDiv.appendChild(newSearchSelect);

  // 監聽選擇的縣市
  newSearchSelect.addEventListener("change", async (event) => {
    // 取得縣市資料
    const selectedCounty = event.target.value;
    const stationData = await getCountyAndStation({ county: selectedCounty });
    console.log("該縣市的測站資料：", stationData);

    // 取得容器DOM
    let airDataDOM = document.getElementById("airDataDom");

    // 若有舊的StationDom，要先移除
    const oldStationDom = airDataDOM.querySelector(".airData__station");
    if (oldStationDom) {
      airDataDOM.removeChild(oldStationDom);
    }

    // 渲染該縣市的監測站
    let newStationData = document.createElement("div");
    newStationData.className = "airData__station";
    document.getElementById("airDataDom").appendChild(newStationData);
    stationData.forEach((item) => {
      let newStationBtn = document.createElement("button");
      let newStationBtnText = document.createTextNode(item.sitename);
      newStationBtn.appendChild(newStationBtnText);
      newStationBtn.className = "airData__station__btn text-sm-500";
      document.querySelector(".airData__station").appendChild(newStationBtn);
    });
  });

  // 監聽點擊的監測站，並渲染資料
  document.getElementById("airDataDom").addEventListener("click", async(event) => {
    if (event.target.classList.contains("airData__station__btn")) {
      const stationName = event.target.textContent;
      console.log("點擊監測站：", stationName);

      //取得該監測站的空汙資料
      let stationAirData = await getAirData({sitename:stationName});
      console.log(stationAirData);
      let AQIScore = stationAirData.aqi;

      // 取得容器DOM
      let airDataDOM = document.getElementById("airDataDom");
      airDataDOM.innerHTML="";

      // 渲染監測站空汙資料
      // 監測站名稱、分數
      let newStationAirDataHeader = document.createElement("div");
      newStationAirDataHeader.className = "airData__stationDataHead";
      airDataDOM.appendChild(newStationAirDataHeader);

        // 概要框框
        let newStationSummary = document.createElement("div");
        newStationSummary.className = "airData__stationDataHead__summary";
        newStationAirDataHeader.appendChild(newStationSummary);

        // 概要內的左側文字DOM
        let newStationTitle = document.createElement("div");
        newStationTitle.className = "stationDataHead__summary__title";
        newStationSummary.appendChild(newStationTitle);

        let newStationLocation = document.createElement("div");
        newStationLocation.className = "text-sm-700";
        let newStationLocationText = document.createTextNode(`${stationAirData.county}/${stationAirData.sitename}`);
        newStationLocation.appendChild(newStationLocationText);

        let newStationAQI = document.createElement("div");
        newStationAQI.className = "text-xl-700";
        let newStationAQIText = document.createTextNode("空氣汙染指標 AQI");
        newStationAQI.appendChild(newStationAQIText);

        newStationTitle.appendChild(newStationLocation);
        newStationTitle.appendChild(newStationAQI);

        // 概要內的右側圖示與分數
        let newAQIStatus = document.createElement("div");
        newAQIStatus.className = "stationDataHead__summary__status";
        newStationSummary.appendChild(newAQIStatus);
        
        let newStatusImg = document.createElement("img");
        newStatusImg.className = "summary__status__img";
        let imgUrl;
        if(AQIScore<=50){imgUrl="../static/image/good.png"}
        else if (51<=AQIScore<=100){imgUrl="../static/image/soso.png"}
        else if (101<=AQIScore<=300){imgUrl="../static/image/bad.png"}
        else{imgUrl="../static/image/popo.png"}
        newStatusImg.src=imgUrl;
        newAQIStatus.appendChild(newStatusImg);

        let newAQIScroe = document.createElement("div");
        newAQIScroe.className = "summary__status__AQI";
        let newScore = document.createElement("div");
        newScore.className = "text-xl-700 status__AQI__score";
        let newScoreText = document.createTextNode(AQIScore);
        newScore.appendChild(newScoreText);
        newAQIScroe.appendChild(newScore);

        let newStatus = document.createElement("div");
        newStatus.className = "text-sm-500 status__AQI__status"
        let newStatusText = document.createTextNode(stationAirData.status);
        newStatus.appendChild(newStatusText);
        newAQIScroe.appendChild(newStatus);

        newAQIStatus.appendChild(newAQIScroe);
    }
  });
};

createAirDataTable();
