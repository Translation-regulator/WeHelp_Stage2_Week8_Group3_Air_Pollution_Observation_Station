import { getCountyAndStation } from "../function/getCountyAndStation.js";
import { getAirData } from "../function/getAirData.js";

export const createAirDataTable = async () => {
  let newAirDataDom = document.createElement("div");
  let newAirDataTitle = document.createElement("div");
  let newAirDataTitleText = document.createTextNode("全國空氣指標即時觀測");
  let newAirSearchDiv = document.createElement("div");
  let newSearchTitle = document.createElement("div");
  let newSearchTitleText =
    document.createTextNode("直接點擊地圖選擇觀測站或是");
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
    // console.log("該縣市的測站資料：", stationData);

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
  document
    .getElementById("airDataDom")
    .addEventListener("click", async (event) => {
      if (event.target.classList.contains("airData__station__btn")) {
        const stationName = event.target.textContent;
        // console.log("點擊監測站：", stationName);

        // 取得該監測站的空汙資料
        let stationAirData = await getAirData({ sitename: stationName });
        // console.log(stationAirData);
        let AQIScore = stationAirData.aqi;

        // 取得容器DOM
        const airDataDOM = document.getElementById("airDataDom");
        airDataDOM.innerHTML = "";

        // 渲染監測站空汙資料
        // 監測站名稱、分數
        let newStationAirDataHeader = document.createElement("div");
        newStationAirDataHeader.className = "airData__stationDataHead";
        airDataDOM.appendChild(newStationAirDataHeader);
        if (AQIScore <= 50) {
          newStationAirDataHeader.classList.add("airData__stationDataHead--lightGreen");
        } else if (51 <= AQIScore <= 100) {
          newStationAirDataHeader.classList.add("airData__stationDataHead--darkGreen");
        } else if (101 <= AQIScore <= 150) {
          newStationAirDataHeader.classList.add("airData__stationDataHead--lightYellow");
        } else if (151 <= AQIScore <= 200) {
          newStationAirDataHeader.classList.add("airData__stationDataHead--darkYellow");
        }else if (201 <= AQIScore <= 300) {
          newStationAirDataHeader.classList.add("airData__stationDataHead--lightRed");
        } else {
          newStationAirDataHeader.classList.add("airData__stationDataHead--darkRed");
        }

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
        let newStationLocationText = document.createTextNode(
          `${stationAirData.county}/${stationAirData.sitename}`
        );
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
        if (AQIScore <= 50) {
          imgUrl = "../static/image/good.png";
        } else if (51 <= AQIScore <= 100) {
          imgUrl = "../static/image/soso.png";
        } else if (101 <= AQIScore <= 150) {
          imgUrl = "../static/image/bad.png";
        } else if (151 <= AQIScore <= 200) {
          imgUrl = "../static/image/bad.png";
        }else if (201 <= AQIScore <= 300) {
          imgUrl = "../static/image/bad.png";
        } else {
          imgUrl = "../static/image/popo.png";
        }
        newStatusImg.src = imgUrl;
        newAQIStatus.appendChild(newStatusImg);

        let newAQIScroe = document.createElement("div");
        newAQIScroe.className = "summary__status__AQI";
        let newScore = document.createElement("div");
        newScore.className = "text-xl-700 status__AQI__score";
        let newScoreText = document.createTextNode(AQIScore);
        newScore.appendChild(newScoreText);
        newAQIScroe.appendChild(newScore);

        let newStatus = document.createElement("div");
        newStatus.className = "text-sm-500 status__AQI__status";
        let newStatusText = document.createTextNode(stationAirData.status);
        newStatus.appendChild(newStatusText);
        newAQIScroe.appendChild(newStatus);

        newAQIStatus.appendChild(newAQIScroe);

        //新增時間
        let newTimeDiv = document.createElement("div");
        newTimeDiv.className = "airData__stationDataHead__time text-xs-500";
        newTimeDiv.innerText = `偵測時間：${stationAirData.publishtime}`;
        document
          .querySelector(".airData__stationDataHead")
          .appendChild(newTimeDiv);

        // 新增叉叉
        let newCrossImg = document.createElement("img");
        newCrossImg.className = "airData__stationDataHead__cross";
        newCrossImg.src = "../static/image/cross.png";
        document
          .querySelector(".airData__stationDataHead")
          .appendChild(newCrossImg);

        // 點擊叉叉回到選擇縣市畫面
        document
          .querySelector(".airData__stationDataHead__cross")
          .addEventListener("click", function () {
            window.location.href = "/";
          });

        // 渲染空污資料
        let newAirDataContent = document.createElement("div");
        newAirDataContent.className = "airData__content";
        airDataDOM.appendChild(newAirDataContent);

        // 整理空汙資料的順序&格式
        let airDataAnalyze = [
          {
            key: "O3",
            subtitle: "臭氧",
            concen: stationAirData.o3,
            unit: "ppb",
            avgKey: "o3_8hr",
            avgTitle: "8 小時平均濃度",
            avgConcen: stationAirData.o3_8hr,
          },
          {
            key: "PM2.5",
            subtitle: "細懸浮微粒",
            concen: stationAirData["pm2.5"],
            unit: "μg/m3",
            avgKey: "pm2.5_avg",
            avgTitle: "平均濃度",
            avgConcen: stationAirData["pm2.5_avg"],
          },
          {
            key: "PM10",
            subtitle: "懸浮微粒",
            concen: stationAirData.pm10,
            unit: "μg/m3",
            avgKey: "pm10_avg",
            avgTitle: "平均濃度",
            avgConcen: stationAirData.pm10_avg,
          },
          {
            key: "CO",
            subtitle: "一氧化碳",
            concen: stationAirData.co,
            unit: "ppb",
            avgKey: "co_8hr",
            avgTitle: "8 小時平均濃度",
            avgConcen: stationAirData.co_8hr,
          },
          {
            key: "SO2",
            subtitle: "二氧化硫",
            concen: stationAirData.so2,
            unit: "ppb",
            avgKey: "so2_avg",
            avgTitle: "平均濃度",
            avgConcen: stationAirData.so2_avg,
          },
          {
            key: "NO",
            subtitle: "一氧化氮",
            concen: stationAirData.no,
            unit: "ppb",
          },
          {
            key: "NO2",
            subtitle: "二氧化氮",
            concen: stationAirData.no2,
            unit: "ppb",
          },
        ];
        // 建立渲染的html格式
        let airDataHTML = "";
        airDataAnalyze.forEach((item, index) => {
          let airDataClass =
            index % 2 === 0
              ? "airData__content__item--even"
              : "airData__content__item--odd";

          if (item.avgKey) {
            airDataHTML += `
                <div class="${airDataClass}">
                    <div class="item__title">
                        <p class="item__title__EngTitle text-2xl-700">${item.key}</sub></p>
                        <p class="item__title__ChiTitle text-base-500">${item.subtitle}</p>
                    </div>
                    <div class="item__data">
                        <div class="item__data__row">
                            <p class="row__title text-base-500">${item.avgTitle}</p>
                            <p class="row__score text-2xl-700">${item.avgConcen}</p>
                            <p class="row__unit text-sm-500">${item.unit}</p>
                        </div>
                        <div class="item__data__hr"></div>
                        <div class="item__data__row">
                            <p class="row__title text-base-500">小時濃度</p>
                            <p class="row__score text-2xl-700">${item.concen}</p>
                            <p class="row__unit text-sm-500">${item.unit}</p>
                        </div>
                    </div>
                </div>
            `;
          } else {
            airDataHTML += `
                <div class="${airDataClass}">
                    <div class="item__title">
                        <p class="item__title__EngTitle text-2xl-700">${item.key}</sub></p>
                        <p class="item__title__ChiTitle text-base-500">${item.subtitle}</p>
                    </div>
                    <div class="item__data">
                        <div class="item__data__row">
                            <p class="row__title text-base-500">小時濃度</p>
                            <p class="row__score text-2xl-700">${item.concen}</p>
                            <p class="row__unit text-sm-500">${item.unit}</p>
                        </div>
                    </div>
                </div>
            
            
            `;
          }
        });
        newAirDataContent.innerHTML=airDataHTML;

        // Discord按鈕
        let newDiscordDiv = document.createElement("div");
        newDiscordDiv.className = "airData__discord";
        airDataDOM.appendChild(newDiscordDiv);
        let newDiscordBtn = document.createElement("button");
        newDiscordBtn.className = "airData__discord__btn text-sm-500";
        newDiscordBtn.innerText = "發送至Discord";
        newDiscordDiv.appendChild(newDiscordBtn);
        // discord圖片
        let newDiscordImg = document.createElement("img");
        newDiscordImg.className = "airData__discord__img";
        newDiscordImg.src = "../static/image/discord.png";
        newDiscordBtn.appendChild(newDiscordImg);

        // 取得監測站ID，給Discord按鈕做連接使用
        window.chooseSiteId = stationAirData.siteid;
        // console.log(window.chooseSiteId);
      }
    });
};
