// pages/haveClass/haveClass.js
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
    wx.request({
      method: "GET",
      url: 'https://e.hnfts.cn/quiz/interact/achieve/questions', // 仅为示例，并非真实的接口地址
      data: {
        "circleId": '123',
        "examineeId": '10005',
        "random": "123"
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
      }
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