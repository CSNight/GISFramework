import {CusTileLayer} from '../component/TTileLayer'
import MapOption from '../component/MapOption';
import {rectangle} from '../component/TRectangle';
import {circle} from '../component/TCircle';
import {polyline} from '../component/TPolyline';
import {circleMarker} from '../component/TCircleMarker';
import {polygon} from '../component/TPolygon';
import controls from './ControlManager';
import {icon} from '../component/TIcon';
import {LayerTree} from '../controls/LayerTree';
import EventBus from "./EventBus";
import clientAnalysis from "../analysis/clients/clientAnalysis";
import sma from '../analysis/server/sma';
import esria from '../analysis/server/esria';

let T = new Proxy({
  map: null,
  rectangle: rectangle,
  circle: circle,
  circleMarker: circleMarker,
  marker: null,
  polyline: polyline,
  polygon: polygon,
  controls: controls,
  LayerTree: LayerTree,
  icon: icon,
  EvBus: EventBus,
  cusTileLayer: CusTileLayer,
  turf: clientAnalysis,
  sma: sma,
  esria: esria
}, {});
T.createMap = function (dom, opt) {
  let options = {};
  if (!opt) {
    options = MapOption;
  }
  options = Object.assign(MapOption, opt);
  T.map = L.map(dom, options);
  T.controls.init();
  T.layerTree = T.LayerTree();
  T.layerTree.init();
  return T.map;
};
export default T;


