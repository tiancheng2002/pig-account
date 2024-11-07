const { $Message } = require('../../dist/base/index');
const { getIou,accountDetail,finishIou,delAccount } = require('../../http/api')
Page({
    data : {
      active:0,
      iou_finish:[],
      iou_unfinish:[],
      iouMoney:0,
      iou_button:[{id:0,name:'全部'},{id:1,name:'已完成'},{id:2,name:'未完成'}],
      checked:0,
      toggle2 : false,
      visible:false,
      fvisible:false,
      aid:0,
      did:0,
      income:0,
      iouVisible:false,
      actions : [
          {
              name : '',
              color : '#fff',
              fontsize : '20',
              width : 50,
              icon : 'right',
              background : '#07c160' 
          },
          {
              name : '',
              color : '#fff',
              fontsize : '20',
              width : 50,
              icon : 'editor',
              background : '#ff9900'
          },
          {
              name : '',
              color : '#fff',
              fontsize : '20',
              width : 50,
              icon : 'delete',
              background : '#ed3f14'
          }
      ],
    },
    onChange(e){
      this.setData({
        checked:e.detail.index
      })
    },
    showData(){
        wx.showLoading({
          title: '加载借款中',
        })
        this.setData({
          iouVisible:false
        })
        var that = this
        var user = wx.getStorageSync('userInfo')
        if(user){
          getIou({uid:user.uid}).then(res=>{
            var iou = res.data.obj
            var money = iou.map(function(map){return map.dmoney})
            var iouMoney = money.reduce((a,b)=>a+b)
            var iou_finish = iou.filter(o=>o.isfinish==true)
            var iou_unfinish = iou.filter(o=>o.isfinish==false)
            that.setData({
                iou_finish:iou_finish,
                iou_unfinish:iou_unfinish,
                iouMoney:iouMoney
            })
          })
        }
        setTimeout(() => {
          wx.hideLoading({
            success: (res) => {
              this.setData({
                iouVisible:true
              })
            },
          })
        }, 350);
    },
    onShow:function(){
        this.showData()
    },
    handlerCloseButton(e){
        var aid = e.currentTarget.dataset.aid
        var did = e.currentTarget.dataset.did
        if(e.detail.index==0){
          this.setData({
            fvisible:true,
            did:did,
            income:e.currentTarget.dataset.income
          })
        }else if(e.detail.index==1){
          accountDetail({aid:aid}).then(res=>{
            getApp().globalData.detail = res.data.obj
            wx.navigateTo({
              url: '../account/index',
            })
          })
        }else{
            this.setData({
                visible:true,
            })
        }
        this.setData({
            toggle2: this.data.toggle2 ? false : true,
            aid:aid
        });
    },
    close(){
      this.setData({
        visible:false
      })
    },
    deleteIOU({detail}){
        wx.showLoading({
          title: '正在删除中',
        })
        var that = this
        this.setData({
          visible:false
        })
        delAccount({aid:that.data.aid}).then(res=>{
          setTimeout(() => {
            wx.hideLoading({
              success: (res) => {},
            })
            $Message({
              content: '删除成功！',
              type: 'success'
            });
          }, 2000);
        })
        setTimeout(() => {
          this.showData()
        }, 3000);
    },
    closeFinish(){
      this.setData({
        fvisible:false
      })
    },
    finishIOU(){
      let user = wx.getStorageSync('userInfo')
      wx.showLoading({
        title: '确认借款中',
      })
      var that = this
      that.setData({
        fvisible: false,
      });
      finishIou({
        did:that.data.did,
        aid:that.data.aid,
        isincome:that.data.income,
        uid:user.uid}).then(res=>{
          setTimeout(() => {
            wx.hideLoading({
              success: (res) => {},
            })
            $Message({
              content: '借条完成',
              type: 'success'
            });
          }, 2000);
        })
      setTimeout(() => {
        this.showData()
      }, 3000);
    }
});