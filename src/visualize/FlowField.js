let Utils = {
  deg2rad: function (deg) {
    return deg / 180 * Math.PI;
  },
  rad2deg: function (ang) {
    return ang / (Math.PI / 180.0);
  },
  floorMod: function (a, n) {
    return a - n * Math.floor(a / n);
  },
  isValue: function (x) {
    return x !== null && x !== undefined;
  },
  mercY: function (lat) {
    return Math.log(Math.tan(lat / 2 + Math.PI / 4));
  },
  isMobile: function () {
    return (/android|blackberry|iemobile|ipad|iphone|ipod|opera mini|webos/i).test(navigator.userAgent);
  }
};
let FlowField = function (options) {
  const halfPI = 2 * Math.PI;
  const H = Math.pow(10, -5.2);
  let _options = {
    PARTICLE_LINE_WIDTH: 1.5,              // line width of a drawn particle
    PARTICLE_MULTIPLIER: 1 / 30,         // particle count scalar (completely arbitrary--this values looks nice)
    PARTICLE_REDUCTION: 0.75,            // reduce particle count to this much of normal for mobile devices
    MAX_PARTICLE_AGE: 100,               // max number of frames a particle is drawn before regeneration
    //没有风的情况
    NULL_WIND_VECTOR: [NaN, NaN, null],
    min_color: 0, // 风速为0使用的颜色
    max_color: 15, // 风速最大使用的颜色
    FRAME_RATE: 35, //定义每秒执行的次数
    FRAME_TIME: 1000 / this.FRAME_RATE, // desired frames per second
    globalAlpha: 0.92, //定义透明度，透明度越大，尾巴越长
    //存放颜色的数组
    colorScale: [
      "rgb(36,104, 180)", "rgb(60,157, 194)", "rgb(128,205,193 )",
      "rgb(151,218,168 )", "rgb(198,231,181)", "rgb(238,247,217)",
      "rgb(255,238,159)", "rgb(252,217,125)", "rgb(255,182,100)",
      "rgb(252,150,75)", "rgb(250,112,52)", "rgb(245,64,32)",
      "rgb(237,45,28)", "rgb(220,24,32)", "rgb(180,0,35)"
    ],
    //粒子动画的速度，为参数乘以屏幕的像素密度开三次方
    //如果不支持像素密度，就乘以1,
    VELOCITY_SCALE: (0.01) * (Math.pow(window.devicePixelRatio, 1 / 3) || 1),
    data: [],
    map: null
  };
  _options = Object.assign(_options, options);
  if (!_options.data || _options.data.length === 0 || !map) {
    throw Error('Data option can not be null or empty');
  }
  if (!map) {
    throw Error('map option can not be null or empty');
  }
  _options.colorScale.indexFor = (m) => {
    // map velocity speed to a style
    return Math.max(
      0,
      Math.min(_options.colorScale.length - 1,
        Math.round((m - _options.max_color) / (_options.max_color - _options.min_color) * (_options.colorScale.length - 1))));
  };
  let columns = []; //插值网格
  let buckets = _options.colorScale.map(function () {
    return [];
  });

  function project(lat, lon, windy) {
    // both in radians, use deg2rad if neccessary
    let ymin = Utils.mercY(windy.south);
    let ymax = Utils.mercY(windy.north);
    let xFactor = windy.width / (windy.east - windy.west);
    let yFactor = windy.height / (ymax - ymin);

    let y = Utils.mercY(Utils.deg2rad(lat));
    let x = (Utils.deg2rad(lon) - windy.west) * xFactor;
    y = (ymax - y) * yFactor; // y points south
    return [x, y];
  }

  function distort(projection, λ, φ, x, y, scale, wind, windy) {
    //projection是一个空的对象
    // λ, φ格点的经纬度
    //x, y格点所在的像素点
    //格点的风向风速
    //windy
    //scale 一个参数，每次粒子运动的距离
    let u = wind[0] * scale;
    let v = wind[1] * scale;
    let d = distortion(projection, λ, φ, x, y, windy);

    // Scale distortion vectors by u and v, then add.
    wind[0] = d[0] * u + d[2] * v;
    wind[1] = d[1] * u + d[3] * v;
    return wind;
  }

  function distortion(projection, λ, φ, x, y, windy) {
    let hλ = λ < 0 ? H : -H;
    let hφ = φ < 0 ? H : -H;
    let pλ = project(φ, λ + hλ, windy);
    let pφ = project(φ + hφ, λ, windy);

    // Meridian scale factor (see Snyder, equation 4-3), where R = 1. This handles issue where length of 1º λ
    // changes depending on φ. Without this, there is a pinching effect at the poles.
    let k = Math.cos(φ / 360 * halfPI);
    return [
      (pλ[0] - x) / hλ / k,
      (pλ[1] - y) / hλ / k,
      (pφ[0] - x) / hφ,
      (pφ[1] - y) / hφ
    ];
  }

  function biLinearInterpolateVector(x, y, g00, g10, g01, g11) {
    let rx = (1 - x);
    let ry = (1 - y);
    let a = rx * ry, b = x * ry, c = rx * y, d = x * y;
    let u = g00[0] * a + g10[0] * b + g01[0] * c + g11[0] * d;
    let v = g00[1] * a + g10[1] * b + g01[1] * c + g11[1] * d;
    return [u, v, Math.sqrt(u * u + v * v)];
  }


  function createWindBuilder(uComp, vComp) {
    let uData = uComp.data, vData = vComp.data;
    return {
      header: uComp.header,
      //recipe: recipeFor("wind-" + uComp.header.surface1Value),
      data: function (i) {
        return [uData[i], vData[i]];
      },
      interpolate: biLinearInterpolateVector
    }
  }

  function createBuilder(data) {
    let uComp = null, vComp = null, scalar = null;
    data.forEach(function (record) {
      switch (record.header.parameterCategory + "," + record.header.parameterNumber) {
        case "2,2":
          uComp = record;
          break;
        case "2,3":
          vComp = record;
          break;
        default:
          scalar = record;
      }
    });
    return createWindBuilder(uComp, vComp);
  }

  function invert(x, y, extents) {
    let mapLonDelta = extents.east - extents.west;
    let worldMapRadius = extents.width / Utils.rad2deg(mapLonDelta) * 360 / (2 * Math.PI);
    let mapOffsetY = (worldMapRadius / 2 * Math.log((1 + Math.sin(extents.south)) / (1 - Math.sin(extents.south))));
    let equatorY = extents.height + mapOffsetY;
    let a = (equatorY - y) / worldMapRadius;

    let lat = 180 / Math.PI * (2 * Math.atan(Math.exp(a)) - Math.PI / 2);
    let lon = Utils.rad2deg(extents.west) + x / extents.width * Utils.rad2deg(mapLonDelta);
    return [lon, lat];
  }

  let buildGrid = function (callback) {
    let builder = createBuilder(_options.data);

    let header = builder.header;
    let X0 = header.lo1;
    let Y0 = header.la1;  // the grid's origin (e.g., 0.0E, 90.0N)
    let deltaX = header.dx;
    let deltaY = header.dy;    // distance between grid points (e.g., 1.0 deg lon, 1.0 deg lat)
    let ni = header.nx;    // number of grid points W-E (e.g., 360)
    let nj = header.ny;    // number of grid points N-S (e.g., 181)
    let date = new Date(header.refTime);
    date.setHours(date.getHours() + header.forecastTime);

    let grid = [], p = 0;
    let isContinuous = Math.floor(ni * deltaX) >= 360;
    for (let j = 0; j < nj; j++) {
      let row = [];
      for (let i = 0; i < ni; i++, p++) {
        row[i] = builder.data(p);
      }
      if (isContinuous) {
        // For wrapped grids, duplicate first column as last column to simplify interpolation logic
        row.push(row[0]);
      }
      grid[j] = row;
    }

    function interpolate(λ, φ) {
      let i = Utils.floorMod(λ - X0, 360) / deltaX;  // calculate longitude index in wrapped range [0, 360)
      let j = (Y0 - φ) / deltaY;                            // calculate latitude index in direction +90 to -90

      let fi = Math.floor(i);
      let fj = Math.floor(j);
      let ci = fi + 1;
      let cj = fj + 1;
      let row;
      if ((row = grid[fj])) {
        let g00 = row[fi];
        let g10 = row[ci];
        if (Utils.isValue(g00) && Utils.isValue(g10) && (row = grid[cj])) {
          let g01 = row[fi];
          let g11 = row[ci];
          if (Utils.isValue(g01) && Utils.isValue(g11)) {
            // All four points found, so interpolate the value.
            return builder.interpolate(i - fi, j - fj, g00, g10, g01, g11);
          }
        }
      }
      return null;
    }

    callback({
      date: date,
      interpolate: interpolate
    });
  };

  let createField = function (columns, bounds, callback) {
    /**
     * @returns {Array} wind vector [u, v, magnitude] at the point (x, y), or [NaN, NaN, null] if wind
     *          is undefined at that point.
     */
    function field(x, y) {
      let column = columns[Math.round(x)];
      return column && column[Math.round(y)] || _options.NULL_WIND_VECTOR;
    }

    // Frees the massive "columns" array for GC. Without this, the array is leaked (in Chrome) each time a new
    // field is interpolated because the field closure's context is leaked, for reasons that defy explanation.
    field.release = function () {
      columns = [];
    };

    field.randomize = function (o) {  // UNDONE: this method is terrible
      let x, y;
      let safetyNet = 0;
      do {
        x = Math.round(Math.floor(Math.random() * bounds.width) + bounds.x);
        y = Math.round(Math.floor(Math.random() * bounds.height) + bounds.y)
      } while (field(x, y)[2] === null && safetyNet++ < 30);
      o.x = x;
      o.y = y;
      return o;
    };

    //field.overlay = mask.imageData;
    //return field;
    callback(bounds, field);
  };

  let interpolateField = function (grid, bounds, extent, callback) {
    let projection = {};
    let mapArea = ((extent.south - extent.north) * (extent.west - extent.east));
    let velocityScale = _options.VELOCITY_SCALE * Math.pow(mapArea, 0.3);
    columns = [];
    let x = bounds.x;

    function interpolateColumn(x) {
      let column = [];
      //画布上的每两个像素是一个格点
      for (let y = bounds.y; y <= bounds.yMax; y += 2) {
        let coords = invert(x, y, extent);
        //求出每一个格点所对应的经纬度
        if (coords) {
          let λ = coords[0]; //经度
          let φ = coords[1]; //纬度
          //监测经度是不是数字
          if (isFinite(λ)) {
            let wind = grid.interpolate(λ, φ);
            //每一个格点的uv和风速大小
            if (wind) {
              wind = distort(projection, λ, φ, x, y, velocityScale, wind, extent);
              column[y + 1] = column[y] = wind;
            }
          }
        }
      }
      columns[x + 1] = columns[x] = column;
    }

    (function batchInterpolate() {
      let start = Date.now();
      while (x < bounds.width) {
        interpolateColumn(x);
        x += 2;
        if ((Date.now() - start) > 1000) { //MAX_TASK_TIME) {
          setTimeout(batchInterpolate, 25);
          return;
        }
      }
      createField(columns, bounds, callback);
    })();
  };
  let canvasLayerBuilder = function () {
    function leafletBuilder() {
      var canvas = L.DomUtil.create("canvas", "can");
    }
  }
};
