import HeatMap from "../visualize/HeatMap";
import {FlowField} from "../visualize/FlowField";
import PointCluster from "../visualize/PointCluster";
import ClassicRender from "../visualize/ClassicRender";

export default {
  ...HeatMap,
  FlowField,
  ...PointCluster,
  ...ClassicRender
}


