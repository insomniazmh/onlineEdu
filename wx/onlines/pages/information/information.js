// pages/information/information.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      "/img/banner_1.jpg",
      "/img/banner_1.jpg",
      "/img/banner_1.jpg",
      "/img/banner_1.jpg"
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 500,
    active: 0,
    articleList: [],
  },

  navToDetail: function(e) {
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/information/infodetail/infodetail?id=' + e.currentTarget.dataset.id
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
    let that = this;
    getApp().agriknow.articleFindAll({
      page: 0,
      size: 15
    }).then(res => {
      console.log(res);
      that.setData({
        articleList: res.data.content
      })
    }).catch(res => {
      //wx.stopPullDownRefresh()
    });
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