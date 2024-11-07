// 引入env中的url
const {
  baseUrl
} = require('./env.js').dev
const { $Toast } = require('../dist/base/index');
// 专属域名
// const subDomain = '域名'
module.exports = {
  /**二次封装wx.request()
   * url:请求的接口地址
   * method:请求方式
   * data传参
   * */
  request: (url, method, data) => {
    // console.log(baseUrl)
    let _url = `${baseUrl}/${url}`
    return new Promise((resolve, reject) => {
      // wx.showLoading({
      //   title:"正在加载"
      // })

      wx.request({
        url: _url,
        data: data,
        method: method,
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: (res) => {
          if(res.data.code==200||res.data.code!=500){
            // wx.hideLoading()
            resolve(res)
          }else{
            $Toast({
              content: res.data.msg,
              type: "error"
            });
          }
        }
      })
    })
  }

}