import * as mapv from 'mapv/build/mapv.min'

export default {
  defaultPointOpt: {
    size: 3,
    context: '2d',
    draw: 'simple'
  },
  canvasHpLayer: function (features, opt, colorProperty, colorMap) {
    let _options = this.defaultPointOpt;
    if (opt) {
      _options = Object.assign(this.defaultPointOpt, opt);
    }
    _options.draw = 'simple';
    let data = [];
    features.forEach(function (feat) {
      let item = {
        geometry: feat.geometry,
      }
      if (colorProperty && colorMap) {
        let val = feat.properties[colorProperty];
        item.fillStyle = colorMap[val]
      } else {
        item.fillStyle = _options.fillStyle ? _options.fillStyle : 'rgba(34,255,187, 0.6)'
      }
      data.push(item)
    })
    let dataSet = new mapv.DataSet(data);
    return mapv.leafletMapLayer(dataSet, _options);
  }
}
