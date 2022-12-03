function isFloat(n) {
  return n != '' && !isNaN(n) && Math.round(n) != n;
}

module.exports = {
  getCablePointsFromString(str) {
    const numArr = [];
    if (str && str.length > 0) {
      const strArr = str.split(' ');
      strArr.map((item) => {
        let [lat, lng] = item.split(',');
        let point = { lat: parseFloat(lat), lng: parseFloat(lng) };
        if (isFloat(point.lat) && isFloat(point.lng)) {
          numArr.push(point);
        }
      });
    }
    return numArr;
  },
};
