export function getChart(){
    getAQIData();
}

async function getAQIData() {
    const url = 'https://data.moenv.gov.tw/api/v2/aqx_p_434?api_key=b68831b5-fc06-4223-879c-9d92b9d4d293';
    try {
        const response = await fetch(url);
        const result = await response.json();

        // 取出資料陣列
        const records = result.records;
        console.log(records)

        // 擷取縣市與 PM2.5 資料
        const labels = [];
        const pm25Data = [];

        records.forEach(item => {
        if (item.county && item.pm2_5) {
            labels.push(`${item.county}-${item.site}`); // 縣市-測站
            pm25Data.push(Number(item.pm2_5));
        }
        });

    } catch (error) {
        console.error('抓取 AQI 資料失敗:', error);
    }
    }


function renderChart(){
    // 繪製圖表
    const ctx = document.getElementById('aqiChart').getContext('2d');
    new Chart(ctx, {
    type: 'bar',
    data: {
        labels: labels,
        datasets: [{
        label: 'PM2.5 (μg/m³)',
        data: pm25Data,
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        scales: {
        y: {
            beginAtZero: true,
            title: {
            display: true,
            text: 'PM2.5 濃度 (μg/m³)'
            }
        },
        x: {
            ticks: {
            autoSkip: true,
            maxRotation: 90,
            minRotation: 45
            }
        }
        }
    }
    });
}