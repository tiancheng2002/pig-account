// index.js
// 获取应用实例
const app = getApp()
const { $Message } = require('../../dist/base/index');
const { $Toast } = require('../../dist/base/index');
const util = require('../../utils/util')
const { getBook,getIouDetail,getMethods,takeAccount } = require('../../http/api')
Page({
  data: {
    money:"0",
    firstMoney:'',
    lastNumber:'',
    input:[{id:1,have:[{text:"1",bindtap:"setMoney"},{text:"2",bindtap:"setMoney"},{text:"3",bindtap:"setMoney"},{text:"今日",bindtap:"showDate",class:'input_button day'}]},{id:2,have:[{text:"4",bindtap:"setMoney"},{text:"5",bindtap:"setMoney"},{text:"6",bindtap:"setMoney"},{text:"+",bindtap:"setMoney"}]},{id:3,have:[{text:"7",bindtap:"setMoney"},{text:"8",bindtap:"setMoney"},{text:"9",bindtap:"setMoney"},{text:"-",bindtap:"setMoney"}]},{id:4,have:[{text:".",bindtap:"setMoney"},{text:"0",bindtap:"setMoney"},{text:"清零",bindtap:"clearMoney"},{text:"记账",bindtap:"takeAccount",class:'input_button account'}]}],
    index:null,
    pay:[{id:0,text:"支出"},{id:1,text:"收入"}],
    payChecked:0,
    methodChecked:null,
    remark:'',
    payment:[],
    date:"今日",
    pay_methods:[],
    aid:0,
    did:0,
    action:"in",
    switch:false,
    visible:false,
    modal:[{name:"确定",color:"#19be6b"},{name:"取消"},],
    debit:'',
    return:'',
    peo:'',
    payMethodHeight:0,
    today:'',
    heightEquals:true,
    books:[],
    show:false,
    bDefault:0,
    minDate:new Date(2022,0,1).getTime(),
    maxDate:new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()).getTime(),
    navigationHeight:0,
    selectShow:false,//初始option不显示
    nowText:{bid:0,img:'',text:'选择账本'},//初始内容
    radius:10
  },
  onLoad() {
    let that = this
    wx.getSystemInfoAsync({
      success: (result) => {
        that.setData({
          navigationHeight:result.statusBarHeight
        })
      },
    })
    var date = new Date();
    this.setData({
      payMethodHeight:wx.getSystemInfoSync().windowHeight-406-wx.getSystemInfoSync().statusBarHeight,
      navigationHeight:wx.getSystemInfoSync().statusBarHeight,
      today:util.formatDate(date),
      heightEquals:getApp().globalData.heightEquals
    })
  },
  onShow(){
    var that = this
    var detail = getApp().globalData.detail
    if(detail!=''){
      // 有数据就是更新数据，没数据就是插入数据
      if(detail.methods.pid==39||detail.methods.pid==11){
        getIouDetail({aid:detail.aid}).then(res=>{
          that.setData({
            did:res.data.obj.did,
            debit:res.data.obj.dname,
            return:res.data.obj.rname
          })
        })
      }
      var consumePay;
      if(detail.consumePay=='false'){
        consumePay=false
      }else{
        consumePay=true
      }
      this.setData({
        aid:detail.aid,
        payChecked:detail.isincome,
        money:detail.money,
        remark:detail.remark,
        methodChecked:detail.methods.pid,
        index:detail.payment,
        switch:consumePay,
        date:util.formatDate(detail.createTime),
        action:"up",
        bDefault:detail.book.bid
      })
    }
    this.setData({
      payment:getApp().globalData.payment
    })
    this.methodsData()
    this.showBooks()
  },
  goBack(){
    wx.navigateBack({
      delta: 1,
    })
  },
  showBooks(){
    var that = this
    let user = wx.getStorageSync('userInfo')
    getBook({uid:user.uid}).then(res=>{
      // console.log(res)
      let book = res.data.obj.books
      let bid = that.data.bDefault!=0?that.data.bDefault:res.data.obj.default_book
      let d = book.filter(o=>o.bid==bid)
      if(d.length!=0){
        //设置默认账本
        that.setBook(d[0].bid,d[0].bname,d[0].bimg)
      }
      that.setData({
        books:res.data.obj.books
      })
    })
  },
  methodsData(){
    var detail = getApp().globalData.detail
    var that = this
    getMethods({isincome:that.data.payChecked}).then(res=>{
      var methods = res.data.obj
      if(detail!=''&&detail.methods.pid!=39&&detail.methods.pid!=11){
        methods = methods.filter(o=>o.pid!=39&&o.pid!=11)
      }
      that.setData({
        pay_methods:methods,
      })
    })
  },
  handleOpen1 (e) {
    var peo = e.currentTarget.dataset.peo
    this.setData({
        visible: true,
        peo:peo
    });
  },
  handleClose1 ({detail}) {
    this.setData({
      visible: false
    });
  },
  inputDebit(e){
    this.setData({
      debit:e.detail.value
    })
  },
  inputReturn(e){
    this.setData({
      return:e.detail.value
    })
  },
  onChange(event){
    const detail = event.detail;
    this.setData({
        switch : detail.value
    })  
  },
  checkMethod(e){
    var detail = getApp().globalData.detail
    var pid = e.currentTarget.dataset.method
    if(detail!=''){
      if(detail.methods.pid==39||detail.methods.pid==11){
        $Toast({
          content: "无法选中其他类型",
          type: 'error'
        });
        pid = detail.methods.pid
      }
    }

    this.setData({
      methodChecked:pid
    })
  },
  inputRemark(e){
    this.setData({
      remark:e.detail.value
    })
  },
  takeAccount(){
    let message
    let that = this
    var uid = wx.getStorageSync('userInfo')['uid']
    if(that.data.index==null){
      message = "请选择支付方式"
    }else if(that.data.methodChecked==0){
      message = "请选择消费方式"
    }else if(that.data.money=="0"){
      message = "请输入金额"
    }else if(that.data.nowText.bid==0){
      message = "请选择账本"
    }else if(!(/(^[0-9]+(.[0-9]{1,2})?$)/.test(this.data.money))){
      message = "请输入正确的金额"
    }else if((that.data.methodChecked==39||that.data.methodChecked==11)&&(that.data.debit==''||that.data.return=='')){
        message = "借方和还方不能为空"
    }else{
      var money
      if(that.data.money.length>5){
        money = that.data.money.substring(0,5)
      }else{
        money = that.data.money
      }
      takeAccount({
        aid:that.data.aid,
        isincome:that.data.payChecked,
        pid:that.data.methodChecked,
        money:money,
        date:that.data.date,
        payment:that.data.index,
        remark:that.data.remark,
        consumePay:that.data.switch,
        uid:uid,
        did:that.data.did,
        dname:that.data.debit,
        rname:that.data.return,
        action:that.data.action,
        bid:that.data.nowText.bid
      }).then(res=>{
        $Toast({
          content: res.data.obj.msg,
          type: res.data.obj.info
        });
        setTimeout(() => {
          if(that.data.action=="in"){
            let pages = getCurrentPages()
            let prevPage = pages[pages.length-2]
            prevPage.setData({
              dayOne:res.data.dayOne
            })
          }
          wx.switchTab({
            url: '/pages/index/index',
          })
        }, 1000);
      })
      // wx.request({
      //   url: getApp().globalData.url+'/account/take',
      //   data:{
      //           aid:that.data.aid,
      //           isincome:that.data.payChecked,
      //           pid:that.data.methodChecked,
      //           money:money,
      //           date:that.data.date,
      //           payment:that.data.index,
      //           remark:that.data.remark,
      //           consumePay:that.data.switch,
      //           uid:uid,
      //           did:that.data.did,
      //           dname:that.data.debit,
      //           rname:that.data.return,
      //           action:that.data.action,
      //           bid:that.data.nowText.bid
      //         },
      //   success(res){
      //     console.log(res)

      //   }
      // })
    }
    if(message!=null){
      $Message({
        content: message,
        type: 'warning'
      });
      // Notify({ type: 'primary', message: '通知内容' });
    }
  },
  payChange(e){
    this.setData({
      payChecked:e.currentTarget.dataset.pay,
      switch:false
    })
    this.methodsData()
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  setMoney(event){
    var money
    var money1 = ''
    var number = event.currentTarget.dataset.number
    if(this.data.money=="0"){
      money = number
    }else{
      if(number=='+'||number=='-'||number=='='){
        if(this.data.firstMoney!=''&&this.data.lastNumber!='='){
          // console.log(this.data.lastNumber)
          var money2 = this.data.money.split(this.data.lastNumber)[1]
          if(this.data.lastNumber=='+'){
            money1=Number(Number(this.data.firstMoney)+Number(money2))
          }else{
            money1=Number(Number(this.data.firstMoney)-Number(money2))
          }
        }else{
          money1=this.data.money
        }

          this.setData({
            lastNumber:number
          })

      }
      if(money1!=''){
        if(number=='='){
          money = money1
          this.changeEqual("deng")
        }else{
          money = money1 + number
        }
      }else{
        money = this.data.money + number
      }
    }
    this.setData({
      money:String(money),
    })
    if(money1!=''){
      this.setData({
        firstMoney:money1
      })
    }
    if(this.data.money.indexOf('+')>=0||this.data.money.indexOf('-')>=0){
      this.changeEqual("yun")
    }
    // console.log(this.data.firstMoney)
    // console.log(Number('1+2'.split('+')[0])+Number('1+2'.split('+')[1]))
  },
  changeEqual(value){
    var input = this.data.input
    if(value=='yun'){
      input[3].have[3].text="="
      input[3].have[3].bindtap="setMoney"
    }else if(value=='deng'){
      input[3].have[3].text="记账"
      input[3].have[3].bindtap="takeAccount"
    }
    this.setData({
      input:input
    })
  },
  clearMoney(){
    this.setData({
      money:"0",
      firstMoney:'',
      lastNumber:''

    })
  },
  showDate(){
    this.setData({
      show:true
    })
  },
  checkDate(e){
    var checkDate = e.detail
    var date = this.format(checkDate)
    // console.log(date)
    this.setData({
      date:date,
      show:false
    })
  },
  format(date){
    var date = new Date(date)
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    return year + "-" + month + "-" + day
  },
  closeDate(){
    this.setData({
      show:false
    })
  },
  test(){
    console.log("123456".substring(0,5))
    // if(!(/(^[0-9]+(.[0-9]{1,2})?$)/.test(this.data.money))){
    //   console.log("请输入正确的格式")
    // }
    // console.log('+1+2'.indexOf('+'))
    // console.log(this.data.input[3].have[3].text)
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
      // console.log(e)
      let bid = e.currentTarget.dataset.bid
      let bname = e.currentTarget.dataset.name
      let bimg = e.currentTarget.dataset.img
      this.setBook(bid,bname,bimg)
      //再次执行动画，注意这里一定，一定，一定是this.animation来使用动画
      this.setData({
        selectShow: false,
        radius:10
      })
      // this.triggerEvent("changeBook",{bid:bid})
    },
    setBook(bid,bname,bimg){
      var nowText = this.data.nowText
      nowText['bid']=bid
      nowText['img']=bimg
      nowText['text']=bname
      this.setData({
        nowText:nowText
      })
    },
})
