// pages/school_index/index.js
Page({
  joinRoom: function(e) {
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
  },

  //扫描二维码,获取班级id
  scanCode(e) {
    var that = this;
    var app = getApp();
    if (app.globalData.circleId && app.globalData.circleId != "") {
      wx.showModal({
        title: '提示',
        content: '已进入过课堂，需要重新扫描吗？',
        cancelText: '直接进入',
        confirmText: '重新扫描',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.scanCode({
              success(res) {
                console.log(res);
                if (res.result && res.result.indexOf("interactionQr") == 0) {
                  app.globalData.circleId = res.result;//将班级id存入全局变量中
                  that.joinRoom(e);
                } else {
                  wx.showToast({
                    title: '二维码不正确，请重新扫描',
                    icon: 'none',
                    duration: 2000
                  });
                }

              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
            that.joinRoom(e);
          }
        }
      })
    }else {
      wx.scanCode({
        success(res) {
          if (res.result && res.result.indexOf("interactionQr") == 0) {
            app.globalData.circleId = res.result;//将班级id存入全局变量中
            that.joinRoom(e);
          } else {
            wx.showToast({
              title: '二维码不正确，请重新扫描',
              icon: 'none',
              duration: 2000
            });
          }

        }
      })
    }
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
    if (!getApp().globalData.token) {
      getApp().agriknow.wxLogin();
    }
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
    if (!getApp().globalData.alreadyBind) {
      //将页面跳转至绑定页
      wx.showModal({
        title: '未找到身份信息',
        content: '您的身份还未验证，请先绑定身份信息',
        showCancel: false,
        duration: 2000,
        success: function () {
          wx.navigateTo({
            url: '/pages/getId/getId'
          });
        }
      });
    }
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