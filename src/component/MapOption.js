let options = {
  crs: L.CRS.EPSG3857,
  center: [0, 0],
  zoom: 0,
  boxZoom: true,
  doubleClickZoom: true,
  minZoom: 0,
  maxZoom: 18,
  layers: [],
  maxBounds: undefined,
  renderer: L.svg(),
  attributionControl: false,
  zoomControl: false,
  zoomAnimation: true,
  zoomAnimationThreshold: 4,
  fadeAnimation: true,
  markerZoomAnimation: true,
  transform3DLimit: 8388608, // Precision limit of a 32-bit float
  zoomSnap: 1,
  zoomDelta: 1,
  trackResize: true,
  maxBoundsViscosity: 0,
  closePopupOnClick: true
};

let MapOption = new Proxy(options, {
  get: function (target, key, receiver) {
    return Reflect.get(target, key, receiver);
  },
  set: function (target, p, value, receiver) {
    Reflect.set(target, p, value, receiver);
    return true;
  }
});
export default MapOption;
