(function () {
  var r = new RegExp("(^|(.*?\\/))(include-trdlibs\.js)(\\?|$)"), s = document
    .getElementsByTagName('script'), src, m, targetScript;
  for (var i = 0; i < s.length; i++) {
    src = s[i].getAttribute('src');
    if (src) {
      m = src.match(r);
      if (m) {
        relativePath = m[1] || "./";
        targetScript = s[i];
        break;
      }
    }
  }

  function inputScript(inc) {
    let script = '<' + 'script type="text/javascript" src="' + relativePath
      + inc + '"' + '><' + '/script>';
    document.writeln(script);
  }

  function inputCSS(style) {
    let css = '<' + 'link rel="stylesheet" href="' + relativePath
      + style + '"' + '><' + '/>';
    document.writeln(css);
  }

  function inArray(arr) {
    for (let index in arr) {
      switch (arr[index]) {
        case 'mapv':
          inputScript('mapv/mapv.min.js');
          break;
        case 'proj':
          inputScript("proj/proj4-src.js");
          inputScript("proj/proj4leaflet.js");
          break;
        case 'echart':
          inputScript("echart/echarts.min.js");
          break;
        case 'd3':
          inputScript("d3/d3.min.js");
          break;
      }
    }
  }

  // 加载类库资源文件
  function load() {
    let includes = (targetScript.getAttribute('include') || "").split(",");
    inArray(includes);
  }

  load();
})();
