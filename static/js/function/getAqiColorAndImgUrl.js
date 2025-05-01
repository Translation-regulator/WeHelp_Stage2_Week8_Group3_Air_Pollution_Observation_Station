export function getAqiColor(AQIScore) {
  if (AQIScore <= 50) {
    return "airData__stationDataHead--lightGreen";
  } else if (51 <= AQIScore <= 100) {
    return "airData__stationDataHead--darkGreen";
  } else if (101 <= AQIScore <= 150) {
    return "airData__stationDataHead--lightYellow";
  } else if (151 <= AQIScore <= 200) {
    return "airData__stationDataHead--darkYellow";
  } else if (201 <= AQIScore <= 300) {
    return "airData__stationDataHead--lightRed";
  } else {
    return "airData__stationDataHead--darkRed";
  }
}

export function getAqiImgUrl(AQIScore) {
  if (AQIScore <= 50) {
    return "../static/image/good.png";
  } else if (51 <= AQIScore <= 100) {
    return "../static/image/soso.png";
  } else if (101 <= AQIScore <= 300) {
    return "../static/image/bad.png";
  } else {
    return "../static/image/popo.png";
  }
}
