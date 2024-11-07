const util = require("./utils/util");

// app.js
App({
  onLaunch() {
    let screenHeight = wx.getSystemInfoSync().screenHeight
    let bottom = wx.getSystemInfoSync().safeArea.bottom
    this.globalData.heightEquals = screenHeight == bottom

    this.autoUpdate()
  },
  autoUpdate: function () {
    var self = this // 获取小程序更新机制兼容 
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager() //1. 检查小程序是否有新版本发布                     
      updateManager.onCheckForUpdate(function (res) { // 请求完新版本信息的回调 
        if (res.hasUpdate) { //2. 小程序有新版本，则静默下载新版本，做好更新准备                                                 
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  //3. 新的版本已经下载好，调用applyUpdate应用新版本并重启  
                  updateManager.applyUpdate()
                } else if (res.cancel) {
                  //不应用 
                }
              }
            })
          })

          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
            })
          })
        }
      })
    } else { // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示     
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  // goDetail(aid){
  //   var that = this
  //   wx.request({
  //     url: that.globalData.url+'/account/detail',
  //     data:{aid:aid},
  //     success(res){
  //       that.globalData.detail=res.data.obj
  //       wx.navigateTo({
  //         url: '/pages/detail/index',
  //       })
  //     }
  //   })
  // },
  globalData: {
    userInfo: null,
    url: 'http://192.168.15.172:9000',
    // url:'http://192.168.1.101:9000',
    detail: '',
    payment: [{
        id: 0,
        name: "现金",
        iconfont: "xianjin"
      },
      {
        id: 1,
        name: "储蓄卡",
        iconfont: "yinhangka1"
      },
      {
        id: 2,
        name: "信用卡",
        iconfont: "xinyongqia"
      },
      {
        id: 3,
        name: "微信",
        iconfont: "weixinzhifu"
      },
      {
        id: 4,
        name: "支付宝",
        iconfont: "zhifu-zhifubao"
      }
    ],
    order: null,
    current: 'index',
    heightEquals: true
  }
})