import { renderHeaderAndFooter } from "./feature/headerAndFooter.js";
import { getAirData } from "./function/getAirData.js";
import { getCountyAndStation } from "./function/getCountyAndStation.js";
import taiwanMap from "./feature/taiwanMap.js";
import { createAirDataTable } from "./feature/createAirDataTable.js";


document.addEventListener('DOMContentLoaded', async() => {
    await renderHeaderAndFooter();
    taiwanMap.init();

    const path = window.location.pathname;
    console.log(path)
    if (path === "/"){
        console.log("首頁的功能們")
        //渲染右側縣市及觀測站空污資訊
        createAirDataTable();
        const mainPageBtn = document.getElementById('main-page-btn');
        mainPageBtn.style.display = "flex";
        mainPageBtn.addEventListener('click', ()=>{
            window.location.href='/previous.html';
        })
    }
    
    if (path === "/previous"){
        console.log("歷史監測資料")

        const previousPageBtn = document.getElementById('previous-page-btn');
        previousPageBtn.style.display = "flex";
        previousPageBtn.addEventListener('click', ()=>{
            window.location.href='/index.html';
        })
    }
})