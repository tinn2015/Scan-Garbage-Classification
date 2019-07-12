const cloud = require('wx-server-sdk')
cloud.init()
exports.main = async (event) => {
  const { ENV, OPENID, APPID } = cloud.getWXContext()
  // 更新默认配置，将默认访问环境设为当前云函数所在环境
  cloud.updateConfig({
    env: ENV
  })
  // ...
  return {
    ENV,
    OPENID,
    APPID,
  }
}