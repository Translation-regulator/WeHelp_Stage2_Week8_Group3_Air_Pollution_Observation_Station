export async function getChart(){
    await getAQIData("6", "新北市"); //先寫死用新北市板橋的資料
}

async function getAQIData(siteId, county) {
    const url = 'https://data.moenv.gov.tw/api/v2/aqx_p_434?api_key=b68831b5-fc06-4223-879c-9d92b9d4d293';
    try {
        const response = await fetch(url);
        const result = await response.json();
        const records = result.records;
        // console.log(records)
        
        // 取出資料陣列
        const siteIdRecords = [];
        for (const item of records){
            if (item.siteid === siteId){
                siteIdRecords.push(item);
                if (siteIdRecords.length >= 7) break;
            }
        }
        siteIdRecords.sort((a,b) => new Date(a.monitordate) - new Date(b.monitordate))
        
        const siteIdForChart ={
            county: county,
            sitename: siteIdRecords[0].sitename,
            monitordateData : [], //日期
            aqiData : [], //空氣品質指標
            cosubindexData : [], //一氧化碳副指標
            no2subindexData : [], //二氧化氮副指標
            o3subindexData : [], //臭氧副指標
            o38subindexData : [], //臭氧8小時副指標
            pm10subindexData : [], //懸浮微粒副指標
            pm25subindexData : [], //細懸浮微粒副指標
            so2subindexData : [], //二氧化硫副指標
        }

        siteIdRecords.forEach(item => {
            siteIdForChart.monitordateData.push(item.monitordate);
            siteIdForChart.aqiData.push(Number(item.aqi || 0));
            siteIdForChart.cosubindexData.push(Number(item.cosubindex || 0));
            siteIdForChart.no2subindexData.push(Number(item.no2subindex || 0));
            siteIdForChart.o3subindexData.push(Number(item.o3subindex || 0)); // 有些為空字串
            siteIdForChart.o38subindexData.push(Number(item.o38subindex || 0));
            siteIdForChart.pm10subindexData.push(Number(item.pm10subindex || 0));
            siteIdForChart.pm25subindexData.push(Number(item.pm25subindex || 0));
            siteIdForChart.so2subindexData.push(Number(item.so2subindex || 0));
        });
        console.log(siteIdForChart)
        renderChart(siteIdForChart);
    } catch (error) {
        console.error('抓取 AQI 資料失敗:', error);
    }
}


function renderChart(data){
    const chartRender = document.getElementById('chart-render');
    chartRender.style.display = 'flex';
    const chartTitle = document.querySelector('#chart-render h3');
    chartTitle.textContent = `${data.county}/${data.sitename} 近七日空氣品質指標`;

    // 繪製圖表
    const ctx = document.getElementById('aqiChart').getContext('2d');

    if (window.myChart instanceof Chart) {
        window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.monitordateData,
            datasets: [
                {
                    label: 'PM2.5 (μg/m³)',
                    data: data.pm25subindex,
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                // title: {
                //     display: true,
                //     text: `${data.county}/${data.sitename} 近七日空氣品質指標`,
                //     font: {
                //         size: 18
                //     }
                // },
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'PM2.5 濃度 (μg/m³)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: '日期'
                    }
                }
            }
        }
    });
}