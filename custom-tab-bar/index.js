// pages/tab-bar/tab-bar.js
var app = getApp()
Component({

  /**
   * 页面的初始数据
   */
  data: {
    current: 'index',
    heightEquals:app.globalData.heightEquals
  },
  methods:{
    handleChange ({ detail }) {
      var key = detail.key
      console.log("key",key)
      getApp().globalData.current = key
      wx.switchTab({
        url: '../'+key+'/index',
      })
    },
  }

})