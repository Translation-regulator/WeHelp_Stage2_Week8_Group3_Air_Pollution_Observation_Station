import { renderHeaderAndFooter } from "./feature/headerAndFooter.js";
import { getAirData } from "./function/getAirData.js";
import { getCountyAndStation } from "./function/getCountyAndStation.js";
import taiwanMap from "./feature/taiwanMap.js";
import { createAirDataTable } from "./feature/createAirDataTable.js";
import { sendMessage } from "./function/sendMessageToDiscord.js";
import { createPreviousSelect } from "./feature/createPreviousSelect.js";
import { confirmPreviousSelect } from "./feature/confirmPreviousSelect.js";
import { revisePreviousPage } from "./feature/revisePreviousPage.js";

document.addEventListener('DOMContentLoaded', async() => {
    await renderHeaderAndFooter();
    
    const path = window.location.pathname;
    console.log(path)
    if (path === "/"){
        console.log("首頁的功能們")

        //渲染台灣地圖
        taiwanMap.init();

        //渲染右側縣市及觀測站空污資訊
        createAirDataTable();
        const previousPageBtn = document.getElementById('previous-page-btn');
        previousPageBtn.style.display = "flex";
        previousPageBtn.addEventListener('click', ()=>{
            window.location.href='/previous';
        })
    }
    
    if (path === "/previous"){
        console.log("歷史監測資料")
        
        revisePreviousPage(); //頁面調整
        createPreviousSelect(); //縣市觀測站渲染
        confirmPreviousSelect(); //送出圖表需求
    }
})