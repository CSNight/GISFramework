import * as mapv from 'mapv'

export default {
  defaultTimeOpt: {
    fillStyle: 'rgba(255, 250, 250, 0.5)',
    zIndex: 200,
    size: 2.5,
    animation: {
      type: 'time',
      stepsRange: {
        start: 0,
        end: 50
      },
      trails: 10,
      duration: 2,
    },
    draw: 'simple'
  },
  defaultLineOpt: {
    strokeStyle: 'rgba(255, 250, 50, 0.8)',
    shadowColor: 'rgba(255, 250, 50, 1)',
    shadowBlur: 20,
    lineWidth: 2,
    zIndex: 100,
    draw: 'simple'
  },
  defaultTextOpt: {
    draw: 'text',
    font: '14px Arial',
    fillStyle: 'white',
    shadowColor: 'yellow',
    shadowBlue: 10,
    zIndex: 11,
    shadowBlur: 10
  },
  defaultPointOpt: {
    fillStyle: 'rgba(254,175,3,0.7)',
    shadowColor: 'rgba(55, 50, 250, 0.5)',
    shadowBlur: 10,
    size: 5,
    zIndex: 10,
    draw: 'simple'
  },
  defaultStrengthOpt: {
    strokeStyle: 'rgba(50, 50, 255, 0.8)',
    lineWidth: 0.05,
    globalCompositeOperation: 'lighter',
    draw: 'simple'
  },
  trackLayer: function (data, options) {
    let _options = {
      line: this.defaultLineOpt,
      point: this.defaultPointOpt,
      time: this.defaultTimeOpt,
      text: this.defaultTextOpt
    };
    if (options) {
      _options = Object.assign(_options, options);
    }
    let lineData = [];
    let pointData = [];
    let timeData = [];
    let textData = [];
    for (let i = 0; i < data.length; i++) {
      let fromPoint = data[i].from;
      let toPoint = data[i].to;
      let count = data[i].count;
      let fromName = data[i].fromName;
      let toName = data[i].toName;
      pointData.push({geometry: fromPoint.geometry});
      pointData.push({geometry: toPoint.geometry});
      textData.push({
        geometry: fromPoint.geometry,
        text: fromName
      });
      textData.push({
        geometry: toPoint.geometry,
        text: toName
      })
      let fromCenter = {lat: fromPoint.geometry.coordinates[1], lng: fromPoint.geometry.coordinates[0]};
      let toCenter = {lat: toPoint.geometry.coordinates[1], lng: toPoint.geometry.coordinates[0]}
      let curve = mapv.utilCurve.getPoints([fromCenter, toCenter]);
      for (let j = 0; j < curve.length; j++) {
        timeData.push({
          geometry: {
            type: 'Point',
            coordinates: curve[j]
          },
          count: 1,
          time: j
        });
      }
      lineData.push({
        geometry: {
          type: 'LineString',
          coordinates: curve
        },
        count: count
      });
    }
    let textDataSet = new mapv.DataSet(textData);
    let textMapvLayer = mapv.leafletMapLayer(textDataSet, _options.text);
    let lineDataSet = new mapv.DataSet(lineData);
    let lineLayer = mapv.leafletMapLayer(lineDataSet, _options.line);
    let pointDataSet = new mapv.DataSet(pointData);
    let pointLayer = mapv.leafletMapLayer(pointDataSet, _options.point);
    let timeDataSet = new mapv.DataSet(timeData);
    let timeMapvLayer = mapv.leafletMapLayer(timeDataSet, _options.time);
    let layerGroup = [];
    layerGroup.push(textMapvLayer);
    layerGroup.push(lineLayer);
    layerGroup.push(pointLayer);
    layerGroup.push(timeMapvLayer);
    return layerGroup;
  },
  strengthLine: function (dataStr, option) {
    let _options = this.defaultStrengthOpt;
    if (option) {
      _options = Object.assign(_options, option);
    }
    let dataSet = mapv.csv.getDataSet(dataStr);

    return mapv.leafletMapLayer(dataSet, _options);
  }
}
