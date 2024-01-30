const path = require('node:path');
const mergeConfig = require('./webpack.common');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const config = mergeConfig({
  mode: 'development',
  devServer: {
    static: { // 指定服务器文件基础的目录
      directory: path.join(__dirname, 'dist'),
    },
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        pathRewrite: { '^/api': '/' },
        // changeOrigin: true,
      }
    },
    port: 9090, // 指定服务端口
    hot: true, // 使用热更新
  },
  devtool: 'source-map', // 便于代码调试
  performance: {
    maxEntrypointSize: 1024 * 1024 * 1, // 设置最大入口文件的大小，超出会警告
    maxAssetSize: 1024 * 1024 * 1 // 设置最大资源文件的大小，超出会警告
  }
});

// https://www.npmjs.com/package/@pmmmwh/react-refresh-webpack-plugin
config.plugins.push(new ReactRefreshWebpackPlugin())

module.exports = config;
