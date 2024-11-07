// pages/accout/index.js
var util = require('../../utils/util.js');
const { getAccount,getBook } = require('../../http/api')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isvisible:false,
    account:[],
    today:'',
    year:0,
    month:0,
    monthText:['','一','二','三','四','五','六','七','八','九','十','十一','十二'],
    payMoney:0,
    incomeMoney:0,
    isImage:false,
    show:false,
    books:[],
    bid:0,
    selectShow:false,//初始option不显示
    nowText:{img:'',text:'全部'},//初始内容
    radius:10,
    login: true
  },
  take(){
    var that = this
    if(wx.getStorageSync('userInfo')){
      getApp().globalData.detail=''
      wx.navigateTo({
        url: '../account/index'
      })
    }else{
      that.goLogin()
    }
  },
  goLogin(){
    wx.switchTab({
      url: '../mine/index'
    })
  },
  detail(e){
    // getApp().goDetail(e.currentTarget.dataset.number)
    wx.navigateTo({
      url: '/pages/detail/index?aid='+e.currentTarget.dataset.number,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var date = new Date()
    var year = date.getFullYear()
    var month = date.getMonth()+1
    this.setData({
      today:util.formatDate(date),
      year:year,
      month:month,
    })
  },
  onClickHide(){
    this.setData({
      show:false
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
    let pages = getCurrentPages()
    let currPage = pages[pages.length-1]
    if(currPage.data.dayOne!=null){
      let dayOne = currPage.data.dayOne==1?true:false
      this.setData({
        show:dayOne
      })
      currPage.setData({
        dayOne:0
      })
    }
    this.getAccount()
    if (typeof this.getTabBar === 'function' &&  this.getTabBar()) {
      this.getTabBar().setData({
        current: 'index'
      })
    }
  },
  getAccount(){
    wx.showLoading({
      title: '加载中...',
    })
    this.setData({
      isvisible:false,
      account:[],
      payMoney:0,
      incomeMoney:0,
      selectShow:false,
      radius:10,
      login:true
    })
    var that = this
    var user = wx.getStorageSync('userInfo')
    if(user){
      var uid = user['uid']
      var accountData={year:that.data.year,month:that.data.month,uid:uid,bid:that.data.bid}
      getAccount(accountData).then(res=>{
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
            isImage:false,
          })
        }else{
          that.setData({
            isImage:true,
          })
        }
      })
      // wx.request({
      //   url: getApp().globalData.url+'/account/time',
      //   data:{year:that.data.year,month:that.data.month,uid:uid,bid:that.data.bid},
      //   success(res){
      //     console.log(res)
      //     if(res.data.code==200){

      //     }
      //     // if(res.data){
      //     //   var payMoney = res.data.sumMoney[0]==null?0:res.data.sumMoney[0].money
      //     //   var incomeMoney = res.data.sumMoney[1]==null?0:res.data.sumMoney[1].money
      //     //   var account = res.data.resultAccount
      //     //   that.setData({
      //     //     account:account,
      //     //     payMoney:payMoney,
      //     //     incomeMoney:incomeMoney,
      //     //     isImage:false
      //     //   })
      //     // }else{
      //     //   that.setData({
      //     //     isImage:true
      //     //   })
      //     // }
      //   }
      // })
      this.getBooks()  
    }else{
      this.setData({
        login:false
      })
    }
    setTimeout(() => {
      wx.hideLoading({
        success: (res) => {
          this.setData({
            isvisible:true
          })
        },
      })
    }, 350);
    // console.log(this.data.login)
  },
  getBooks(){
    let that = this
    let user = wx.getStorageSync('userInfo')
    getBook({uid:user.uid}).then(res=>{
      that.setData({
        books:res.data.obj.books
      })
    })
  },
  changeBook(e){
    let bid = e.detail.bid
    this.setData({
      bid:bid
    })
    this.getAccount()
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
  // 下拉选择框
  　　　//option的显示与否
    selectToggle:function(){
      var nowShow=this.data.selectShow;//获取当前option显示的状态
      var radius = this.data.radius==0?20:0
      this.setData({
        selectShow: !nowShow,
        radius:radius
      })
    },
    //设置内容
    setText:function(e){
      console.log(e)
      let bid = e.currentTarget.dataset.bid
      let bname = e.currentTarget.dataset.name
      let bimg = e.currentTarget.dataset.img
      var nowText = this.data.nowText
      nowText['img']=bimg
      nowText['text']=bname
      //再次执行动画，注意这里一定，一定，一定是this.animation来使用动画
      this.setData({
        selectShow: false,
        nowText:nowText,
        bid:bid,
        radius:10
      })
      this.onShow()
      // this.triggerEvent("changeBook",{bid:bid})
    }
})