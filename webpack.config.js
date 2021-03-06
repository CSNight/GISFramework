/* global __dirname, require, module*/

// eslint-disable-next-line no-unused-vars
const path = require('path');
const env = require('yargs').argv.env; // use --env with webpack 2
// const Ex = require("extract-text-webpack-plugin");//css单独打包
let libraryName = 'tmap';

let outputFile, mode;

if (env === 'build') {
  mode = 'production';
  outputFile = libraryName + '.min.js';
} else {
  mode = 'development';
  outputFile = libraryName + '.js';
}

const config = {
  mode: mode,
  entry: __dirname + '/src/index.js',
  devtool: 'inline-source-map',
  output: {
    path: __dirname + '/docs/t-gis',
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: 'typeof self !== \'undefined\' ? self : this'
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/
      }, {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
        // use: ExtractTextPlugin.extract({  //css单独打包
        //   fallback: "style-loader",
        //   use: "css-loader"
        // })
      }, {
        test: /\.(png|svg|jpg|gif)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 0,
            name: 'images/[name].[ext]', // 利用[path]路径获取文件夹名称并设置文件名
            fallback: 'file-loader',  // 当超过8192byte时，会回退使用file-loader
            context: path.resolve(__dirname, '../src'),//过滤掉[path]的相对路径
            publicPath: './t-gis' //采用根路径
          }
        }]
      }
    ]
  },
  // plugins: [
  //   new Ex("tmap.css"),//打包后的文件名 css单独打包
  // ],
  resolve: {
    modules: [path.resolve('./node_modules'), path.resolve('./src')],
    extensions: ['.json', '.js']
  }
};

module.exports = config;
