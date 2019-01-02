// pages/haveClass/haveClass.js
var WxParse = require('../../wxParse/wxParse.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {

  },
  /**点击答案选项 */
  bindradio: function (e) {
    var that = this;//作用域
    console.log(e.target.dataset.id);
    if (e.target.dataset.id == that.data.radioindex) {///同一个点击多次拦截不执行
      return false;
    } else {// 不同的则进行赋值操作
      that.setData({ radioindex: e.target.dataset.id });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var random = Math.random().toString(36).substr(2);//生成随机数
    var that = this;
    wx.connectSocket({
      url: "wss://e.hnfts.cn/websocket/interactive/123/10001/student/"+ random,
      header: {
        'content-type': 'application/json'
      },
      protocols: ['protocol1'],
      method: 'GET'
    })
 
    wx.onSocketOpen(function() {
      console.log(123);
    })

    wx.onSocketMessage(function(res){
      var data = JSON.parse(res.data);
      console.log(data);
      WxParse.wxParse('article', 'html', data.bigQuestion.examChildren[0].choiceQstTxt, that, 5);
    })

    wx.onSocketError(function(res) {
      console.log(res);
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