import './chartPopup.css'

export default {
  guid: function () {
    /**
     * @return {string}
     */
    function S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16)
        .substring(1);
    }

    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-"
      + S4() + S4() + S4());
  },
  echartsLayer(anchors, chartOpts, pWidth, pHeight) {
    let layerGroup = L.layerGroup();
    layerGroup.chartOpts = {};
    layerGroup.charts = {};
    let len = anchors.length;
    for (let i = 0; i < len; i++) {
      let feat = anchors[i];
      if (feat.geometry.type !== 'Point') {
        return;
      }
      feat.id = this.guid();
      let latLng = L.latLng(feat.geometry.coordinates[1], feat.geometry.coordinates[0]);
      let marker_pie = L.circleMarker(latLng, {
        id: feat.id,
        opacity: 0,
        fillOpacity: 0
      }).bindPopup('<div class="pie-box cht_' + feat.id + '"></div>', {
        id: feat.id,
        minWidth: pWidth,
        className: 'cus-popup',
        autoClose: false,
        offset: [0, 60],
        closeButton: false,
        closeOnClick: false,
        autoPan: false
      });
      layerGroup.chartOpts[feat.id] = chartOpts[i];
      marker_pie.on('popupopen', (e) => {
        let box = document.querySelector('.cht_' + e.popup.options.id);
        let wrapper = box.parentElement.parentElement;
        wrapper.classList.add("dis-popup");
        box.style.height = pHeight + "px";
        box.style.width = pWidth + "px";
        wrapper.parentElement.childNodes[1].classList.add("dis-popup");
        if (!layerGroup.charts.hasOwnProperty(e.popup.options.id)) {
          layerGroup.charts[e.popup.options.id] = echarts.init(document.querySelector('.cht_' + e.popup.options.id));
          layerGroup.charts[e.popup.options.id].setOption(layerGroup.chartOpts[e.popup.options.id]);
        }
      })
      layerGroup.addLayer(marker_pie);
    }
    layerGroup.on('add', () => {
      layerGroup.eachLayer((layer) => layer.togglePopup())
    })
    layerGroup.updateChartOption = function (id, opt) {
      layerGroup.charts[id].setOption(opt);
      layerGroup.chartOpts[id] = opt;
    }
    return layerGroup;
  },
  echartsPopup(layer, chartOpt, pWidth, pHeight) {
    layer.chartId = this.guid();
    layer.bindPopup('<div class="pie-box chtP_' + layer.chartId + '"></div>', {
      id: layer.chartId,
      minWidth: pWidth,
      autoClose: false,
      closeButton: true,
      closeOnClick: false,
      autoPan: false
    });
    layer.chartOpt = chartOpt;
    layer.on('popupopen', (e) => {
      let box = document.querySelector('.chtP_' + e.popup.options.id);
      box.style.height = pHeight + "px";
      box.style.width = pWidth + "px";
      if (!layer.chart) {
        layer.chart = echarts.init(document.querySelector('.chtP_' + e.popup.options.id));
        layer.chart.setOption(layer.chartOpt);
      } else {
        layer.chart = echarts.init(document.querySelector('.chtP_' + e.popup.options.id));
        layer.chart.setOption(layer.chartOpt);
      }
    })
    layer.updateChartOption = function (opt) {
      if (!layer.chart) {
        layer.chart.setOption(layer.opt);
        layer.chartOpt = opt;
      }
    }
    return layer;
  }
}
