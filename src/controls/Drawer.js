import {FeatureGroup} from '../leaflet/leaflet-src.esm';

let drawer = {
  show: true,
  activate: false,
  local: {
    draw: {
      toolbar: {
        // #TODO: this should be reorganized where actions are nested in actions
        // ex: actions.undo  or actions.cancel
        actions: {
          title: 'Cancel drawing',
          text: 'Cancel'
        },
        finish: {
          title: 'Finish drawing',
          text: 'Finish'
        },
        undo: {
          title: 'Delete last point drawn',
          text: 'Delete last point'
        },
        buttons: {
          polyline: '画polyline',
          polygon: '画polygon',
          rectangle: '画rectangle',
          circle: '画circle',
          marker: '画marker',
          circlemarker: '画circlemarker'
        }
      },
      handlers: {
        circle: {
          tooltip: {
            start: 'Click and drag to draw circle.'
          },
          radius: 'Radius'
        },
        circlemarker: {
          tooltip: {
            start: 'Click map to place circle marker.'
          }
        },
        marker: {
          tooltip: {
            start: '点击开始画点'
          }
        },
        polygon: {
          tooltip: {
            start: '点击开始采集坐标',
            cont: '点击继续采集坐标',
            end: '点击第一节点结束采集坐标'
          }
        },
        polyline: {
          error: '<strong>错误:</strong> 图形节点不能相交',
          tooltip: {
            start: '点击开始画线',
            cont: '点击继续画线',
            end: '点击最后节点结束绘制'
          }
        },
        rectangle: {
          tooltip: {
            start: 'Click and drag to draw rectangle.'
          }
        },
        simpleshape: {
          tooltip: {
            end: 'Release mouse to finish drawing.'
          }
        }
      }
    },
    edit: {
      toolbar: {
        actions: {
          save: {
            title: '保存修改',
            text: '保存'
          },
          cancel: {
            title: '取消编辑，放弃所有更改',
            text: '取消'
          },
          clearAll: {
            title: '清除所有要素',
            text: '清除所有要素'
          }
        },
        buttons: {
          edit: '编辑要素',
          editDisabled: '没有可编辑的要素',
          remove: '删除要素',
          removeDisabled: '没有可删除的要素'
        }
      },
      handlers: {
        edit: {
          tooltip: {
            text: '拖动控制点或要素点进行修改',
            subtext: '点击取消按钮放弃修改'
          }
        },
        remove: {
          tooltip: {
            text: '选中要素删除'
          }
        }
      }
    }
  },
  opt: {},
  targetLayer: new FeatureGroup()
};
