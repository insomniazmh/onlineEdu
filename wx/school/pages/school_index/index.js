// pages/school_index/index.js
Page({
  // goUrl(e) {
  //   console.log(e.currentTarget.dataset.url);
  //   wx.navigateTo({
  //     url: e.currentTarget.dataset.url
  //   })

  //扫描二维码,获取班级id
  scanCode(e) {
    var app = getApp();
    if (app.globalData.circleId && app.globalData.circleId != "") {

    }
    wx.scanCode({
      success(res) {
        console.log(res);
        if (res.result && res.result.indexOf("interactionQr")==0) {
          app.globalData.circleId = res.result;//将班级id存入全局变量中
          //学生进入课堂
          wx.request({
            method: "post",
            url: 'https://e.hnfts.cn/quiz/classRoom/join/interactiveRoom',
            data: {
              examineeId: getApp().globalData.studentId,
              circleId: getApp().globalData.circleId
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              //将页面跳转至上课
              wx.navigateTo({
                url: e.currentTarget.dataset.url
              })
            }
          });
        }else {
          wx.showToast({
            title: '二维码不正确，请重新扫描',
            icon: 'none',
            duration: 2000
          });
        }
        
      }
    })

  },

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.login({
      success(res) {
        if (res.code) {
          wx.request({
            method: "get",
            url: 'https://e.hnfts.cn/wechat/user/wx6b2191f8e374bac8/login?appid=wx6b2191f8e374bac8&code=' + res.code,
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              console.log(res.data)
              if (res.data.ret == 0) {
                
              }
            }
          })
          console.log(res.code);
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})