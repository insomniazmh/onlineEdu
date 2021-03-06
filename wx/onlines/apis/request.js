/**
 * name: request.js
 * description: request处理基础类
 * author: 赵孟浩
 * date: 2019-2-18
 */
class request {
  constructor() {
    this._header = {
      'content-type': 'application/json'
    }
  }

  /**
   * 设置统一的异常处理
   */
  setErrorHandler(handler) {
    this._errorHandler = handler;
  }

  /**
   * GET类型的网络请求
   */
  getRequest(url, data, header = this._header) {
    return this.requestAll(url, data, header, 'GET')
  }

  /**
   * DELETE类型的网络请求
   */
  deleteRequest(url, data, header = this._header) {
    return this.requestAll(url, data, header, 'DELETE')
  }

  /**
   * PUT类型的网络请求
   */
  putRequest(url, data, header = this._header) {
    return this.requestAll(url, data, header, 'PUT')
  }


  /**
   * POST类型的网络请求
   */
  postRequest(url, data, header = this._header) {
    return this.requestAll(url, data, header, 'POST')
  }

  /**
   * 网络请求
   */
  requestAll(url, data, header, method) {
    var that = this;
    if(!data.unLoadIng) {
      wx.showLoading({
        title: '加载中',
      })
    }
    
    return new Promise((resolve, reject) => {
      header = {
        'content-type': 'application/json',
        'token': wx.getStorageSync('token')
      }
      wx.request({
        url: url,
        data: data,
        header: header,
        method: method,
        success: (res => {
          wx.hideLoading()
          //console.log(res);
          if (res.statusCode === 200) {
            //200: 服务端业务处理正常结束
            if (res.data.ret == 0) {
              resolve(res)
            } else if (res.data.ret == 4) {
              wx.showToast({
                title: '登录信息失效，请退出重试',
                icon: 'none'
              });
              wx.removeStorageSync('token')
              wx.navigateTo({
                url: '/pages/index/index'
              })
            }else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none'
              })
            }
          } else {
            //其它错误，提示用户错误信息
            if (that._errorHandler != null) {
              //如果有统一的异常处理，就先调用统一异常处理函数对异常进行处理
              that._errorHandler(res)
            }
            reject(res)
          }
        }),
        fail: (res => {
          wx.hideLoading()
          if (that._errorHandler != null) {
            that._errorHandler(res)
          }
          reject(res)
        })
      })
    })
  }

  /**
   * 微信登录
   */
  // wxLogin() {
    
  // }
}

export default request