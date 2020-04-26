import './chartPopup.css'
import cloneDeep from 'lodash/cloneDeep'

export default {
  defaultPieChartOpt: {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(50,50,50,1)'
    },
    series: [{
      hoverAnimation: true,
      name: '测试',
      type: 'pie',
      radius: '65%',
      label: {
        show: false
      },
      center: ['50%', '50%'],
      data: []
    }]
  },
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
  echartsLayer(anchors, chartOpt, data, pWidth, pHeight) {
    let layerGroup = L.layerGroup();
    layerGroup.chartOpts = {};
    layerGroup.charts = {};
    let _options = this.defaultPieChartOpt;
    if (chartOpt) {
      _options = Object.assign(this.defaultPieChartOpt, chartOpt);
    }

    let len = anchors.length;
    for (let i = 0; i < len; i++) {
      let feat = anchors[i];
      if (feat.geometry.type !== 'Point') {
        return;
      }
      feat.id = this.guid();
      let latLng = L.latLng(feat.geometry.coordinates[1], feat.geometry.coordinates[0]);
      let marker_pie = L.circleMarker(latLng, {
        opacity: 0,
        fillOpacity: 0
      }).bindPopup('<div class="pie-box ss_' + feat.id + '"></div>', {
        id: feat.id,
        minWidth: pWidth,
        className: 'cus-popup',
        autoClose: false,
        offset: [0, 60],
        closeButton: false,
        closeOnClick: false,
        autoPan: false
      });
      let featOpt = cloneDeep(_options);
      featOpt.series[0].data = data[i];
      layerGroup.chartOpts[feat.id] = featOpt;
      marker_pie.on('popupopen', (e) => {
        let box = document.querySelector('.ss_' + e.popup.options.id);
        let wrapper = box.parentElement.parentElement;
        wrapper.classList.add("dis-popup");
        box.style.height = pHeight + "px";
        box.style.width = pWidth + "px";
        wrapper.parentElement.childNodes[1].classList.add("dis-popup");
        if (!layerGroup.charts.hasOwnProperty(e.popup.options.id)) {
          layerGroup.charts[e.popup.options.id] = echarts.init(document.querySelector('.ss_' + e.popup.options.id));
          layerGroup.charts[e.popup.options.id].setOption(layerGroup.chartOpts[e.popup.options.id]);
        }
      })
      layerGroup.addLayer(marker_pie);
    }
    layerGroup.on('add', () => {

      layerGroup.eachLayer((layer) => layer.togglePopup())
    })
    return layerGroup;
  }
}
