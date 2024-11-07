import * as echarts from '../../ec-canvas/echarts';//需要注意这个地方的路径不用引用错误了
const { accountDetail,getCount,getDayCount } = require('../../http/api')
var enc = []

Page({
  data: {
    isvisible:false,
    methodCount:[],
    accountByOrder:[],
    sumMoney:0,
    nowDays:[],
    beforeDays:0,
    before:0,
    after:0,
    year:0,
    month:0,
    isincome:0,
    enc:[],
    week:["周一","周二","周三","周四","周五","周六","周日"],
    monthText:['','一','二','三','四','五','六','七','八','九','十','十一','十二'],
    accountDay:[],
    dayChecked:0,
    consumePayMoney:0,
    consumePaySum:0,
    ec1: {
      lazyLoad: true
    },
    show:false,
    currentDate: new Date().getTime(),
    minDate: new Date(2022,0,1).getTime(),
    maxDate: new Date().getTime(),
    login:true
  },
  getOption:function(){
    var option = {
      series: [{
        type: 'pie',//指定类型为饼状图
        clockWise: true,
        startAngle:60,
        minAngle:15,
        avoidLabelOverlap: true,
        radius: [20, 60],//指定半径，注意不建议直接指定px，不利于自适应。
        left: 'center',
        width: 400,
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 1
        },
        hoverAnimation: false,
        data: enc
      }]
    };
    return option;
  },
  onInput(e){
    let time = e.detail
    let date = new Date(time)
    let year = date.getFullYear()
    let month = date.getMonth()+1
    this.setData({
      year:year,
      month:month,
      show:false
    })
    this.clearDay()
    this.calendar(year,month)
    this.onShow()
  },
  //绘制环形图
  initChart:function() {
    this.barComponent.init((canvas, width, height,dpr) => {
        // 初始化图表
        const Chart = echarts.init(canvas, null, {
          width: width,
          height: height,
          devicePixelRatio: dpr //让echarts图表变清晰
        });
      //获取数据
        Chart.setOption(this.getOption());
        // 注意这里一定要返回 chart 实例，否则会影响事件处理等
        return Chart;
      });
  },
  onLoad(){
    var date = new Date()
    var year = date.getFullYear()
    var month = date.getMonth()+1
    this.calendar(year,month)

    //注意mychart-dom-bar是wxml中对应图表的id
    this.barComponent = this.selectComponent('#mychart-dom-pie');
  },
  onReady() {
  },
  calendar(year,month){
    var that = this
    var week = this.getFirstDateWeek(year,month)
    if(week==0){
      week=7
    }
    that.setData({
      beforeDays:that.getDateLen(year,month-1),
      before:week-1,
      after:43-that.getDateLen(year,month)-week,
      year:year,
      month:month
    })
  },
  getDateLen(year, month) {
    let actualMonth = month - 1;
    let timeDistance = new Date(year, month) - new Date(year, actualMonth);
    return timeDistance / (1000 * 60 * 60 * 24);
  },
  getFirstDateWeek(year, month) {
    return new Date(year, month - 1, 1).getDay()
  },
  clearDay(){
    this.setData({
      dayChecked:0,
      accountDay:[],
    })
  },
  onShow(){
    this.clearDay()

    this.getAccountCount()
    if (typeof this.getTabBar === 'function' &&  this.getTabBar()) {
      this.getTabBar().setData({
        current: 'count'
      })
    }
  },
  getAccountCount(){
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    this.setData({
      isvisible:false
    })
    var that = this
    var user = wx.getStorageSync('userInfo')
    if(user){
      this.setData({
        login:true
      })
      getCount({isincome:that.data.isincome,uid:user.uid,year:that.data.year,month:that.data.month}).then(res=>{
        var method = res.data.obj.moneyByMethod
          if(res){
            that.setData({
              consumePaySum:0,
              consumePayMoney:0
            })
            var order = res.data.obj.accountByOrder.map(function(map){if(map.consumePay=='true'){return map.money}})
            order = order.filter(o=>o!=null)
            if(order.length!=0){
              var consumePayMoney = order.reduce((a,b)=>a+b)
              that.setData({
                consumePayMoney:consumePayMoney,
                consumePaySum:order.length
              })
            }
  
            if(res.data.obj.moneyByMethod.length!=0){
              var money = res.data.obj.moneyByMethod.map(function(map){return map.sunMoney})
              var sumMoney = money.reduce((a,b)=>a+b)
              
              that.setData({
                enc:[],
                sumMoney:sumMoney,
              })
              for(var i=0;i<method.length;i++){
                let canvas = "enc["+i+"]"
                that.setData({
                  [canvas]:{name:method[i].pname,value:method[i].sunMoney}
                })
              }
              
              enc = that.data.enc
              
            }else{
              enc = []
            }
            that.initChart()
            
            that.setData({
              nowDays:res.data.obj.calendar,
              methodCount:method,
              accountByOrder:res.data.obj.accountByOrder,
            })
          }
      })
      // wx.request({
      //   url: getApp().globalData.url+'/account/count',
      //   data:{isincome:that.data.isincome,uid:user.openId,year:that.data.year,month:that.data.month},
      //   success(res){
          
      //   }
      // })
    }else{
      // wx.switchTab({
      //   url: '../mine/index',
      // })
      that.setData({
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
  },
  comsumePay(){
    wx.navigateTo({
      url: '../order/index?isincome='+this.data.isincome+'&year='+this.data.year+'&month='+this.data.month+'&sumMoney='+this.data.consumePayMoney+'&consumePay=true',
    })
  },
  countPay(e){
    this.setData({
      isincome:e.currentTarget.dataset.isincome,
    })
    this.clearDay()
    this.onShow()
  },
  detailDay(e){
    var that = this
    var day = e.currentTarget.dataset.day
    if(e.currentTarget.dataset.check==that.data.dayChecked){
      that.clearDay()
    }else{
      var user = wx.getStorageSync('userInfo')
      getDayCount({day:day,isincome:that.data.isincome,uid:user.uid}).then(res=>{
        that.setData({
          accountDay:res.data.obj,
          dayChecked:e.currentTarget.dataset.check
        })
      })
    }
  },
  goOrder(e){
    var index = e.currentTarget.dataset.index
    getApp().globalData.order=this.data.methodCount[index]
    wx.navigateTo({
      url: '../order/index?isincome='+this.data.isincome+'&year='+this.data.year+'&month='+this.data.month+'&sumMoney='+this.data.methodCount[index].sunMoney,
    })
  },
  goDetail(e){
    wx.navigateTo({
      url: '/pages/detail/index?aid='+e.currentTarget.dataset.number,
    })
  },
  beforeMonth(){
    var year = this.data.year
    var month = this.data.month
    if(month!=10||year!=2021){
      if(month==1){
        month=12
        year=year-1
      }else{
        month=month-1
      }
      this.clearDay()
      this.calendar(year,month)
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
      this.clearDay()
      this.calendar(year,month)
      this.onShow()
    }else{
      console.log("无法显示超过当前月份的信息哦！")
    }
  },
  showDate(){
    this.setData({
      show:true
    })
  },
  close(){
    this.setData({
      show:false
    })
  },
  orderAll(){
    getApp().globalData.order=null
    wx.navigateTo({
      url: '../order/index?isincome='+this.data.isincome+'&year='+this.data.year+'&month='+this.data.month+'&sumMoney='+this.data.sumMoney,
    })
  }
});

