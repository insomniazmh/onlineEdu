// pages/Notice/Notice.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    notice:{}
  },
  // 跳转
  notice(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url + "?id=" + e.currentTarget.id
    })
  },

  onLoad: function (options) {
    var that = this;
    var postData = {
      sortVo:{
        page:0,
        size:15
        }
    };
    // console.log(postData)
    getApp().agriknow.noticeFindAll(postData).then(res => {
      that.setData({
        notice: res.data
      });
      // console.log(that.data.notice);
    })
      .catch(res => {
        //wx.stopPullDownRefresh()
      });
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