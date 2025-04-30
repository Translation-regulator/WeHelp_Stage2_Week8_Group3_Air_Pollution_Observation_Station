export async function getChart(){
    await getAQIData("6", "新北市"); //先寫死用新北市板橋的資料
}

async function getAQIData(siteId, county) {
    const url = 'https://data.moenv.gov.tw/api/v2/aqx_p_434?api_key=b68831b5-fc06-4223-879c-9d92b9d4d293';
    try {
        const response = await fetch(url);
        const result = await response.json();
        const records = result.records;
        console.log(records)
        
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
            cosubindexData : [], //一氧化碳副指標 (ppm)
            o3subindexData : [], //臭氧副指標(ppm)
            o38subindexData : [], //臭氧8小時副指標(ppm)
            pm10subindexData : [], //懸浮微粒副指標(μg/m3 )
            pm25subindexData : [], //細懸浮微粒副指標(μg/m3 )
            no2subindexData : [], //二氧化氮副指標(ppb)
            so2subindexData : [], //二氧化硫副指標(ppb)
        }

        siteIdRecords.forEach(item => {
            siteIdForChart.monitordateData.push(item.monitordate);
            siteIdForChart.aqiData.push(Number(item.aqi || 0));
            siteIdForChart.cosubindexData.push(Number(item.cosubindex || 0));
            siteIdForChart.no2subindexData.push(Number(item.no2subindex || 0));
            siteIdForChart.o3subindexData.push(Number(item.o3subindex || 0)); 
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
    
    // 自訂 Plugin：高亮對應 y 軸的 ticks 顏色
    const highlightYAxisPlugin = {
        id: 'customHighlightAxis',
        afterDraw(chart) {
            const tooltip = chart.tooltip;
            const activeDataset = tooltip?.dataPoints?.[0]?.dataset;
            const yAxisID = activeDataset?.yAxisID;
        
            // 所有 y 軸 ticks 預設顏色設回灰色
            const scaleIds = ['y-aqi','y-μg/m3' , 'y-right-O3', 'y-right-CO', 'y-ppb'];
            let needUpdate = false;

            scaleIds.forEach(id => {
                const scale = chart.options.scales[id];
                if (scale && scale.ticks.color !== '#888') {
                    scale.ticks.color = '#888';
                    scale.title.color = '#888';
                    scale.ticks.font.weight = 'regular';
                    scale.title.font.weight = 'regular';                    
                    needUpdate = true;
                }
            });
        
            // 將被 hover 的 y 軸 ticks 改為 dataset 對應的顏色
            if (yAxisID && chart.options.scales[yAxisID]) {
                const currentTicksColor = chart.options.scales[yAxisID].ticks.color;
                const targetColor = activeDataset.borderColor;
        
                if (currentTicksColor !== targetColor) {
                chart.options.scales[yAxisID].ticks.color = targetColor;
                chart.options.scales[yAxisID].title.color = targetColor;
                chart.options.scales[yAxisID].ticks.font.weight = 'bold';
                chart.options.scales[yAxisID].title.font.weight = 'bold';
                needUpdate = true;
                }
            }
      
            if (needUpdate) chart.update('none'); // 加 'none' 可避免動畫卡頓
        }
      };
      
    Chart.register(highlightYAxisPlugin);

    // 繪製圖表
    const ctx = document.getElementById('aqiChart').getContext('2d');

    if (window.myChart instanceof Chart) {
        window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.monitordateData,
            datasets:[
                {
                    label: 'PM2.5 (μg/m³)',
                    data: data.pm25subindexData,
                    borderColor: '#ef5e4a',
                    backgroundColor: '#ef5e4a',
                    fill: false,
                    tension: 0.4,
                    yAxisID: 'y-μg/m3',
                },
                {
                    label: 'PM10 (μg/m³)',
                    data: data.pm10subindexData,
                    borderColor: '#fb9e3e',
                    backgroundColor: '#fb9e3e',
                    fill: false,
                    tension: 0.4,
                    yAxisID: 'y-μg/m3',
                },
                {
                    label: 'CO (ppm)',
                    data: data.cosubindexData,
                    borderColor: '#4BC0C0',
                    backgroundColor: '#4BC0C0',
                    fill: false,
                    tension: 0.4,
                    yAxisID: 'y-right-CO',
                },
                {
                    label: 'O₃ (ppm)',
                    data: data.o3subindexData,
                    borderColor: '#D67BA8',
                    backgroundColor: '#D67BA8',
                    fill: false,
                    tension: 0.4,
                    yAxisID: 'y-right-O3',
                },
                {
                    label: 'O₃ 8hr (ppm)',
                    data: data.o38subindexData,
                    borderColor: '#C0B558',
                    backgroundColor: '#C0B558',
                    fill: false,
                    tension: 0.4,
                    yAxisID: 'y-right-O3',
                },
                {
                    label: 'NO₂ (ppb)',
                    data: data.no2subindexData,
                    borderColor: '#9966FF',
                    backgroundColor: '#9966FF',
                    fill: false,
                    tension: 0.4,
                    yAxisID: 'y-ppb',
                },
                {
                    label: 'SO₂ (ppb)',
                    data: data.so2subindexData,
                    borderColor: '#36A2EB',
                    backgroundColor: '#36A2EB',
                    fill: false,
                    tension: 0.4,
                    yAxisID: 'y-ppb',
                },
                {
                    label: 'AQI 指標',
                    data: data.aqiData,
                    borderColor: '#08abae',
                    backgroundColor: '#ceeeef',
                    fill: true,
                    tension: 0.4,
                    yAxisID: 'y-aqi'
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    mode: 'nearest',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            const label = context.dataset.label || '';
                            const value = context.formattedValue;
                            return `${label}: ${value}`;
                        },
                        labelColor: (tooltipItem) => {
                            return {
                                borderColor: tooltipItem.dataset.borderColor,
                                backgroundColor: tooltipItem.dataset.borderColor,
                            };
                        }
                    }
                },
                customHighlightAxis: {} // 啟用 plugin
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: '日期',
                        font: {
                            weight: 'bold',
                            size: 14,
                        }
                    }
                },
                'y-aqi': {
                    type: 'linear',
                    position: 'left',
                    title: {
                        display: true,
                        text: 'AQI',
                        color: '#888' ,
                        font: {
                            weight: 'regular',
                            size: 14,
                        }
                    },
                    beginAtZero: true,
                    min: 0, 
                    max: 500, 
                    ticks: { 
                        color: '#888',
                        font: {
                            weight: 'regular',
                            size: 14,
                        }
                    },
                    grid: { drawOnChartArea: false }
                },
                'y-μg/m3': {
                    type: 'linear',
                    position: 'left',
                    title: {
                        display: true,
                        text: '濃度 (μg/m³)',
                        color: '#888',
                        font: {
                            weight: 'regular',
                            size: 14,
                        }
                    },
                    beginAtZero: true,
                    min: 0, 
                    max: 200,
                    ticks: { 
                        color: '#888',
                        font: {
                            weight: 'regular',
                            size: 14,
                        } 
                    },
                    grid: { drawOnChartArea: false }
                },
                'y-ppb': {
                    type: 'linear',
                    position: 'left',
                    title: {
                        display: true,
                        text: '濃度 (ppb)',
                        color: '#888',
                        font: {
                            weight: 'regular',
                            size: 14,
                        }
                    },
                    beginAtZero: true,
                    min: 0, 
                    max: 100, 
                    offset: true,
                    ticks: { 
                        color: '#888',
                        font: {
                            weight: 'regular',
                            size: 14,
                        }
                    },
                    grid: { drawOnChartArea: false }
                },
                'y-right-O3': {
                    type: 'linear',
                    position: 'right',
                    title: {
                        display: true,
                        text: '濃度 (ppm)',
                        color: '#888',
                        font: {
                            weight: 'regular',
                            size: 14,
                        }
                    },
                    beginAtZero: true,
                    min: 0, 
                    max: 150, 
                    ticks: { 
                        color: '#888',
                        font: {
                            weight: 'regular',
                            size: 14,
                        }
                    },
                    grid: { drawOnChartArea: false }
                },
                'y-right-CO': {
                    type: 'linear',
                    position: 'right',
                    title: {
                        display: true,
                        text: '濃度 (ppm)',
                        color: '#888',
                        font: {
                            weight: 'regular',
                            size: 14,
                        } 
                    },
                    beginAtZero: true,
                    min: 0, 
                    max: 10, 
                    ticks: { 
                        color: '#888',
                        font: {
                            weight: 'regular',
                            size: 14,
                        } 
                    },
                    grid: { drawOnChartArea: false }
                }
            }
        }
    });
}

