import { renderHeaderAndFooter } from "./feature/headerAndFooter.js";
import { getChart } from "./feature/chartData.js";

document.addEventListener('DOMContentLoaded', async() => {
    await renderHeaderAndFooter();

    const path = window.location.pathname;
    console.log(path)
    if (path === "/index.html"){
        console.log("首頁的功能們")

        const mainPageBtn = document.getElementById('main-page-btn');
        mainPageBtn.style.display = "flex";
        mainPageBtn.addEventListener('click', ()=>{
            window.location.href='/previous.html';
        })
    }
    
    if (path === "/previous.html"){
        console.log("歷史監測資料")

        const previousPageBtn = document.getElementById('previous-page-btn');
        previousPageBtn.style.display = "flex";
        previousPageBtn.addEventListener('click', ()=>{
            window.location.href='/index.html';
        })

        // 先 addeventListner 獲取站點資料
        getChart();
    }
})