// pages/True or false/True or false.js
Page({
  imgclick: function(e) {
    var that = this;
    console.log(e.target.dataset.id)
    if (e.target.dataset.id == that.data.checkimg) {
      return false;
    } else {
      that.setData({
        checkimg: e.target.dataset.id
      });
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    checkimg: 0, ///点击控制的变量
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})