import * as mapv from 'mapv'
import '../plugins/choropleth/choropleth'

export default {
  cityCenter: mapv.utilCityCenter,
  defaultClassicOpt: {
    draw: 'intensity',
    max: 100, // 最大阈值
    min: 0, // 最小阈值
    gradient: { // 显示的颜色渐变范围$
      '0': 'blue',
      '0.6': 'cyan',
      '0.7': 'lime',
      '0.8': 'yellow',
      '1.0': 'red'
    }
  },
  defaultSymbolOpt: {
    draw: 'bubble',
    max: 100, // 数值最大值范围
    maxSize: 10, // 显示的圆最大半径大小
  },
  basicClassicOpt: {
    valueProperty: 'incidents', // which property in the features to use
    scale: ['white', 'red'], // chroma.js scale - include as many as you like
    steps: 5, // number of breaks or steps in range
    mode: 'q', // q for quantile, e for equidistant, k for k-means
    style: {
      color: 'blue',
      strokeColor: 'blue',// border color
      weight: 2,
      fillOpacity: 0.8
    }
  },
  mapVClassicSymbolLayer: function (geoJson, weightProperty, opt) {
    let _options = this.defaultSymbolOpt;
    if (opt) {
      _options = Object.assign(this.defaultSymbolOpt, opt);
    }
    _options.draw = 'bubble';
    let len = geoJson.length;
    let data_st = [];
    for (let i = 0; i < len; i++) {
      let feat = geoJson[i];
      if (feat.geometry.type !== 'Point') {
        return;
      }
      data_st.push({
        geometry: {
          type: 'Point',
          coordinates: [feat.geometry.coordinates[0], feat.geometry.coordinates[1]]
        },
        count: weightProperty ? feat.properties[weightProperty] : 1
      });
    }
    let dataSet = new mapv.DataSet(data_st);
    return mapv.leafletMapLayer(dataSet, _options);
  },
  mapVClassifyColorLayer: function (geoJson, weightProperty, opt) {
    let _options = this.defaultClassicOpt;
    if (opt) {
      _options = Object.assign(this.defaultClassicOpt, opt);
    }
    _options.draw = 'intensity';
    let dataSetTmp = mapv.geojson.getDataSet({'type': 'FeatureCollection', 'features': geoJson});
    let data = dataSetTmp.get({
      filter: function (item) {
        item.count = item.hasOwnProperty(weightProperty) ? item[weightProperty] : 1;
        return true;
      }
    });
    let dataSet = new mapv.DataSet(data);
    return mapv.leafletMapLayer(dataSet, _options);
  },
  basicClassifyColorLayer: function (geoJson, weightProperty, opt) {
    let _options = this.basicClassicOpt;
    if (opt) {
      _options = Object.assign(this.basicClassicOpt, opt);
    }
    let data = {'type': 'FeatureCollection', 'features': geoJson};
    return L.choropleth(data, _options);
  }
}
