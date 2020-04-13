let examples = [
  {
    title: '地图',
    index: 0,
    name: 'mapTile',
    icon: 'layui-icon-website',
    children: [
      {
        name: '加载地图',
        path: 'createMap'
      }, {
        name: '瓦片地图API',
        path: 'tileLayers'
      }]
  },
  {
    title: '地图控件',
    name: 'mapTool',
    index: 1,
    icon: 'layui-icon-util',
    children: [
      {
        name: '地图工具',
        path: 'mapTools'
      }, {
        name: '绘制工具',
        path: 'mapDraw'
      }, {
        name: '地图格网',
        path: 'mapGrid'
      }, {
        name: '地图切换控件',
        path: 'mapSwitch'
      }, {
        name: '图层目录树',
        path: 'layerTree'
      }]
  },
  {
    title: '客户端分析',
    index: 2,
    name: 'turf',
    icon: 'layui-icon-senior',
    children: [
      {
        name: '客户端分析工具',
        path: 'clientDistance'
      }, {
        name: '客户端缓冲分析',
        path: 'clientBuffer'
      }, {
        name: '客户端缓冲查询',
        path: 'clientBufferSearch'
      }, {
        name: '客户端多边形查询',
        path: 'clientGeoSearch'
      }, {
        name: '客户端相交分析',
        path: 'clientIntersect'
      }, {
        name: '客户端异或分析',
        path: 'clientDifference'
      }, {
        name: '客户端多边形融合',
        path: 'clientUnion'
      }, {
        name: '客户端计算凹凸包',
        path: 'clientEnvelope'
      }, {
        name: '客户端TIN三角网',
        path: 'clientTIN'
      }, {
        name: '客户端生成等值线',
        path: 'clientIsoLine'
      }, {
        name: '客户端插值分析',
        path: 'clientIsoIntersect'
      }]
  },
  {
    title: '超图服务端分析',
    index: 3,
    name: 'SuperMap', icon: 'layui-icon-upload-drag',
    children: [
      {
        name: '超图几何查询服务',
        path: 'smGeoSearch'
      },
      {
        name: '超图SQL查询服务',
        path: 'smSQLSearch'
      },
      {
        name: '超图缓冲区查询服务',
        path: 'smBufferSearch'
      },
      {
        name: '超图数据集缓冲分析',
        path: 'smBufferDs'
      },
      {
        name: '超图几何缓冲分析',
        path: 'smBufferGeo'
      },
      {
        name: '超图叠加分析',
        path: 'smOverlayDs'
      },
      {
        name: '超图表面分析',
        path: 'smSurface'
      },
      {
        name: '超图最短路径分析',
        path: 'smFindPath'
      },
      {
        name: '超图服务区分析',
        path: 'smFindSa'
      },
      {
        name: '超图邻近设施查找',
        path: 'smFindCloseFc'
      },
      {
        name: '超图正地理编码',
        path: 'smGeocode'
      },
      {
        name: '超图逆地理编码',
        path: 'smGeocodeReverse'
      }]
  },
  {
    title: 'ArcGIS服务端分析',
    index: 4,
    name: 'ArcGIS', icon: 'layui-icon-component',
    children: [
      {
        name: 'ArcGIS SQL查询',
        path: 'esriSQLQuery'
      },
      {
        name: 'ArcGIS几何查询',
        path: 'esriGeoQuery'
      },
      {
        name: 'ArcGIS缓冲区查询',
        path: 'esriBufferQuery'
      },
      {
        name: 'ArcGIS缓冲区分析',
        path: 'esriBufferAnalysis'
      },
      {
        name: 'ArcGIS凸包分析',
        path: 'esriConvexAnalysis'
      },
      {
        name: 'ArcGIS叠加分析',
        path: 'esriOverlayAnalysis'
      },
      {
        name: 'ArcGIS最短路径分析',
        path: 'esriFindPath'
      },
      {
        name: 'ArcGIS服务区分析',
        path: 'esriFindSa'
      },
      {
        name: 'ArcGIS邻近设施分析',
        path: 'esriFindCloseFc'
      },
      {
        name: 'ArcGIS地址查询服务',
        path: 'esriAddressSearch'
      },
      {
        name: 'ArcGIS正地理编码',
        path: 'esriGeocode'
      },
      {
        name: 'ArcGIS逆地理编码',
        path: 'esriGeocodeReverse'
      }]
  },
  {
    title: '大数据可视化',
    index: 5,
    name: 'BigData',
    icon: 'layui-icon-component',
    children: [
      {
        name: '热力图',
        path: 'heatMap'
      },
      {
        name: '格网聚合图',
        path: 'heatMapGrid'
      },
      {
        name: '蜂巢聚合图',
        path: 'heatMapComb'
      },
      {
        name: '风场',
        path: 'windyShield'
      }
    ]
  }
];
