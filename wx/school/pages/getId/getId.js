// pages/getId/getId.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    realName: "",//学生姓名
    idNumber: ""//学生身份证号码
  },

  /**
   * 用户姓名
   */
  bindKeyName(e) {
    this.setData({
      realName: e.detail.value
    })
  },

  /**
   * 用户身份证号码
   */
  bindKeyId(e) {
    this.setData({
      idNumber: e.detail.value
    })
  },
  
  subclick(e) {
    console.log(this.data.realName);
    console.log(this.data.idNumber);
    this.bindUser();
    //var app = getApp();
    //app.globalData.studentId = this.data.realName;//将学生id存入全局变量中
    //将页面跳转至首页
    // wx.navigateTo({
    //   url: '/pages/school_index/index'
    // })
  },

  //绑定学生信息
  bindUser() {
    getApp().agriknow.bindUser(this.data.realName, this.data.idNumber)
      .then(res => {
        wx.showToast({
          title: '绑定成功！',
        });
        getApp().globalData.binding = '0';
        wx.navigateTo({
          url: '/pages/school_index/index'
        })
      })
      .catch(res => {
        //wx.stopPullDownRefresh()
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