// pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:''
  },
  se(e){
    this.setData({
      name:e.detail.value
    })
  },
  searchBox:function(e) {
    var _this = this;
    wx.request({
      url: 'http://192.168.10.1:8080/test1/hello1',   //请求地址
      method: 'POST',
      data: {     //数据
        name: 'Eric'
      },
      header: {       //请求消息头
        'content-type': 'application/json;charset=UTF-8'
      },
      success: function (res) {
        console.log(res.data)
        console.log(_this.data.name)
      },
    })
  },
  /*
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