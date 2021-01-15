//服务器会将任何未知请求 (没有匹配到静态文件的请求) 代理到http://localhost:8080上
const webpack = require('webpack')
module.exports = {
  publicPath: './',
  devServer: {
    proxy: {
      '/': { // 配置的变量/api
        target: 'http://192.168.31.151:8888', // 需要请求的第三方接口 https://travel.gxucreate.com/travelbh
        changeOrigin: true, // 开启代理：
        pathRewrite: { // 这里重写路径，如果api本身不存在接口路径中，一定要写成空！！！
          '/': ''
        },
        ws: false
      }
    }
  },
  //富文本编辑器图片大小修改
  chainWebpack: config => {
    config.plugin('provide').use(webpack.ProvidePlugin, [{
      'window.Quill': 'quill/dist/quill.js',
      'Quill': 'quill/dist/quill.js'
    }])
  }
}