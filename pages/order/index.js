// pages/order/index.js
const { accountOrder } = require('../../http/api')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order:null, //表示要排序的信息
    select:[{name:"按金额",value:"money"},{name:"按时间",value:"time"}], //排序选择条件
    selector:"money", //默认排序条件
    account:[], //账单信息
    month:0, //月份
    year:0, //年份
    isincome:0, //支出或收入（类型）
    sumMoney:0, //总金额
    pageSize:10, //显示账单个数
    pid:0, //用来区分查看账单类型的id
    height:'', //表示当前设备的高度
    low:'' //表示是否显示加载动画
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var order = getApp().globalData.order
    if(order!=null){
      this.setData({
        order:getApp().globalData.order,
        pid:order.pid
      })
    }
    if(options.consumePay){
      this.setData({
        pid:-1
      })
    }
    this.setData({
      year:options.year,
      month:options.month,
      isincome:options.isincome,
      sumMoney:options.sumMoney,
      height:wx.getSystemInfoSync().windowHeight
    })
    console.log(this.data.sumMoney)
  },
  lower(){
    var that = this
    if(that.data.pageSize<that.data.account.length){
      setTimeout(() => {
        that.setData({
          pageSize:that.data.pageSize+10
        })
      }, 1000);
    }else{
      that.setData({
        low:false
      })
    }
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
    wx.showLoading({
      title: '加载中...',
    })
    var that = this
    var user = wx.getStorageSync('userInfo')
    accountOrder({year:that.data.year,
      month:that.data.month,
      isincome:that.data.isincome,
      uid:user.uid,
      selector:that.data.selector,
      pid:that.data.pid}).then(res=>{
        var load = false
        if(res.data.obj.length>that.data.pageSize){
          load = true
        }
        that.setData({
          account:res.data.obj,
          low:load
        })
      })
      // wx.request({
      //   url: getApp().globalData.url+'/account/order',
      //   data:{year:that.data.year,
      //         month:that.data.month,
      //         isincome:that.data.isincome,
      //         uid:user.openId,
      //         selector:that.data.selector,
      //         pid:that.data.pid},
      //   success(res){

      //   }
      // })
    wx.hideLoading({
      success: (res) => {},
    })
  },
  checkSelect(e){
    this.setData({
      selector:e.currentTarget.dataset.select
    })
    this.onShow()
  },
  goDetail(e){
    wx.navigateTo({
      url: '/pages/detail/index?aid='+e.currentTarget.dataset.id,
    })
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