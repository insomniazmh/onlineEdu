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
    console.log(wx.getStorageSync('token'));
    return this.requestAll(url, data, header, 'POST')
  }

  /**
   * 网络请求
   */
  requestAll(url, data, header, method) {
    var that = this;
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
          //console.log(res);
          if (res.statusCode === 200) {
            //200: 服务端业务处理正常结束
            if (res.data.ret == 0) {
              resolve(res)
            } else if (res.data.ret == 4) {
              wx.showToast({
                title: '登录信息失效',
                icon: 'none'
              });
              that.wxLogin();
            }else {
              console.log(res);
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
  wxLogin() {
    wx.login({
      success(res) {
        if (res.code) {
          wx.request({
            method: "get",
            url: 'https://e.hnfts.cn/wechat/user/login?code=' + res.code,
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(data) {
              if (data.data.ret == 0) {
                var resData = data.data.data;
                console.log(resData.token);
                wx.setStorageSync('token', resData.token)//将token信息存入本地
                wx.setStorageSync('studentId', resData.studentId)//将studentId信息存入本地
                if (resData.binding && resData.binding == '0') {
                } else {
                  //将页面跳转至绑定页
                  wx.showModal({
                    title: '未找到身份信息',
                    content: '您的身份还未验证，请先绑定身份信息',
                    showCancel: false,
                    duration: 2000,
                    success: function () {
                      getApp().globalData.alreadyBind = false;
                      wx.navigateTo({
                        url: '/pages/getId/getId'
                      });
                    }
                  });
                }
              } else {
                wx.showToast({
                  title: '登录失败！',
                  icon: 'none',
                  duration: 2000
                });
              }
            }
          });
        } else {
          wx.showToast({
            title: '网络异常',
            icon: 'none',
            duration: 2000
          });
        }
      }
    })
  }
}

export default request