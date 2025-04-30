
/** 縣市下拉選單監聽
 * @description 監聽縣市下拉選單，點擊可渲染該縣市監測站
 * @param allStations 所有的站點資料，由getCountyAndStation({ county: "total" })取得
 */
export function onStationListClick(allStations){
    document.getElementById("countySelect").addEventListener("change", async (event) => {
        // 取得點擊的縣市資料
        const selectedCounty = event.target.value;
        console.log(selectedCounty)

        // 過濾點擊的縣市有哪些測站
        const stationData = allStations.filter(
            (item)=> item.county === selectedCounty
        );
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
}