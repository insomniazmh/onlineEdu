// pages/reply/reply.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    select:false,
    tihuoWay:'不明觉厉',
    array: ['美国', '中国', '巴西', '日本'],
    objectArray: [
          {id: 0,name: '美国'},
          {id: 1,name: '中国'},
          {id: 2,name: '巴西'},
          {id: 3,name: '日本'}
    ],
    index:1,
    posTed:{},
    inputValue:"啊啊",
  },
  switch1Change(e){
    console.log('swtch发生改变,')
  },
  bindSub: function(e) {
    var test = e.currentTarget.dataset;
    wx.showActionSheet({
      itemList: ['发帖', '回答'],
      success(res) {
        if (res.tapIndex == 0) {
          console.log("点击发帖按钮");
          
        }else {
          console.log("点击回答按钮");
        }
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },

/**
   * 发帖
   */
  bindKeyinput(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  //  textarea
  bindFormSubmit(e) {
    this.saveNote(e.detail.value.textarea);
  },
  saveNote: function (content) {
    var that = this;
    var postData = {
      articleConten: content,
      articleType:"xd",
      classId:'1611',
      courseId:"2c9180846827407401682b57f4a60000",
      description:"文章描述",
      imgUrl:"titleUrl",
      title: this.data.inputValue,
      userId:'130133199203182776'
    };
    console.log(postData)
    //  return false;
    getApp().agriknow.notesPosted(postData).then(res => {
      that.setData({
        posTed: res.data
      });
      // console.log(that.data.posTed);
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
  bindShowMsg(){
    this.setData({
      select:!this.data.select
    })
  },
  mySelect(e){
    var name = e.currentTarget.dataset.name
    this.setData({
      tihuoWay:name,
      select:false
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