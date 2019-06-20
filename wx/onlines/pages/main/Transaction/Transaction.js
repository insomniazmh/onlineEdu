// pages/main/Transaction/Transaction.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeName: '0',
    objectArray1: ["第一"],//章
    objectArray2: [],//节
    objectArray3: [],//小节
    index1: 0,
    index2: 0,
    index3: 0
  },
  onChange(event) {
    this.setData({
      activeName: event.detail
    });
  },
  loadObjectArray2: function (index) {
    var objectArray2 = [];
    for (let i = 0; i < this.data.chapterList.length; i++) {
      if (this.data.chapterList[i].parent == this.data.objectArray1[index].id) {
        objectArray2.push(this.data.chapterList[i]);
      }
    }
    this.setData({
      index2: 0,
      objectArray2: objectArray2
    })
    if (objectArray2.length > 0) {
      this.loadObjectArray3(0);
    } else {
      this.setData({
        index2: 0,
        objectArray3: []
      })
    }

  },

  //拼装小节方法
  loadObjectArray3: function (index) {
    var objectArray3 = [];
    for (let i = 0; i < this.data.chapterList.length; i++) {
      if (this.data.chapterList[i].parent == this.data.objectArray2[index].id) {
        objectArray3.push(this.data.chapterList[i]);
      }
    }
    this.setData({
      index3: 0,
      objectArray3: objectArray3
    });

  },

  //选择章事件
  bindPickerChange1: function (e) {
    this.setData({
      index1: e.detail.value
    })
    this.loadObjectArray2(e.detail.value);
  },
  //选择节事件
  bindPickerChange2: function (e) {
    this.setData({
      index2: e.detail.value
    });
    this.loadObjectArray3(e.detail.value);
  },
  //选择小节事件
  bindPickerChange3: function (e) {
    this.setData({
      index3: e.detail.value
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