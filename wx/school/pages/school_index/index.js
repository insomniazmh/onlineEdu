// pages/school_index/index.js
Page({
  // goUrl(e) {
  //   console.log(e.currentTarget.dataset.url);
  //   wx.navigateTo({
  //     url: e.currentTarget.dataset.url
  //   })
  // },

  //扫描二维码,获取班级id
  scanCode(e) {
    wx.scanCode({
      success(res) {
        console.log(res);
        var app = getApp();
        app.globalData.circleId = res.result;//将班级id存入全局变量中
        //将页面跳转至上课
        wx.navigateTo({
          url: e.currentTarget.dataset.url
        })
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
    // wx.login({
    //   success(res) {
    //     if (res.code) {
    //       console.log(res.code);
    //     } else {
    //       console.log('登录失败！' + res.errMsg)
    //     }
    //   }
    // })
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