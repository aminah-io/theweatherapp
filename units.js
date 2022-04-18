exports.getUnit = function (units) {
  let unitName;
    if (units === 'metric') {
      unitName = 'Celsius';
    } else {
      unitName = 'Farenheit';
    }
    return unitName;
}
