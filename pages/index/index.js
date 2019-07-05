//index.js
//获取应用实例
const app = getApp()
// import * as cocoSsd from '@tensorflow-models/coco-ssd'
import regeneratorRuntime from '../../utils/runtime'

Page({
  data: {
    motto: 'tab me',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    result: '未识别',
    accessToken: ''
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  routerHome: function () {
    wx.navigateTo({
      url: '../home/index'
    })
  },
  getBaiduAccessToken () {
    let url = 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=SVSnH5r6XEQdNfabZCGZOzTG&client_secret=8aKcmnV41jNsIO8Sxm9jLhhEIU0AcyIB'
    let that = this
    wx.request({
      url: url,
      method: 'POST',
      success (res) {
        console.log(res)
        that.accessToken = res.data.access_token
      }
    })
  },
  getImage () {
    let that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        let file = res.tempFiles[0]
        let fileManager = wx.getFileSystemManager()
        let base64Image = fileManager.readFileSync(file.path, 'base64')
        console.log(base64Image)
        that.discern(base64Image)
      }
    })
  },
  async discern (base64Image) {
    let imageUrlEncode = encodeURIComponent(base64Image)
    // let $ = wx.createSelectorQuery()
    // const img = $.select('#img');

    // // Load the model.
    // const model = await cocoSsd.load();
    // console.log('discern', model)

    // // // Classify the image.
    // const predictions = await model.detect(img);

    // // console.log('Predictions: ');
    // console.log(predictions);
    let baiduHost = 'https://aip.baidubce.com/rest/2.0/image-classify/v2/advanced_general?access_token=' + this.accessToken
    let data = "image=" + imageUrlEncode
    wx.request({
      url: baiduHost,
      method: 'POST',
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        console.log(res)
      }
    })
  },
  onLoad: function () {
    this.getBaiduAccessToken()
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
