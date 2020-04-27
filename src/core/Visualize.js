import HeatMap from "../visualize/HeatMap";
import {FlowField} from "../visualize/FlowField";
import PointCluster from "../visualize/PointCluster";
import ClassicRender from "../visualize/ClassicRender";
import ChartRender from "../visualize/ChartRender";
import CanvasHPLayer from "../visualize/CanvasHPLayer";

export default {
  ...HeatMap,
  FlowField,
  ...PointCluster,
  ...ClassicRender,
  ...ChartRender,
  ...CanvasHPLayer
}


