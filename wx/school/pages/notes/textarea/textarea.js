// pages/textarea/textarea.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commentAdd:{}
  },

  commentAdded(){
    var that = this;
    var postData = {
      articleId: 'fc26d5f13e3746e9995d9c51f822f819',
      content:'ok!!!!!',
      userId: '1301331992031827761'
    };
    console.log(postData)
    getApp().agriknow.notesCommentadded(postData).then(res => {
      that.setData({
        commentAdd: res.data
      });
      console.log(that.data.commentAdd);
    })
      .catch(res => {
        //wx.stopPullDownRefresh()
      });
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