// 引入path模块
const path = require('path')

function resolve(dir) {
  // join(__dirname) 设置绝对路径。 dirname代表当前所在文件路径
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  assetsDir: "static",
  outputDir: 'dist',
  chainWebpack: (config) => {
    config.resolve.alias
      .set('_req', resolve('src/request'))
  }
}