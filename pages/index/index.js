//获取应用实例
const app = getApp()
import trashClasses from '../../utils/trashClass'
import util from '../../utils/util'

Page({
  data: {
    discernResult: {
      list: [],
      type: ''
    },
    accessToken: '',
    currentImage: '',
    selectFile: null
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
        that.setData({
          'discernResult.type': '',
          currentImage: file.path
        })
        that.discern(base64Image)
      }
    })
  },
discern (base64Image) {
    let that = this
    let imageUrlEncode = encodeURIComponent(base64Image)
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
        console.log(res.data)
        let result = res.data.result
        let resultNameString = ''
        result.forEach(i => {
          resultNameString += i.keyword
        })
        let key = util.formatStringsNumber(resultNameString)[0].key
        console.log('max string:', key)
        that.filterResult(key)
        that.setData({
          'discernResult.list': result,
        })
      }
    })
  },
  filterResult (key) {
    // let keys = this.discernResult
    let findFlag = false
    trashClasses.forEach(i => {
      if (i.name.indexOf(key) > 0) {
        findFlag = true
        this.setData({
          'discernResult.type': i.type
        })
      }
    })
    if (!findFlag) {
      this.setData({
        'discernResult.type': '未识别'
      })
    }
    // if (!this.discernResult.type) {
    //   that.setData({
    //     'discernResult.type': '未识别'
    //   })
    // }
  },
  onLoad: function () {
    this.getBaiduAccessToken()
  }
})
