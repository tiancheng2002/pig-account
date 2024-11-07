// pages/book/account/index.js
const { $Toast } = require('../../../dist/base/index');
import Dialog from '@vant/weapp/dialog/dialog';
import Toast from '@vant/weapp/toast/toast';
var util = require('../../../utils/util.js');
const { getAccount,bookDel,bookMembers,bookCode,memberDel } = require('../../../http/api')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    book:{}, //账本信息
    account:[], //账单记录
    today:'', //今日日期
    payMoney:0, //当月支付
    incomeMoney:0, //当月收入
    host:[], //账本发起人
    members:[], //账本成员
    show:false,
    hostId:'', //账本发起人id
    user:{}, //用户
    year:new Date().getFullYear(), //年份
    month:new Date().getMonth()+1, //月份
    del:false, //删除
    bookName:'', //要删除的账本名称是否和输入的一致,
    action:'',
    monthText:['','一','二','三','四','五','六','七','八','九','十','十一','十二'], 
    visible:false,
    mem:false,
    delUid:'',
    count:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let date = new Date()
    this.setData({
      book:JSON.parse(options.book),
      today:util.formatDate(date)
    })
  },
  editBook(e){
    let bid = e.currentTarget.dataset.bid
    wx.navigateTo({
      url: '../add/index?bid='+bid,
    })
  },
  delBook(e){
    if(this.data.bookName!=this.data.book.bname){
      // console.log()
      $Toast({
        content: "账本名输入错误",
        type: 'error'
      });
    }else{
      wx.showLoading({
        title: '删除账本数据中',
      })
      let user = wx.getStorageSync('userInfo')
      let bid = this.data.book.bid
      bookDel({bid:bid,uid:user.uid}).then(res=>{
        setTimeout(() => {
          wx.hideLoading({
            success: (res) => {},
          })
          $Toast({
            content: "删除账本成功",
            type: 'success'
          });
          setTimeout(() => {
            wx.navigateBack({
              delta: -1,
            })
          }, 1000);
        }, 2000);
      })
    }
  },
  showDel(){
    this.setData({
      del:true
    })
  },
  bookNameInput(e){
    this.setData({
      bookName:e.detail
    })
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
    this.setData({
      visible:false,
      account:[],
      payMoney:0,
      incomeMoney:0
    })
    this.getAccount()
    this.members()
  },
  getAccount(){
    let that = this
    let user = wx.getStorageSync('userInfo')
    wx.showLoading({
      title: '加载中...',
    })
    this.setData({
      isvisible:false
    })
    getAccount({year:that.data.year,month:that.data.month,bid:that.data.book.bid}).then(res=>{
      if(res.data.obj.length!=0){
        var accounts = res.data.obj
        var payMoneys = accounts.map(function(map){return map.payMoney})
        var incomeMoneys = accounts.map(function(map){return map.incomeMoney})
        var payMoney = payMoneys.reduce((a,b)=>a+b)
        var incomeMoney = incomeMoneys.reduce((a,b)=>a+b)
        that.setData({
          account:accounts,
          payMoney:payMoney,
          incomeMoney:incomeMoney,
        })
      }
      that.setData({
        user:user
      })
    })
    setTimeout(() => {
      wx.hideLoading({
        success: (res) => {
          this.setData({
            isvisible:true
          })
        },
      })
    }, 500);
  },
  goinvited(){
    console.log(1)
  },
  members(){
    let that = this
    bookMembers({bid:that.data.book.bid}).then(res=>{
      let member = res.data.obj
      let host = member.filter(o=>o.host==true)
      let members = member.filter(o=>o.host==false)
      that.setData({
        host:host,
        members:members,
        hostId:host[0].uid
      })
    })
  },
  showMembers(){
    this.setData({
      show:true
    })
  },
  detail(e){
    wx.navigateTo({
      url: '/pages/detail/index?aid='+e.currentTarget.dataset.number,
    })
  },
  showDelMem(e){
    this.setData({
      mem:true,
      delUid:e.currentTarget.dataset.uid,
      count:e.currentTarget.dataset.count,
      action:e.currentTarget.dataset.action
    })
  },
  close(){
    this.setData({
      mem:false,
      delUid:''
    })
  },
  delMember(){
    let that = this
    wx.showLoading({
      title: that.data.action=='remove'?'移除成员中':'退出账本中',
    })
    let user = wx.getStorageSync('userInfo')
    memberDel({
      bid:that.data.book.bid,
      uid:that.data.delUid,
      hostId:user.uid,
      count:that.data.count,
      action:that.data.action
    }).then(res=>{
      setTimeout(() => {
        wx.hideLoading({
          success: (res) => {},
        })
        if(res.data.code==200){
          Toast.success({
            message:res.data.obj,
            duration:1000
          });
        }else{
          Toast.fail({
            message:res.data.msg,
            duration:1000
          });
        }
        that.setData({
          show:false
        })
      }, 2000);
    })
    setTimeout(() => {
      wx.navigateBack({
        delta: -1,
      })
    }, 3000);
  },
  onClickHide(){
    this.setData({
      show:false
    })
  },
  beforeMonth(){
    var year = this.data.year
    var month = this.data.month
    if(month!=1||year!=2022){
      if(month==1){
        month=12
        year=year-1
      }else{
        month=month-1
      }
      this.setMonth(year,month)
      this.clearMoney()
      this.onShow()
    }else{
      console.log("已经到头啦！")
    }
  },
  nextMonth(){
    var year = this.data.year
    var month = this.data.month
    var nowMonth = new Date()
    if(nowMonth.getMonth()+1!=month||nowMonth.getFullYear()!=year){
      if(month==12){
        month=1
        year=year+1
      }else{
        month=month+1
      }
      this.setMonth(year,month)
      this.clearMoney()
      this.onShow()
    }else{
      console.log("无法显示超过当前月份的信息哦！")
    }
  },
  setMonth(year,month){
    this.setData({
      year:year,
      month:month,
    })
  },
  clearMoney(){
    this.setData({
      payMoney:0,
      incomeMoney:0,
      isImage:false,
      account:[]
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
  getBookCode(){
    let that = this
    return new Promise(function(resolve,reject){
      bookCode({bid:that.data.book.bid}).then(res=>{
        if(res.data.code==200){
           resolve(res.data.obj)
        }else{
          reject()
        }
      })
    })
  },
  /**
   * 用户点击右上角分享
   */
  async onShareAppMessage() {
    let that = this
    let code = await this.getBookCode()
    const obj = {
      title:"快加入跟我一起记账吧！",
      path:'pages/mine/index?code='+code+'&bid='+that.data.book.bid,
      imageUrl:'https://pic.imgdb.cn/item/622434515baa1a80ab118efc.png',
    }
    return obj
  }
})