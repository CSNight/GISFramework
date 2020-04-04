import '../plugins/esri/esri-leaflet-geocoder.css';

let searcher = {
  show: true,
  activate: false,
  opt: {
    label: '',
    map_url: '',
    layers: [],
    fields: []
  }
};
let AddressControl = function (opt) {
  let options = Object.assign(searcher.opt, opt);
  let Tz = L.esri.Geocoding.geosearch({
    providers: [
      L.esri.Geocoding.mapServiceProvider({
        label: options.label,
        url: options.map_url,
        layers: options.layers,
        searchFields: options.fields
      })
    ]
  });
  Tz.__proto__.show = function () {
    this.$options.show = true;
  };
  Tz.__proto__.hide = function () {
    this.$options.show = false;
  };
  Tz.$options = new Proxy(Object.assign({}, searcher), {
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
export {AddressControl};
