import MapOption from '../component/MapOption';
import {rectangle} from '../component/TRectangle';
import {circle} from '../component/TCircle';
import {polyline} from '../component/TPolyline';
import {circleMarker} from '../component/TCircleMarker';
import {polygon} from '../component/TPolygon';
import controls from './ControlManager';
import {icon} from '../component/TIcon';
import {LayerTree} from '../controls/LayerTree';

let T = new Proxy({
  map: null,
  rectangle: rectangle,
  circle: circle,
  circleMarker: circleMarker,
  marker: null,
  polyline: polyline,
  polygon: polygon,
  controls: controls,
  layerTree: LayerTree,
  icon: icon
}, {});
T.createMap = function (dom) {
  T.map = L.map(dom, MapOption);
  T.controls.init();
  return T.map;
};
T.marker = function (options) {

};

export default T;


