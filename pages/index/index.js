//获取应用实例
const app = getApp()
import trashClasses from '../../utils/trashClass'
import util from '../../utils/util'
import Toast from '../../components/vant/toast/toast'

Page({
  data: {
    discernResult: {
      list: [],
      type: ''
    },
    accessToken: '',
    currentImage: '',
    detailVisible: false,
    detailImg: '',
    searchValue: '',
    toastVisible: false
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
          currentImage: file.path,
          toastVisible: true
        })
        that.discern(base64Image)
        Toast.loading({
          mask: false,
          duration: 0,
          message: '努力识别中...'
        })
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
        // let resultNameString = ''
        // result.forEach(i => {
        //   resultNameString += i.keyword
        // })
        // let key = util.formatStringsNumber(resultNameString)[0].key
        // console.log('max string:', key)
        // that.filterResult(key)
        result.forEach(i => {
          i.type = that.getType(i.keyword)
        })
        that.setData({
          'discernResult.list': result,
          toastVisible: false
        })
      }
    })
  },
  getType (key) {
    let type = '未识别'
    trashClasses.forEach(i => {
      if (i.name.indexOf(key) > -1) {
        type = i.type
      }
    })
    return type
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
  showDetail (e) {
    let url = e.currentTarget.dataset.url
    console.log(url)
    this.setData({
      detailVisible: true,
      detailImg: url
    })
  },
  searchInput (e) {
    let val = e.detail.value
    util.throttle(this.setValue, this, val, 500)
    console.log(e.detail.value)
  },
  setValue (data) {
    console.log(data, 'serValue')
    this.setData({
      searchValue: data,
      'discernResult.type': null,
      'discernResult.list': [],
      currentImage: ''
    })
  },
  doSearch () {
    let value = this.data.searchValue
    for (let i = 0; i < trashClasses.length; i++) {
      let item = trashClasses[i]
      if (item.name.indexOf(value) > 0) {
        this.setData({
          'discernResult.type': item.type
        })
        return
      }
    }
  },
  onLoad: function () {
    this.getBaiduAccessToken()
  },
  onShow: function () {
    this.setData({
      discernResult: {
        list: [],
        type: ''
      },
      currentImage: '',
      detailVisible: false,
      detailImg: '',
      searchValue: '',
      toastVisible: false
    })
  }
})
