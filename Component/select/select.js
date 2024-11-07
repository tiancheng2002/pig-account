// Componet/Componet.js
Component({
 /**
  * 组件的属性列表
  */
  properties: {
    propArray:{
      type:Array,
    }
  },
 /**
  * 组件的初始数据
  */
  data: {
    selectShow:false,//初始option不显示
    nowText:"全部",//初始内容
    animationData:{}//右边箭头的动画
  },
 /**
  * 组件的方法列表
  */
  methods: {
　　　//option的显示与否
    selectToggle:function(){
      var nowShow=this.data.selectShow;//获取当前option显示的状态
      this.setData({
        selectShow: !nowShow
      })
    },
    //设置内容
    setText:function(e){
      let bid = e.currentTarget.dataset.bid
      let bname = e.currentTarget.dataset.name
      var nowText = bname;//当前点击的内容
      //再次执行动画，注意这里一定，一定，一定是this.animation来使用动画
      this.setData({
        selectShow: false,
        nowText:nowText,
      })
      this.triggerEvent("changeBook",{bid:bid})
    }
  },
})