export default {
  spatialQueryMode: {
    CONTAIN: 'CONTAIN',
    CROSS: 'CROSS',
    DISJOINT: 'DISJOINT',
    IDENTITY: 'IDENTITY',
    INTERSECT: 'INTERSECT',
    NONE: 'NONE',
    OVERLAP: 'OVERLAP',
    TOUCH: 'TOUCH',
    WITHIN: 'WITHIN',
  },
  searchBySQL: function (url, ds, dt, filter) {
    let sqlParam = new SuperMap.GetFeaturesBySQLParameters({
      queryParameter: {
        name: dt + "@" + ds,
        attributeFilter: filter
      },
      datasetNames: [ds + ":" + dt],
      fromIndex: 0,
      toIndex: 200000
    });
    return new Promise(function (resolve, reject) {
      L.supermap.featureService(url)
        .getFeaturesBySQL(sqlParam, function (serviceResult) {
          resolve(serviceResult.result);
        });
    });
  },
  searchByBuff: function (url, ds, dt, feature, dis) {
    let bufferParam = new SuperMap.GetFeaturesByBufferParameters({
      datasetNames: [ds + ":" + dt],
      bufferDistance: dis,
      geometry: feature,
      fromIndex: 0,
      toIndex: 200000
    });
    return new Promise(function (resolve, reject) {
      L.supermap
        .featureService(url)
        .getFeaturesByBuffer(bufferParam, function (serviceResult) {
          resolve(serviceResult.result);
        });
    });
  },
  searchByGeo: function (url, ds, dt, feature, mode) {
    let geometryParam = new SuperMap.GetFeaturesByGeometryParameters({
      datasetNames: [ds + ":" + dt],
      geometry: feature,
      spatialQueryMode: mode,
      fromIndex: 0,
      toIndex: 200000
    });
    return new Promise(function (resolve, reject) {
      L.supermap.featureService(url)
        .getFeaturesByGeometry(geometryParam, function (serviceResult) {
          resolve(serviceResult.result);
        });
    });
  },
  bufferGeoAnalysis(url, bufDistance, geo) {
    let bufferAnalystService = L.supermap.spatialAnalystService(url);
    let geoBufferAnalystParams = new SuperMap.GeometryBufferAnalystParameters({
      sourceGeometry: geo,
      bufferSetting: new SuperMap.BufferSetting({
        endType: SuperMap.BufferEndType.ROUND,
        leftDistance: new SuperMap.BufferDistance({value: bufDistance}),
        rightDistance: new SuperMap.BufferDistance({value: bufDistance}),
        semicircleLineSegment: 10
      })
    });
    return new Promise(function (resolve, reject) {
      bufferAnalystService.bufferAnalysis(geoBufferAnalystParams, function (serviceResult) {
        let result = serviceResult.result;
        if (result && result.hasOwnProperty('resultGeometry')) {
          resolve(result.resultGeometry);
        } else {
          reject(result.error.message);
        }
      });
    })
  },
  bufferDatasetAnalysis(url, bufDistance, dataset, datasource, filter) {
    let bufferAnalystService = L.supermap.spatialAnalystService(url);
    let dsBufferAnalystParameters = new SuperMap.DatasetBufferAnalystParameters({
      dataset: dataset + "@" + datasource,
      filterQueryParameter: new SuperMap.FilterParameter({
        attributeFilter: filter && filter !== '' ? filter : '1=1'
      }),
      bufferSetting: new SuperMap.BufferSetting({
        endType: SuperMap.BufferEndType.ROUND,
        leftDistance: new SuperMap.BufferDistance({value: bufDistance}),
        rightDistance: new SuperMap.BufferDistance({value: bufDistance}),
        semicircleLineSegment: 10
      })
    });
    return new Promise(function (resolve, reject) {
      bufferAnalystService.bufferAnalysis(dsBufferAnalystParameters, function (result) {
        resolve(result.result);
      });
    })
  },
  overlayDatasetAnalysis(url, srcDtSet, srcDtSource, tarDtSet, tarDtSource, Op) {
    let overlayAnalystService = L.supermap.spatialAnalystService(url);

    function getOp(operator) {
      switch (operator) {
        default:
        case'INTERSECT':
          return SuperMap.OverlayOperationType.INTERSECT;
        case'CLIP':
          return SuperMap.OverlayOperationType.CLIP;
        case'ERASE':
          return SuperMap.OverlayOperationType.ERASE;
        case'IDENTITY':
          return SuperMap.OverlayOperationType.IDENTITY;
        case'UNION':
          return SuperMap.OverlayOperationType.UNION;
        case'UPDATE':
          return SuperMap.OverlayOperationType.UPDATE;
        case'XOR':
          return SuperMap.OverlayOperationType.XOR;
      }
    }

    let datasetOverlayAnalystParameters = new SuperMap.DatasetOverlayAnalystParameters({
      sourceDataset: srcDtSet + "@" + srcDtSource,
      operateDataset: tarDtSet + "@" + tarDtSource,
      tolerance: 0,
      operation: getOp(Op)
    });
    return new Promise(function (resolve, reject) {
      overlayAnalystService.overlayAnalysis(datasetOverlayAnalystParameters, function (serviceResult) {
        let result = serviceResult.result;
        if (result) {
          resolve(result);
        } else {
          reject(result.error.message);
        }
      });
    })
  },
  /**
   * @param url ss
   * @param region
   * @param dataset
   * @param datasource
   * @param resolution
   * @param zField
   * @param interval
   * @param startVal
   * @return
   */
  surfaceAnalystProcess: function (url, region, dataset, datasource, resolution, zField, interval, startVal) {

    let surfaceAnalystParameters = new SuperMap.DatasetSurfaceAnalystParameters({
      extractParameter: new SuperMap.SurfaceAnalystParametersSetting({
        datumValue: startVal ? startVal : 0,
        interval: interval,
        resampleTolerance: 0,
        smoothMethod: SuperMap.SmoothMethod.BSPLINE,
        smoothness: 3,
        clipRegion: region
      }),
      dataset: dataset + "@" + datasource,
      resolution: resolution,
      zValueFieldName: zField
    });
    let surfaceAnalystService = L.supermap.spatialAnalystService(url);
    return new Promise(function (resolve, reject) {
      surfaceAnalystService.surfaceAnalysis(surfaceAnalystParameters, function (serviceResult) {
        let result = serviceResult.result;
        if (result && result.recordset && result.recordset.features) {
          resolve(result)
        } else {
          reject(serviceResult.error.errorMsg);
        }
      });
    });
  },
  findPath: function (url, endPoints, weightField) {
//创建最佳路径分析服务实例
    let findPathService = L.supermap.networkAnalystService(url);
    //创建最佳路径分析参数实例
    let resultSetting = new SuperMap.TransportationAnalystResultSetting({
      returnEdgeFeatures: true,
      returnEdgeGeometry: true,
      returnEdgeIDs: true,
      returnNodeFeatures: true,
      returnNodeGeometry: true,
      returnNodeIDs: true,
      returnPathGuides: true,
      returnRoutes: true
    });
    let analystParameter = new SuperMap.TransportationAnalystParameter({
      resultSetting: resultSetting,
      weightFieldName: weightField ? weightField : "length"
    });
    let findPathParameter = new SuperMap.FindPathParameters({
      isAnalyzeById: false,
      nodes: endPoints,
      parameter: analystParameter
    });
    return new Promise(function (resolve, reject) {
      findPathService.findPath(findPathParameter, function (serviceResult) {
        let result = serviceResult.result;
        if (result) {
          resolve(result)
        } else {
          reject(serviceResult.error.errorMsg);
        }
      });
    });
  },
  findServiceAreas: function (url, centers, weights, weightField) {
    //添加中心点
    let resultSetting = new SuperMap.TransportationAnalystResultSetting({
      returnEdgeFeatures: true,
      returnEdgeGeometry: true,
      returnEdgeIDs: true,
      returnNodeFeatures: true,
      returnNodeGeometry: true,
      returnNodeIDs: true,
      returnPathGuides: true,
      returnRoutes: true
    });
    let analystParameter = new SuperMap.TransportationAnalystParameter({
      resultSetting: resultSetting,
      weightFieldName: weightField ? weightField : "length"
    });
    let parameter = new SuperMap.FindServiceAreasParameters({
      weights: weights,
      centers: centers,
      isAnalyzeById: false,
      parameter: analystParameter
    });
    let service = L.supermap.networkAnalystService(url);
    return new Promise(function (resolve, reject) {
      service.findServiceAreas(parameter, function (serviceResult) {
        let result = serviceResult.result;
        if (result) {
          resolve(result)
        } else {
          reject(serviceResult.error.errorMsg);
        }
      });
    });
  },
  findClosetFacilities: function (url, evtPoint, facilities, weightField) {
    //创建最近设施分析服务实例
    let findClosetFacilitiesService = L.supermap.networkAnalystService(url);
    //创建最近设施分析参数实例
    let resultSetting = new SuperMap.TransportationAnalystResultSetting({
      returnEdgeFeatures: true,
      returnEdgeGeometry: true,
      returnEdgeIDs: true,
      returnNodeFeatures: true,
      returnNodeGeometry: true,
      returnNodeIDs: true,
      returnPathGuides: true,
      returnRoutes: true
    });
    let analystParameter = new SuperMap.TransportationAnalystParameter({
      resultSetting: resultSetting,
      // turnWeightField: "TurnCost",
      weightFieldName: weightField ? weightField : "length"
    });
    let findClosetFacilitiesParameter = new SuperMap.FindClosestFacilitiesParameters({
      //事件点,必设参数
      event: evtPoint,
      //要查找的设施点数量。默认值为1
      expectFacilityCount: 1,
      //设施点集合,必设
      facilities: facilities,
      isAnalyzeById: false,
      parameter: analystParameter
    });
    //进行查找
    return new Promise(function (resolve, reject) {
      findClosetFacilitiesService.findClosestFacilities(findClosetFacilitiesParameter, function (serviceResult) {
        let result = serviceResult.result;
        if (result) {
          resolve(result)
        } else {
          reject(serviceResult.error.errorMsg);
        }
      });
    });
  },
  addressMatch: function (url, address, count, spatialRef) {
    let addressMatchService = L.supermap.addressMatchService(url);
    let geoCodeParam = new SuperMap.GeoCodingParameter({
      address: address,
      fromIndex: 0,
      toIndex: count,
      filters: '',
      prjCoordSys: {epsgcode: spatialRef},
      maxReturn: -1
    });
    return new Promise(function (resolve, reject) {
      addressMatchService.code(geoCodeParam, function (serviceResult) {
        let result = serviceResult.result;
        if (result) {
          resolve(result)
        } else {
          reject(serviceResult.error.errorMsg);
        }
      });
    })
  },
  getAddressCoord: function (url, x, y, count, spatialRef) {
    let addressMatchService = L.supermap.addressMatchService(url);
    let geoDecodeParam = new SuperMap.GeoDecodingParameter({
      x: x,
      y: y,
      fromIndex: 0,
      toIndex: count,
      filters: '',
      prjCoordSys: {epsgcode: spatialRef},
      maxReturn: -1,
      geoDecodingRadius: -1,
    });
    return new Promise(function (resolve, reject) {
      addressMatchService.code(geoDecodeParam, function (serviceResult) {
        let result = serviceResult.result;
        if (result) {
          resolve(result)
        } else {
          reject(serviceResult.error.errorMsg);
        }
      });
    })
  }
}
