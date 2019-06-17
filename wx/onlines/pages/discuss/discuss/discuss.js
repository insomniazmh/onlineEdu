// pages/discuss/discuss.js
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
    pageContent: [
      {
        pageImage: "/img/3.jpg",
        pageTitle: "评论内容",
        pageDate: "2019-6-7",
        pageGoodImg: "/img/icon/good.png",
        pageGoodNmb: "888"
      },
      {
        pageImage: "/img/3.jpg",
        pageTitle: "评论内容",
        pageDate: "2019-6-7",
        pageGoodImg: "/img/icon/good.png",
        pageGoodNmb: "888"
      },
      {
        pageImage: "/img/3.jpg",
        pageTitle: "评论内容",
        pageDate: "2019-6-7",
        pageGoodImg: "/img/icon/good.png",
        pageGoodNmb: "888"
      }
    ],
  },

  changeContent(event) {
    wx.showToast({
      title: `切换到标签 ${event.detail.index + 1}`,
      icon:'none'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    
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