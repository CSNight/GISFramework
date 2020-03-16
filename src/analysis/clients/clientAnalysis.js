import {
  booleanContains,
  booleanPointInPolygon,
  buffer,
  concave,
  convex,
  difference,
  distance,
  intersect,
  isolines,
  lineString,
  nearestPointOnLine,
  planepoint,
  point,
  polygon,
  simplify,
  tin,
  toMercator,
  toWgs84,
  union
} from "@turf/turf";
import {collectionOf, geojsonType} from "@turf/invariant";

export default {
  //距离计算
  calDistance: function (X1, Y1, X2, Y2, units) {
    let from = turf.point([X1, Y1]);
    let to = turf.point([X2, Y2]);
    let options = {units: units};
    return distance(from, to, options);
  },
  //缓冲区分析
  buffer: function (feature, radius, units) {
    return buffer(feature, radius, {units: units, step: 64})
  },
  //缓冲区查询
  bufferSearch: function (srcFeature, tarFeatures, radius, units) {
    let bufferFeat = buffer(srcFeature, radius, {units: units, step: 64});
    let result = [];
    for (let i = 0; i < tarFeatures.length; i++) {
      if (geojsonType(bufferFeat, "Polygon", "Polygon")) {
        if (booleanContains(bufferFeat, tarFeatures[i])) {
          result.push(tarFeatures[i])
        }
      } else if (collectionOf(bufferFeat, "Polygon", "Polygon")) {
        for (let j = 0; j < bufferFeat.features.length; j++) {
          if (booleanContains(bufferFeat.features[j], tarFeatures[i])) {
            result.push(tarFeatures[i])
          }
        }
      }
    }
    return result;
  },
  //多边形查询
  geoSearch: function (srcFeature, tarFeatures) {
    let result = [];
    let targets = [];
    if (tarFeatures instanceof Array) {
      targets = tarFeatures;
    } else if (tarFeatures.hasOwnProperty("type") && tarFeatures['type'] === "FeatureCollection") {
      targets = tarFeatures.features
    }
    for (let i = 0; i < targets.length; i++) {
      if (booleanContains(srcFeature, targets[i])) {
        result.push(targets[i])
      }
    }
    return result;
  },
  //多边形相交分析
  polygonIntersect: function (poly1, poly2) {
    return intersect(poly1, poly2);
  },
  //多边形相交分析
  pointArrIntersect: function (pointArr1, pointArr2) {
    let poly1 = polygon(pointArr1);
    let poly2 = polygon(pointArr2);
    if (poly1 && poly2) {
      return intersect(poly1, poly2);
    }
    return null;
  },
  //多边形相交异或
  polygonDifference: function (poly1, poly2) {
    return difference(poly1, poly2);
  },
  //多边形相交异或
  pointArrDifference: function (pointArr1, pointArr2) {
    let poly1 = polygon(pointArr1);
    let poly2 = polygon(pointArr2);
    if (poly1 && poly2) {
      return difference(poly1, poly2);
    }
    return null;
  },
  //多边形合并
  polyUnion: function (poly1, poly2) {
    return union(poly1, poly2);
  },
  //多边形合并
  pointArrUnion: function (pointArr1, pointArr2) {
    let poly1 = polygon(pointArr1);
    let poly2 = polygon(pointArr2);
    if (poly1 && poly2) {
      return union(poly1, poly2);
    }
    return null;
  },
  //多边形抽稀
  polySimplify: function (geoJson, tolerance, highQuality, mutate) {
    return simplify(geoJson, {
      tolerance: arguments[1] ? arguments[1] : 1,
      highQuality: arguments[2] ? arguments[1] : false,
      mutate: arguments[3] ? arguments[1] : false
    })
  },
  //计算外包络凹多边形 geoJson（FeatureCollection）点集,最大边长，边长单位
  genConcave: function (pointFeatureCollection, maxEdge, units) {
    let options = {units: arguments[2] ? arguments[2] : 'kilometers', maxEdge: arguments[1] ? arguments[1] : Infinity};
    return concave(pointFeatureCollection, options);
  },
  //计算外包络凸多边形 geoJson（FeatureCollection）点集
  genConvex: function (pointFeatureCollection) {
    return convex(pointFeatureCollection);
  },
  //生成等值线
  generateIsoLines: function (pointArrWithZ, breaks, zProperty) {
    if (pointArrWithZ.length > 0 && pointArrWithZ[0].properties.hasOwnProperty(zProperty)) {
      return isolines(pointArrWithZ, breaks, {zProperty: zProperty});
    }
    return null;
  },
  //生成TIN三角网 geoJson,z属性
  generateTIN: function (pointArrWithZ, zProperty) {
    if (pointArrWithZ.features.length > 0 && pointArrWithZ.features[0].properties.hasOwnProperty(zProperty)) {
      return tin(pointArrWithZ, zProperty);
    }
    return null;
  },
  //插值分析
  isoIntersect: function (tin, x, y) {
    if (tin.hasOwnProperty("type") && tin['type'] === "FeatureCollection") {
      let p = point(x, y);
      if (tin.features.length > 0 && p) {
        let tris = tin.features;
        for (let i = 0; i < tris.length; i++) {
          if (booleanPointInPolygon(p, tris[i], {ignoreBoundary: false})) {
            return planepoint(p, tris[i])
          }
        }
      }
    }
    return null;
  },
  //求线上最近点
  calNearestPointOnLine: function (LinePointArr, geoPoint, units) {
    if (LinePointArr.length > 0 && geoPoint.type === 'Point') {
      let line = lineString(LinePointArr);
      if (line) {
        return nearestPointOnLine(line, geoPoint, {units: units})
      }
    }
    return null;
  },
  pointToMercator: function (pointGeoJson) {
    return toMercator(pointGeoJson)
  },
  pointToWGS84: function (pointGeoJson) {
    return toWgs84(pointGeoJson)
  }
}



