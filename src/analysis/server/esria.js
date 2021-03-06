import axios from 'axios'
import * as qs from "qs";

const Path = function () {
  let path = [];

  let getPath = function () {
    return path;
  };

  let append = function (point) {
    path.push(point);
  };

  return {
    getPath: getPath,
    append: append,
  }
};

export default {
  returnDirections: true,
  overlayType: {
    CUT: 'cut',
    DIFFERENCE: 'difference',
    INTERSECT: 'intersect',
    UNION: 'union',
    CONVEXHULL: 'convexHull'
  },
  constantType: {
    "point": "esriGeometryPoint",
    "multipoint": "esriGeometryMultipoint",
    "polyline": "esriGeometryPolyline",
    "linestring": "esriGeometryPolyline",
    "polygon": "esriGeometryPolygon",
    "multilinestring": 'esriGeometryPolyline',
    "multipolygon": "esriGeometryPolygon",
    "esrigeometrypoint": "esriGeometryPoint",
    "esrigeometrymultipoint": "esriGeometryMultipoint",
    "esrigeometrypolyline": "esriGeometryPolyline",
    "esrigeometrypolygon": "esriGeometryPolygon",
  },
  constantUnit: {
    "meter": 9001,
    "kilometer": 9036,
    "degree": 9102,
    "foot": 9002
  },
  request: function (url, params, data, method) {
    axios.defaults.withCredentials = true;
    axios.defaults.crossDomain = true;
    const service = axios.create({
      baseURL: url, // url = base url + request url
      // withCredentials: true, // send cookies when cross-domain requests
      timeout: 50000, // request timeout
    });
    service.interceptors.request.use(
      (config) => {
        // 兼容 post 跨域问题
        if (config.method === 'post') {

          // 修改 Content-Type
          config.headers['Content-Type'] =
            'application/x-www-form-urlencoded';
          // 将对象参数转换为序列化的 URL 形式（key=val&key=val）
          config.data = qs.stringify(config.data);
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    if (method.toUpperCase() === 'GET') {
      return service.get('', {
        params: params
      });
    } else if (method.toUpperCase() === 'POST') {
      return service.post('', data, {
        params: params
      })
    }
  },
  extractInt(cgString, index) {
    let i = index[0] + 1;
    while (i < cgString.length && cgString.charAt(i) !== '-' && cgString.charAt(i) !== '+' && cgString.charAt(i) !== '|')
      i++;
    let sr32 = cgString.substring(index[0], i);
    index[0] = i;
    return parseInt(sr32.replace("+", ""), 32);
  },
  createPathFromCompressedGeometry(cgString) {
    let path = new Path();
    let flags = 0;
    let nIndex_XY = [0];
    let nIndex_Z = [0];
    let nIndex_M = [0];
    let dMultBy_XY = 0;
    let dMultBy_Z = 0;
    let dMultBy_M = 0;

    let firstElement = this.extractInt(cgString, nIndex_XY);
    if (firstElement === 0) {// 10.0+ format
      let version = this.extractInt(cgString, nIndex_XY);
      if (version !== 1)
        return [];
      flags = this.extractInt(cgString, nIndex_XY);
      if ((0xfffffffc & flags) !== 0)
        return [];
      dMultBy_XY = this.extractInt(cgString, nIndex_XY);
    } else
      dMultBy_XY = firstElement;

    let nLength = cgString.length;
    if (flags !== 0) {
      nLength = cgString.indexOf('|');
      if ((flags & 1) === 1) {
        nIndex_Z[0] = nLength + 1;
        dMultBy_Z = this.extractInt(cgString, nIndex_Z);
      }
      if ((flags & 2) === 2) {
        nIndex_M[0] = cgString.indexOf('|', nIndex_Z[0]) + 1;
        dMultBy_M = this.extractInt(cgString, nIndex_M);
      }
    }
    let nLastDiffX = 0;
    let nLastDiffY = 0;
    let nLastDiffZ = 0;
    while (nIndex_XY[0] < nLength) {
      // X
      let nDiffX = this.extractInt(cgString, nIndex_XY);
      let nX = nDiffX + nLastDiffX;
      nLastDiffX = nX;
      let dX = nX / dMultBy_XY;
      // Y
      let nDiffY = this.extractInt(cgString, nIndex_XY);
      let nY = nDiffY + nLastDiffY;
      nLastDiffY = nY;
      let dY = nY / dMultBy_XY;
      path.append([dX, dY]);
      if ((flags & 1) === 1) {// has Zs
        let nDiffZ = this.extractInt(cgString, nIndex_Z);
        let nZ = nDiffZ + nLastDiffZ;
        nLastDiffZ = nZ;
        let dZ = nZ / dMultBy_Z;
        path.getPath().get(path.getPath().size() - 1).push(dZ);
      }
    }
    return path.getPath();
  },
  geoJsonToArcGISFormatCol: function (geoJson) {
    let geometries = {
      geometryType: '',
      geometries: []
    };
    if (!geoJson) {
      return null;
    }
    if (geoJson.type === 'FeatureCollection' && geoJson.features.length > 0) {
      geometries.geometryType = this.constantType[geoJson.features[0].geometry.type.toLowerCase()];
      for (let i = 0; i < geoJson.features.length; i++) {
        if (geometries.geometryType === 'esriGeometryPolyline') {
          let paths = geoJson.features[i].geometry.coordinates;
          geometries.geometries.push({"paths": [paths]});
        } else if (geometries.geometryType === 'esriGeometryPolygon') {
          let rings = geoJson.features[i].geometry.coordinates;
          geometries.geometries.push({"rings": rings});
        } else if (geometries.geometryType === 'esriGeometryPoint') {
          let x = geoJson.features[i].geometry.coordinates[0];
          let y = geoJson.features[i].geometry.coordinates[1];
          geometries.geometries.push({x: x, y: y})
        } else {
          return null;
        }
      }
      return geometries;
    } else if (geoJson.type === 'Feature') {
      geometries.geometryType = this.constantType[geoJson.geometry.type.toLowerCase()];
      if (geometries.geometryType === 'esriGeometryPolyline') {
        let paths = geoJson.geometry.coordinates;
        geometries.geometries.push({"paths": [paths]});
      } else if (geometries.geometryType === 'esriGeometryPolygon') {
        let rings = geoJson.geometry.coordinates;
        geometries.geometries.push({"rings": rings});
      } else if (geometries.geometryType === 'esriGeometryPoint') {
        let x = geoJson.geometry.coordinates[0];
        let y = geoJson.geometry.coordinates[1];
        geometries.geometries.push({x: x, y: y})
      } else {
        return null;
      }
      return geometries;
    }
    return null;
  },
  geoJsonToArcGISFormat: function (geoJson) {
    let geometries = {
      geometryType: '',
      geometry: {}
    };
    if (!geoJson) {
      return null;
    }
    if (geoJson.type === 'Feature') {
      geometries.geometryType = this.constantType[geoJson.geometry.type.toLowerCase()];
      if (geometries.geometryType === 'esriGeometryPolyline') {
        let paths = geoJson.geometry.coordinates;
        geometries.geometry = {"paths": [paths]};
      } else if (geometries.geometryType === 'esriGeometryPolygon') {
        let rings = geoJson.geometry.coordinates;
        geometries.geometry = {"rings": rings}
      } else if (geometries.geometryType === 'esriGeometryPoint') {
        let x = geoJson.geometry.coordinates[0];
        let y = geoJson.geometry.coordinates[1];
        geometries.geometry = {x: x, y: y};
      } else {
        return null;
      }
      return geometries;
    }
    return null;
  },
  queryGisData: function (url, layerId, param) {
    return new Promise(function (resolve, reject) {
      url = url.endsWith("/") ? url : url + "/";
      let query = L.esri.query({
        url: url + layerId
      });
      let where = param.where;
      //1 属性过滤
      if (where) {
        query.where(where);
      }
      //2 空间过滤
      let within = param.within,
        intersects = param.intersects,
        contains = param.contains,
        overlaps = param.overlaps,
        nearby = param.nearby;
      //包含
      if (within) {
        query.within(within);
      }
      //相交
      if (intersects) {
        query.intersects(intersects);
      }
      //包含
      if (contains) {
        query.contains(contains);
      }
      //搭界
      if (overlaps) {
        query.overlaps(overlaps);
      }
      //在...附近
      if (nearby) {
        query.nearby(nearby.latlng, nearby.radius);
      }
      //3 确定需要字段
      let outFields = param.outFields;
      if (outFields) {
        query.params.outFields = outFields;
      }
      //4 执行查询操作
      query.run(function (error, states) {
        if (error) {
          console.log("查询地图数据：图层ID" + layerId + "时出错。");
          reject(error);
        } else {
          resolve(states);
        }
      });
    });
  },
  findServiceAreas(url, spatialRef, facilities, breaks) {
    let strFAC = '';
    for (let i = 0; i < facilities.length; i++) {
      strFAC += facilities[i][0] + "," + facilities[i][1] + ";";
    }
    let strBreaks = '';
    for (let i = 0; i < breaks.length; i++) {
      strBreaks += breaks[i] + ",";
    }
    let params = {
      facilities: strFAC,
      barriers: null,
      polylineBarriers: null,
      polygonBarriers: null,
      defaultBreaks: strBreaks,
      excludeSourcesFromPolygons: [],
      mergeSimilarPolygonRanges: false,
      overlapLines: true,
      overlapPolygons: true,
      splitLinesAtBreaks: false,
      splitPolygonsAtBreaks: true,
      trimOuterPolygon: true,
      trimPolygonDistance: 100,
      trimPolygonDistanceUnits: 'esriMeters',
      outSR: spatialRef,
      accumulateAttributeNames: null,
      impedanceAttributeName: 'Length',
      restrictionAttributeNames: null,
      attributeParameterValues: null,
      restrictUTurns: 'esriNFSBAllowBacktrack',
      returnFacilities: false,
      returnBarriers: false,
      returnPolylineBarriers: false,
      returnPolygonBarriers: false,
      outputLines: 'esriNAOutputLineNone',
      outputPolygons: 'esriNAOutputPolygonSimplified',
      travelDirection: 'esriNATravelDirectionFromFacility',
      outputGeometryPrecision: null,
      outputGeometryPrecisionUnits: 'esriDecimalDegrees',
      useHierarchy: false,
      timeOfDay: null,
      timeOfDayIsUTC: false,
      returnZ: false,
      travelMode: null,
      f: 'json'
    };
    url = url.endsWith("/") ? url : url + "/";
    return this.request(url + "Service%20Area/solveServiceArea", null, params, 'post');
  },
  findPath(url, spatialRef, stops) {
    let strFAC = '';
    for (let i = 0; i < stops.length; i++) {
      strFAC += stops[i][0] + "," + stops[i][1] + ";";
    }
    let params = {
      stops: strFAC,
      barriers: '',
      polylineBarriers: '',
      polygonBarriers: '',
      outSR: spatialRef,
      ignoreInvalidLocations: true,
      impedanceAttributeName: 'Length',
      restrictUTurns: 'esriNFSBAllowBacktrack',
      useHierarchy: false,
      returnDirections: this.returnDirections,
      returnRoutes: true,
      returnStops: false,
      returnBarriers: false,
      returnPolylineBarriers: false,
      returnPolygonBarriers: false,
      directionsLanguage: 'zh_CN',
      directionsStyleName: '',
      outputLines: 'esriNAOutputLineTrueShape',
      findBestSequence: false,
      preserveFirstStop: true,
      preserveLastStop: true,
      useTimeWindows: false,
      startTime: new Date().toString(),
      startTimeIsUTC: false,
      outputGeometryPrecision: '0.00000001',
      outputGeometryPrecisionUnits: 'esriDecimalDegrees',
      directionsOutputType: 'esriDOTComplete',
      directionsTimeAttributeName: '',
      directionsLengthUnits: 'esriNAUKilometers',
      returnZ: false,
      travelMode: '',
      f: 'pjson'
    };
    return new Promise((resolve, reject) => {
      url = url.endsWith("/") ? url : url + "/";
      this.request(url + "Route/solve", null, params, 'post').then((resp) => {
        let dt = {};
        if (resp.data.routes && resp.data.routes.features.length > 0) {
          dt.lengthM = resp.data.routes.features[0].attributes.Total_Length;
          dt.lengthD = resp.data.routes.features[0].attributes.Shape_Length;
          let dirs = resp.data.directions[0].features;
          dt.roads = [];
          for (let h = 0; h < dirs.length; h++) {
            if (dirs[h].hasOwnProperty("strings")) {
              let strings = dirs[h]["strings"];
              for (let q = 0; q < strings.length; q++) {
                if (strings[q].stringType === 'esriDSTStreetName') {
                  let road = {
                    seg: strings[q].string,
                    geo: this.createPathFromCompressedGeometry(dirs[h].compressedGeometry),
                  };
                  dt.roads.push(road);
                }
              }
            }
          }
        } else {
          dt.lengthD = Math.sqrt(Math.pow(stops[0][0] - stops[1][0], 2) + Math.pow(stops[0][1] - stops[1][1], 2));
          dt.lengthM = T.turf.calDistance(stops[0][0], stops[0][1], stops[1][0], stops[1][1]);
        }
        dt.source = resp.data;
        resolve(dt);
      }).catch((resp) => {
        reject(resp);
      })
    })
  },
  findClosetFacilities(url, spatialRef, froms, tos) {
    let strFroms = '';
    for (let i = 0; i < froms.length; i++) {
      strFroms += froms[i][0] + "," + froms[i][1] + ";";
    }
    let strTos = '';
    for (let i = 0; i < tos.length; i++) {
      strTos += tos[i][0] + "," + tos[i][1] + ";";
    }
    let params = {
      incidents: strFroms,
      facilities: strTos,
      barriers: null,
      polylineBarriers: null,
      polygonBarriers: null,
      travelDirection: 'esriNATravelDirectionToFacility',
      defaultCutoff: null,
      defaultTargetFacilityCount: 1,
      outSR: spatialRef,
      accumulateAttributeNames: null,
      impedanceAttributeName: "Length",
      restrictionAttributeNames: "",
      attributeParameterValues: "",
      restrictUTurns: "esriNFSBAllowBacktrack",
      useHierarchy: false,
      returnDirections: this.returnDirections,
      returnCFRoutes: true,
      returnFacilities: true,
      returnIncidents: true,
      returnBarriers: false,
      returnPolylineBarriers: false,
      returnPolygonBarriers: false,
      directionsLanguage: "zh-CN",
      directionsOutputType: "esriDOTComplete",
      directionsStyleName: null,
      outputLines: 'esriNAOutputLineTrueShape',
      outputGeometryPrecision: null,
      outputGeometryPrecisionUnits: 'esriDecimalDegrees',
      directionsTimeAttributeName: null,
      directionsLengthUnits: 'esriNAUMiles',
      timeOfDay: null,
      timeOfDayUsage: 'esriNATimeOfDayUseAsStartTime',
      timeOfDayIsUTC: false,
      returnZ: false,
      travelMode: null,
      f: "json"
    };
    url = url.endsWith("/") ? url : url + "/";
    return this.request(url + "Closest%20Facility/solveClosestFacility", null, params, 'post');
  },
  bufferGeoAnalysis: function (url, geoJson, spatialRef, distance, unit) {
    let geoFormat = this.geoJsonToArcGISFormatCol(geoJson);
    if (!geoFormat) {
      return;
    }
    let units = this.constantUnit[unit.toLowerCase()];
    let bufRef = spatialRef;
    if (unit.toLowerCase() !== 'degree') {
      bufRef = 3857
    }
    let params = {
      geometries: JSON.stringify(geoFormat),
      inSR: spatialRef,
      outSR: bufRef,
      distances: distance,
      unit: units,
      unionResults: 'true',
      geodesic: false,
      f: 'json'
    };
    url = url.endsWith("/") ? url : url + "/";
    return this.request(url + "buffer", null, params, 'post');
  },
  overlayGeoAnalysis: function (url, sourceGeo, targetGeo, overlayType, spatialRef) {
    let params = {
      sr: spatialRef,
      f: 'json'
    };
    let suffix = '';
    let sourceGeoFormat = this.geoJsonToArcGISFormatCol(sourceGeo);
    let targetGeoFormat = this.geoJsonToArcGISFormat(targetGeo);
    switch (overlayType) {
      case"cut":
        suffix = 'cut';
        if (sourceGeoFormat && targetGeoFormat) {
          params['target'] = JSON.stringify(sourceGeoFormat);
          params['cutter'] = JSON.stringify(targetGeoFormat);
        }
        break;
      case"difference":
        suffix = 'difference';
        if (sourceGeoFormat && targetGeoFormat) {
          params['geometries'] = JSON.stringify(sourceGeoFormat);
          params['geometry'] = JSON.stringify(targetGeoFormat);
        }
        break;
      case"intersect":
        suffix = 'intersect';
        if (sourceGeoFormat && targetGeoFormat) {
          params['geometries'] = JSON.stringify(sourceGeoFormat);
          params['geometry'] = JSON.stringify(targetGeoFormat);
        }
        break;
      case"union":
        suffix = 'union';
        if (sourceGeoFormat) {
          params['geometries'] = JSON.stringify(sourceGeoFormat);
        }
        break;
      case"convexHull":
        suffix = 'convexHull';
        if (sourceGeoFormat) {
          params['geometries'] = JSON.stringify(sourceGeoFormat);
        }
        break;
    }
    url = url.endsWith("/") ? url : url + "/";
    return this.request(url + suffix, null, params, 'post');
  },
  geocode: function (url, address) {
    let service = L.esri.Geocoding.geocodeService({url: url}).geocode();
    return new Promise(function (resolve, reject) {
      service.text(address).run(function (err, results, response) {
        if (err) {
          reject.log(err);
          return;
        }
        resolve(results);
      });
    })
  },
  geocodeReverse: function (url, x, y) {
    let service = L.esri.Geocoding.geocodeService({url: url}).reverse();
    return new Promise(function (resolve, reject) {
      service.latlng([y, x]).run(function (err, results, response) {
        if (err) {
          reject.log(err);
          return;
        }
        resolve(results);
      });
    })
  }
}
