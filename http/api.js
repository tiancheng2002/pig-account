// 引入request请求
const {
  request
} = require('./http')

// 基于业务封装的接口
module.exports = {
  
  /**
   * 拿封装商品列表举例
   */
  // url,method,data,isSubDomain
  getAccount: (data) => {
    // console.log('获取商品列表方法')
    return request('account/time','get',data); //第一个参数为地址，第二个参数为请求方式，第三个参数为传递的参数，第四个参数为是否需要token
  },
  //获得账单统计数据
  getCount: (data) =>{
    return request('account/count','get',data)
  },
  //个人中心
  getMine: (data) =>{
    return request('account/mine','get',data)
  },
  //获取所有的账本
  getBook: (data) =>{
    return request('book/all','get',data);
  },
  //账单详情
  accountDetail: (data) =>{
    return request('account/detail','get',data);
  },
  //获取所有的方法类型
  getMethods: (data) =>{
    return request('methods/all','get',data)
  },
  //查看所有借款信息
  getIou: (data) =>{
    return request('iou/all','get',data);
  },
  //查看借款信息详情
  getIouDetail: (data) =>{
    return request('iou/detail','get',data)
  },
  //获取每一天的消费情况
  getDayCount: (data) =>{
    return request('account/day','get',data)
  },
  //账单排序
  accountOrder: (data) =>{
    return request('account/order','get',data)
  },
  //用户登录
  userLogin: (data) =>{
    return request('login','post',data)
  },
  //预算修改
  upBudget: (data) =>{
    return request('user/budget','get',data)
  },
  //携带邀请信息，判断邀请的状态
  inviteCheck: (data) =>{
    return request('have/check','get',data)
  },
  //请求加入账本
  inviteAdd: (data) =>{
    return request('have/add','get',data)
  },
  //完成借款
  finishIou: (data) =>{
    return request('iou/finish','get',data)
  },
  //删除账单记录
  delAccount: (data) =>{
    return request('account/delete','get',data)
  },
  //设置默认账本
  setDefaultBook: (data) =>{
    return request('user/defBook','get',data)
  },
  //账本详情
  bookDetail: (data) =>{
    return request('book/detail','get',data)
  },
  //加载账本图片
  bookImages: (data) =>{
    return request('book/images','get',data)
  },
  //添加或修改账本信息
  bookAction: (data) =>{
    return request('book/action','post',data)
  },
  //删除账本信息
  bookDel: (data) =>{
    return request('book/del','get',data)
  },
  //查看账本中的所有成员
  bookMembers: (data) =>{
    return request('have/members','get',data)
  },
  //生成账本的邀请信息
  bookCode: (data) =>{
    return request('have/code','get',data)
  },
  //删除账本中的成员
  memberDel: (data) =>{
    return request('have/del','get',data)
  },
  //记录账单信息
  takeAccount: (data) =>{
    return request('account/take','get',data)
  }

//.........可以根据自己的数据继续封装
 
}