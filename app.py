from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from pydantic import BaseModel
import httpx
import requests

app = FastAPI()

WEBHOOK_URL = "https://discord.com/api/webhooks/1366080384927793243/X9l12ZV5rpuJfiTKhdzT4JDw9VlMkkluotj70-FmQh2xIG7QPmew8U1LtuOikecg00MY"
API_URL = "https://data.moenv.gov.tw/api/v2/aqx_p_432"
API_KEY = "9e565f9a-84dd-4e79-9097-d403cae1ea75"

class SiteSelection(BaseModel):
    county: str
    sitename: str

async def send_discord_message(data: dict):
    aqi = data.get("aqi", "N/A")
    aqi_val = int(aqi) if aqi.isdigit() else None

    if aqi_val is None:
        remark = "無資料"
        color = 0x808080  # 灰色
    elif aqi_val <= 50:
        remark = "👍 空氣品質良好，適合戶外活動!"
        color = 0x008000  # 綠色
    elif aqi_val <= 100:
        remark = "👌 普通，長時間戶外要注意體感。"
        color = 0xFFFF00  # 黃色
    elif aqi_val <= 150:
        remark = "⚠️ 對敏感族群不佳，請減少戶外活動。"
        color = 0xFFA500  # 橘色
    elif aqi_val <= 200:
        remark = "⚠️ 對所有族群不健康，建議減少外出。"
        color = 0xFF0000  # 紅色
    elif aqi_val <= 300:
        remark = "🚨 非常不健康，建議避免外出。"
        color = 0x800080  # 紫色
    elif aqi_val <= 400:
        remark = "☠️ 危害健康，應留在室內並採取防護措施。"
        color = 0xA52A2A  # 棕色
    else:
        remark = "❌ 空氣品質極差，請嚴格避免外出並戴口罩。"
        color = 0xA52A2A  # 棕色



    city = f"{data['county']} / {data['sitename']}"

    embed = {
        "title": "🌆 空氣品質快報",
        "description": f"{city} 當前空氣品質數據如下，請參考健康建議並適當調整戶外活動。",
        "url": "https://www.youtube.com/watch?v=MwOC8p-O2cA",  # 可換成實際數據來源
        "color": color,
        "timestamp": data.get("publishtime_iso", None),  

        "thumbnail": {
            "url": ""  
        },

        "fields": [
            {"name": " ", "value": " ", "inline": False},
            {"name": " ", "value": " ", "inline": False},
            {"name": "地區", "value": city, "inline": True},
            {"name": "空氣品質指標", "value": data.get("aqi", "N/A"), "inline": True},
            {"name": "狀態", "value": data.get("status", "N/A"), "inline": True},
            {"name": " ", "value": " ", "inline": False},
            {"name": "PM2.5", "value": data.get("pm2.5", "N/A"), "inline": True},
            {"name": "PM10", "value": data.get("pm10", "N/A"), "inline": True},
            {"name": "O₃", "value": data.get("o3", "N/A"), "inline": True},
            {"name": " ", "value": " ", "inline": False},
            {"name": "CO", "value": data.get("co", "N/A"), "inline": True},
            {"name": "SO₂", "value": data.get("so2", "N/A"), "inline": True},
            {"name": "NO₂", "value": data.get("no2", "N/A"), "inline": True},
            {"name": " ", "value": " ", "inline": False},
            {"name": "風速 (m/s)", "value": data.get("wind_speed", "N/A"), "inline": True},
            {"name": "風向 (°)", "value": data.get("wind_direc", "N/A"), "inline": True},
            {"name": " ", "value": " ", "inline": False},
            {"name": "更新時間", "value": data.get("publishtime", "N/A"), "inline": False},
            {"name": "📝 建議活動", "value": remark, "inline": False},
        ],



        "footer": {
            "text": "本製作由彭大帥團隊嘔心瀝血協助開發中",
            "icon_url": ""  # 可換成團隊 logo
        },
    }



    payload = {
        "username": "空氣小幫手 🌤️",
        "content": None,
        "embeds": [embed]
    }



    print(f"發送到 Discord 的資料：{payload}")
    response = requests.post(WEBHOOK_URL, json=payload, timeout=10.0)
    response.raise_for_status()

@app.post("/send_message")
async def send_message(data: SiteSelection):
    try:
        async with httpx.AsyncClient(verify=False) as client:
            response = await client.get(
                API_URL,
                params={
                    "api_key": API_KEY,
                    "format": "JSON",
                    "limit": 1000,
                    "sort": "ImportDate desc"
                }
            )
            response.raise_for_status()
            all_data = response.json()

        match = next((item for item in all_data["records"]
                    if item["county"] == data.county and item["sitename"] == data.sitename), None)

        if not match:
            raise HTTPException(status_code=404, detail="找不到該測站資料")

        await send_discord_message(match)

        return JSONResponse({"message": f"成功發送：{data.county}/{data.sitename} AQI {match.get('aqi', 'N/A')}"})


    except Exception as e:
        raise HTTPException(status_code=500, detail=f"錯誤: {e}")

@app.get("/stations")
async def get_stations():
    try:
        async with httpx.AsyncClient(verify=False) as client:
            response = await client.get(
                API_URL,
                params={
                    "api_key": API_KEY,
                    "format": "JSON",
                    "limit": 1000,
                    "sort": "ImportDate desc"
                }
            )
            response.raise_for_status()
            all_data = response.json()

        if "records" not in all_data:
            raise HTTPException(status_code=500, detail="API 回應不包含 records")

        stations = [{"county": item["county"], "sitename": item["sitename"]}
                    for item in all_data["records"]]

        return JSONResponse({"records": stations})
    except Exception as e:
        print(f"錯誤: {e}")
        raise HTTPException(status_code=500, detail=f"錯誤: {e}")

@app.get("/", response_class=HTMLResponse)
async def root():
    with open("test-index.html", encoding="utf-8") as f:
        return f.read()
