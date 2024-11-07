// pages/detail/index.js
const { $Message } = require('../../dist/base/index');
const { accountDetail,delAccount } = require('../../http/api')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:'',
    visible5:false,
    pname:'',
    del:false,
    user:{},
  },
  delete () {
    this.setData({
        visible5: true
    });
  },
  editor(){
    getApp().globalData.detail = this.data.detail
    wx.navigateTo({
      url: '../account/index',
    })
  },
  close(){
    this.setData({
      visible5:false
    })
  },
  handleClick5 () {
    wx.showLoading({
      title: '正在删除中',
    })
    var that = this
    if(!that.data.del){
      this.setData({
          del:true,
          visible5: false
      });
      delAccount({aid:that.data.detail.aid}).then(res=>{
        setTimeout(() => {
          wx.hideLoading({
            success: (res) => {},
          })
          $Message({
            content: '删除成功！',
            type: 'success'
          });
        }, 1000);
      })
      setTimeout(() => {
        wx.navigateBack({
          delta: 1,
        })
      }, 2000);
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    accountDetail({aid:options.aid}).then(res=>{
      that.setData({
        detail:res.data.obj,
        pname:getApp().globalData.payment[res.data.obj.payment].name
      })     
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let user = wx.getStorageSync('userInfo')
    this.setData({
      del:false,
      user:user
    })
    // console.log(getApp().globalData.detail)
      // detail:getApp().globalData.detail,
      // pname:getApp().globalData.payment[getApp().globalData.detail.payment].name,
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})