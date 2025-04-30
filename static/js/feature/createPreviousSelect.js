import { getCountyAndStation } from "../function/getCountyAndStation.js";

export async function createPreviousSelect(){

    const countySelect = document.getElementById('county-select');

    // 建立選項
    let counties = await getCountyAndStation("county");
    console.log(counties)
    counties.forEach((county) => {
        let option = document.createElement("option");
        option.value = county;
        option.textContent = county;
        countySelect.appendChild(option);
    });

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
    document
        .getElementById("airDataDom")
        .addEventListener("click", async (event) => {
            if (event.target.classList.contains("airData__station__btn")) {
                const stationName = event.target.textContent;
                console.log("點擊監測站：", stationName);
            }
        });
}