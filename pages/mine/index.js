// pages/mine/index.js
const { $Toast } = require('../../dist/base/index');
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
const { userLogin,getMine,upBudget,inviteCheck,inviteAdd } = require('../../http/api')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:'', //用户信息
    day:0, //记账天数
    count:0, //记账笔数
    version:'',
    mine:false, //页面可见性
    budget:0, //我的预算
    pay:{}, //支出金额
    invited:false, //邀请框可见性
    value: 25,
    gradientColor: {
      '0%': '#ffd01e',
      '100%': '#ee0a24',
    }, //环形进度条颜色
    show:false, //预算修改框可见性
    newBudget:0, //存入用户正在修改的预算，确认之后在更新到budget中
    bid:0 //账本id，用来判断用户的邀请信息是否存在
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let that = this
    const accountInfo = wx.getAccountInfoSync();
    this.setData({
      version:accountInfo.miniProgram.version
    })
    var user = wx.getStorageSync('userInfo')
    if(user){
      this.setData({
        mine:true
      })
    }
    if(options.code!=null&&options.code!=''){
      inviteCheck({code:options.code,bid:options.bid,uid:user.openId}).then(res=>{
        that.setData({
          invited:true,
          bid:options.bid
        })
      })
      // wx.request({
      //   url: getApp().globalData.url+'/have/check',
      //   data:{code:options.code,bid:options.bid,uid:user.openId},
      //   success(res){
      //     if(res.data.code==200){

      //     }else{
      //       $Toast({
      //         content: res.data.msg,
      //       });
      //     }
      //   }
      // })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  join(){
    let that = this
    let user = wx.getStorageSync('userInfo')
    inviteAdd({bid:that.data.bid,uid:user.openId,host:false}).then(res=>{
      $Toast({
        content: "加入账本成功",
        type:'success'
      });
    })
    this.close()
  },
  close(){
    this.setData({
      invited:false
    })
  },
  newGetUserProfile(e){
    var that = this
    wx.login({
      success:function(res){
        if(res){
          wx.showLoading({
            title: '正在授权中...',
          })
          userLogin({
            code:res.code,
          }).then(res=>{
            wx.showToast({
              title: '登录成功',
            })
            const loginUser = res.data.obj
            that.setData({
              user:loginUser
            })
            wx.setStorage({
              key:"userInfo",
              data:loginUser
            })
            setTimeout(() => {
              that.onShow()
            }, 1500);
          })
        }else{
          console.log("登录失败！"+res.errMsg)
        }
      }
    })
  },
  getUserProfile(e){
    var that = this
    wx.getUserProfile({
      lang: 'zh_CN',
      desc:'Wexin',  
      success:res=>{
        var currentUser = res.userInfo
        wx.login({
          success:function(res){
            if(res){
              wx.showLoading({
                title: '正在授权中...',
              })
              userLogin({
                code:res.code,
                nickName:currentUser.nickName,
                head:currentUser.avatarUrl
              }).then(res=>{
                wx.showToast({
                  title: '登录成功',
                })
                currentUser['openId'] = res.data.obj
                that.setData({
                  user:currentUser
                })
                wx.setStorage({
                  key:"userInfo",
                  data:currentUser
                })
              })
              // wx.request({
              //   url: getApp().globalData.url+'/login',
              //   data:{
              //     code:res.code,
              //     nickName:currentUser.nickName,
              //     head:currentUser.avatarUrl
              //   },
              //   success(loginSuccess){

              //   }
              // })
              setTimeout(() => {
                that.onShow()
              }, 1500);
            }else{
              console.log("登录失败！"+res.errMsg)
            }
          }
        })},
        fail: (err) => {
          wx.showToast({
            title: '授权后即可开始记账哦!',
            icon: 'none'
          })
          console.log(err, 'err');
        }
    })
  },
  goIOU(){
    wx.navigateTo({
      url: '../iou/index',
    })
  },
  goBook(){
    wx.navigateTo({
      url: '../book/book/index',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    var user = wx.getStorageSync('userInfo')
    wx.showLoading({
      title: '数据加载中...',
    })
    this.setData({
      mine:false
    })
    if(user){
      that.setData({
        user:user
      })
      getMine({
        uid:user.uid,
        year:new Date().getFullYear(),
        month:new Date().getMonth()+1
      }).then(res=>{
        that.setData({
          day:res.data.obj.day,
          count:res.data.obj.count,
          budget:res.data.obj.budget,
          pay:res.data.obj.pay
        })
      })
    }
    setTimeout(() => {
      wx.hideLoading({
        success: (res) => {
          that.setData({
            mine:true
          })
        },
      })
    }, 350);

    if (typeof this.getTabBar === 'function' &&  this.getTabBar()) {
      this.getTabBar().setData({
        current: 'mine'
      })
    }
  },
  logout(){
    wx.removeStorageSync('userInfo')
    this.setData({
      user:''
    })
    this.onShow()
  },
  about(){
    wx.navigateTo({
      url: '../about/index',
    })
  },
  showBudget(){
    let that = this
    this.setData({
      show:true,
      newBudget:that.data.budget
    })
  },
  editBudget(){
    let that = this
    let user = wx.getStorageSync('userInfo')
    this.setData({
      budget:this.data.newBudget,
      show:false
    })
    upBudget({uid:user.openId,budget:that.data.budget}).then(res=>{
      $Toast({
        content: res.data.obj,
        type: "success"
      });
    })
    // wx.request({
    //   url: getApp().globalData.url+'/user/budget',
    //   data:{uid:user.openId,budget:that.data.budget},
    //   success(res){
    //     console.log(res)
    //     if(res.data.code==200){
    //       $Toast({
    //         content: res.data.obj,
    //         type: "success"
    //       });
    //     }else{
    //       $Toast({
    //         content: "修改失败",
    //         type: "error"
    //       });
    //     }
    //   }
    // })
  },
  budgetInput(e){
    this.setData({
      newBudget:e.detail
    })
  },
  closeBudget(){
    this.setData({
      show:false
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
  share(){
    console.log(1)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    return{
      title:"快来\"记账猪\"记录吧！",
      path:'pages/mine/index',
      imageUrl:'https://pic.imgdb.cn/item/622434515baa1a80ab118efc.png',
      success(e){
        console.log(e)
      }
    }
  }
})