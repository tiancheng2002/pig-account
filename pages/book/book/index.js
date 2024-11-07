// pages/book/index.js
import Toast from '@vant/weapp/toast/toast';
const { getBook } = require('../../../http/api')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myBooks:[], //我的所有账本
    joinBooks:[], //我加入的所有账本
    default:0, //默认账本id
    visible:false, //页面可见性
    login:false //是否登录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    var that = this
    let user = wx.getStorageSync('userInfo')
    wx.showLoading({
      title: '加载账本中',
    })
    this.setData({
      visible:false
    })
    if(user){
      getBook({uid:user.uid}).then(res=>{
        //将获取到的数据进行分类，个人以及团体的
        var book = res.data.obj.books
        var myBooks = book.filter(o=>o.host==true)
        var joinBooks = book.filter(o=>o.host==false)
        that.setData({
          myBooks:myBooks,
          joinBooks:joinBooks,
          default:res.data.obj.default_book,
          login:true
        })
      })
    }
    setTimeout(() => {
      wx.hideLoading({
        success: (res) => {
          that.setData({
            visible:true
          })
        },
      })
    }, 350);
  },
  bookDetail(e){
    let book = e.currentTarget.dataset.book
    console.log(book)
    wx.navigateTo({
      url: '../account/index?book='+JSON.stringify(book),
    })
  },
  addBook(){
    wx.navigateTo({
      url: '../add/index',
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})