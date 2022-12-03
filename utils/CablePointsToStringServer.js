module.exports = {
  convertToString(points) {
    let text = '';
    let subItem = '';
    points.map((item) => {
      subItem = item.lat.toString() + ',' + item.lng.toString() + ' ';
      text = text + subItem;
    });
    return text;
  },
  convertToStringPoint(point) {
    if (point) return point.lat.toString() + ',' + point.lng.toString();
    else return 0;
  },
};
