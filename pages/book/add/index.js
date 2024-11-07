// pages/book/add/index.js
const { $Toast } = require('../../../dist/base/index');
import Notify from '@vant/weapp/notify/notify';
const { setDefaultBook,bookDetail,bookImages,bookAction } = require('../../../http/api')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bname: '', //账本名称
    description:'', //账本描述
    maxNum:'', //账本最大加入人数
    bimg:"http://image.xiaozhu02.top/Bicon1.jpg", //账本图片
    type:'私人', //类型名称
    tid:0, //类型id
    types: ['私人','公共'], //账本所有类型
    visible:false, //页面可见性
    bid:0, //账本id，用来记录要修改账本的id
    members:0, //账本成员
    imgs:[], //账本所有图片
    show:false, //账本类型遮罩层
    bottom:false //底部是否要设置距离，苹果手机的home键可能会遮挡
  },
  changeType(event) {
    const { picker, value, index } = event.detail;
    this.setData({
      type:value,
      tid:index,
      visible:false
    })
  },
  checkType(){
    console.log(this.data.members)
    if(this.data.members=1){
      this.setData({
        visible:true
      })
    }
  },
  close(){
    this.setData({
      visible:false
    })
  },
  addBook(){
    if(this.data.bname==''){
      Notify({
        message: '账本名称不能为空',
        background: '#ff9900',
      });
    }else{
      let that = this
      let user = wx.getStorageSync('userInfo')
      bookAction({
        bid:that.data.bid,
        bname:that.data.bname,
        book_description:that.data.description,
        bimg:that.data.bimg,
        type:that.data.tid,
        uid:user.uid
      }).then(res=>{
        $Toast({
          content: "操作成功",
          type: "success"
        });
        setTimeout(() => {
          if(that.data.bid!=0){
            wx.navigateBack({
              delta: 2,
            })
          }else{
            wx.navigateBack({
              delta: 1,
            })
          }
        }, 1000);
      })
    }
  },
  onClick(){
    this.setData({
      show:false
    })
  },
  inputName(e){
    this.setData({
      bname:e.detail
    })
  },
  inputDesc(e){
    this.setData({
      description:e.detail
    })
  },
  defaultBook(){
    let that = this
    let user = wx.getStorageSync('userInfo')
    setDefaultBook({uid:user.uid,bid:that.data.bid}).then(res=>{
      $Toast({
        content: "设置成功",
        type: "success"
      });
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      bottom:getApp().globalData.heightEquals
    })
    if(options.bid!=null){
      this.setData({
        bid:options.bid
      })
    }
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
    if(this.data.bid!=0){
      let that = this
      bookDetail({bid:that.data.bid}).then(res=>{
        let book = res.data.obj
        that.setData({
          bname:book.bname,
          description:book.book_description,
          bimg:book.bimg,
          tid:book.type,
          type:that.data.types[book.type],
          members:book.members
        })
      })
    }
  },
  showImg(){
    wx.showLoading({
      title: '加载图标中',
    })
    let that = this
    bookImages({}).then(res=>{
      that.setData({
        imgs:res.data.obj,
        show:true
      })
    })
    wx.hideLoading({
      success: (res) => {},
    })
  },
  checkImg(e){
    let that = this
    let index = e.currentTarget.dataset.img
    this.setData({
      bimg:that.data.imgs[index],
      show:false
    })
  },
  onClickHide(){
    this.setData({
      show:false
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