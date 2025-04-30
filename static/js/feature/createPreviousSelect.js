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

    // 預選縣市
    const defaultCounty = '新北市';
    countySelect.value = defaultCounty;
    await renderSiteChip({ target: { value: defaultCounty } });

    // 監聽選擇的縣市
    countySelect.addEventListener("change", async (event) => {
        await renderSiteChip(event)
    });

}

async function renderSiteChip(event){
    // 取得縣市資料
    const selectedCounty = event.target.value;
    const stationData = await getCountyAndStation({ county: selectedCounty });
    console.log("該縣市的測站資料：", stationData);

    // 取得容器DOM
    let siteSelect = document.getElementById("site-select");

    // 若有舊的SiteDom，要先移除
    siteSelect.innerHTML = "";

    // 渲染該縣市的監測站
    stationData.forEach((item) => {
        let newSiteData = document.createElement("button");
        newSiteData.textContent = item.sitename;
        newSiteData.className = "chip text-sm-500 site-select-option";
        siteSelect.appendChild(newSiteData);
    });
}


