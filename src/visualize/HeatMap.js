import * as mapv from 'mapv/build/mapv.min'

export default {
  defaultGridOpt: {
    fillStyle: 'rgba(55, 50, 250, 0.8)',
    shadowColor: 'rgba(255, 250, 50, 1)',
    shadowBlur: 10,
    size: 40,
    globalAlpha: 0.5,
    label: {
      show: true,
      fillStyle: 'white',
      shadowColor: 'yellow',
      font: '15px Arial',
      shadowBlur: 10
    },
    gradient: {
      0: "rgba(49, 54, 149, 0)",
      0.2: "rgba(69,117,180, 0.7)",
      0.3: "rgba(116,173,209, 0.7)",
      0.4: "rgba(171,217,233, 0.7)",
      0.5: "rgba(224,243,248, 0.7)",
      0.6: "rgba(254,224,144,0.7)",
      0.7: "rgba(253,174,97,0.7)",
      0.8: "rgba(244,109,67,0.8)",
      0.9: "rgba(215,48,39,0.8)",
      0.95: "rgba(165, 0, 38,0.8)"
    },
    draw: 'grid'
  },
  defaultHeatOpt: {
    size: 20,
    gradient: {
      0: "rgba(49, 54, 149, 0)",
      0.2: "rgba(69,117,180, 0.7)",
      0.3: "rgba(116,173,209, 0.7)",
      0.4: "rgba(171,217,233, 0.7)",
      0.5: "rgba(224,243,248, 0.7)",
      0.6: "rgba(254,224,144,0.7)",
      0.7: "rgba(253,174,97,0.7)",
      0.8: "rgba(244,109,67,0.8)",
      0.9: "rgba(215,48,39,0.8)",
      0.95: "rgba(165, 0, 38,0.8)"
    },
    draw: 'heatmap'
  },
  mapVHeatMapLayer: function (features, heatOptions, countField) {
    let _options = this.defaultHeatOpt;
    if (heatOptions) {
      _options = Object.assign(this.defaultHeatOpt, heatOptions);
    }
    _options.draw = 'heatmap';
    let len = features.length;
    let data_st = [];
    for (let i = 0; i < len; i++) {
      let feat = features[i];
      if (feat.geometry.type !== 'Point') {
        return;
      }
      data_st.push({
        geometry: {
          type: 'Point',
          coordinates: [feat.geometry.coordinates[0], feat.geometry.coordinates[1]]
        },
        count: countField ? feat.properties[countField] : 1
      });
    }
    let dataSet = new mapv.DataSet(data_st);
    return mapv.leafletMapLayer(dataSet, _options, {noWrap: true});
  },
  mapVGridHeatLayer: function (features, gridOptions, countField) {
    let _options = this.defaultGridOpt;
    if (gridOptions) {
      _options = Object.assign(this.defaultGridOpt, gridOptions);
    }
    _options.draw = 'grid';
    let len = features.length;
    let data_st = [];
    for (let i = 0; i < len; i++) {
      let feat = features[i];
      if (feat.geometry.type !== 'Point') {
        return;
      }
      data_st.push({
        geometry: {
          type: 'Point',
          coordinates: [feat.geometry.coordinates[0], feat.geometry.coordinates[1]]
        },
        count: countField ? feat.properties[countField] : 1
      });
    }
    let dataSet = new mapv.DataSet(data_st);
    return mapv.leafletMapLayer(dataSet, _options, {noWrap: true});
  },
  mapVHoneycombHeatLayer: function (features, gridOptions, countField) {
    let _options = this.defaultGridOpt;
    if (gridOptions) {
      _options = Object.assign(this.defaultGridOpt, gridOptions);
    }
    _options.draw = 'honeycomb';
    let len = features.length;
    let data_st = [];
    for (let i = 0; i < len; i++) {
      let feat = features[i];
      if (feat.geometry.type !== 'Point') {
        return;
      }
      data_st.push({
        geometry: {
          type: 'Point',
          coordinates: [feat.geometry.coordinates[0], feat.geometry.coordinates[1]]
        },
        count: countField ? feat.properties[countField] : 1
      });
    }
    let dataSet = new mapv.DataSet(data_st);
    return mapv.leafletMapLayer(dataSet, _options, {noWrap: true});
  }
}
