import '../plugins/leaflet-styleeditor/css/Leaflet.StyleEditor.min.css';
import '../plugins/leaflet-styleeditor/javascript/Leaflet.StyleEditor.min';


let styler = {
  show: true,
  activate: false,
  opt: {
    position: 'topright',
    colorRamp: ['#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#34495e', '#16a085', '#27ae60', '#2980b9', '#8e44ad',
      '#2c3e50', '#f1c40f', '#e67e22', '#e74c3c', '#ecf0f1', '#95a5a6', '#f39c12', '#d35400', '#c0392b',
      '#bdc3c7', '#7f8c8d'],
    defaultColor: null,
    markerType: L.StyleEditor.marker.DefaultMarker,
    markers: null,
    defaultMarkerIcon: null,
    defaultMarkerColor: null,
    geometryForm: L.StyleEditor.forms.GeometryForm,
    ignoreLayerTypes: [],
    forms: {},
    openOnLeafletDraw: true,
    openOnLeafletEditable: true,
    showTooltip: true,
    strings: {
      cancel: '取消',
      cancelTitle: '取消样式修改',
      tooltip: '点击选中要素进行修改',
      tooltipNext: '选中另一个想要更改样式的要素'
    },
    useGrouping: false,
    styleEditorEventPrefix: 'styleeditor:',
  }
};
let styleEditor = function (opt) {
  let options = Object.assign(styler.opt, opt);
  let Tz = L.control.styleEditor(options);
  Tz.__proto__.show = function () {
    this.$options.show = true;
  };
  Tz.__proto__.hide = function () {
    this.$options.show = false;
  };
  Tz.$options = new Proxy(Object.assign({}, styler), {
    set: function (target, p, value, receiver) {
      Reflect.set(target, p, value, receiver);
      if (p === 'show') {
        if (value) {
          Tz.$options.activate = true;
          Tz._container.style.display = 'block';
        } else {
          Tz.$options.activate = false;
          Tz._container.style.display = 'none';
        }
      }
      return true;
    }
  });
  return Tz;
};
export {styleEditor};
