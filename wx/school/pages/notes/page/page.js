// pages/page/page.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg: [
      { 'show':''},
    ],
    asg: [
      { 'whow': '' },
    ],
  },
  jumpRep(){
    wx.navigateTo({
      url: '../textarea/textarea',
    })
  },
  zan: function (e) {
    const vm = this;

    const _index = e.currentTarget.dataset.index;

    let _msg = [...vm.data.msg]; // msg的引用

    _msg[_index]['show'] = !vm.data.msg[_index]['show'];
    vm.setData({
      msg: _msg
    })

  },
  cang: function (e) {
    const vm = this;

    const _index = e.currentTarget.dataset.index;

    let _asg = [...vm.data.asg]; // msg的引用

    _asg[_index]['whow'] = !vm.data.asg[_index]['whow'];
    vm.setData({
      asg: _asg
    })

  },
    reply:function(){
      wx.navigateTo({
        url: '../release/release',
      })
    },
    release: function () {
    wx.navigateTo({
      url: '../reply/reply',
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