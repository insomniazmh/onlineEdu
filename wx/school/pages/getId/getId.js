// pages/getId/getId.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: ""
  },

  bindKeyInput(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  subclick(e) {
    var app = getApp();
    app.globalData.studentId = this.data.inputValue;//将学生id存入全局变量中
    //将页面跳转至首页
    wx.navigateTo({
      url: '/pages/school_index/index'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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