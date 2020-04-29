import HeatMap from "../visualize/HeatMap";
import {FlowField} from "../visualize/FlowField";
import PointCluster from "../visualize/PointCluster";
import ClassicRender from "../visualize/ClassicRender";
import ChartRender from "../visualize/ChartRender";
import CanvasHPLayer from "../visualize/CanvasHPLayer";
import MarkAnimated from "../visualize/MarkAnimated";
import TrackLine from "../visualize/TrackLine";

export default {
  ...HeatMap,
  FlowField,
  ...PointCluster,
  ...ClassicRender,
  ...ChartRender,
  ...CanvasHPLayer,
  ...MarkAnimated,
  ...TrackLine
}


