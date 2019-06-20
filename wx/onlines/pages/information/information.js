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
    courseLists:[
      {
        courseDescribe: "今天早上在地铁上用手机看精读，旁边一个男生说:你是准备考MBA吗？我说不是，就是日常学习。难道我看起来像是学霸吗，哈哈，真开心啊，MBA现在我还没有资格考，慢慢学吧。",
        courseId: "47e0b0d129ea4968b8a5645c16bf5d2a",
        courseName: "学习趣闻",
        teacherId: "dongbo",
        teacherName: "董波",
        inforDate: "2019-6-11",
      }
    ],
    courseList: [
      {
        courseDescribe: "今天早上在地铁上用手机看精读，旁边一个男生说:你是准备考MBA吗？我说不是，就是日常学习。难道我看起来像是学霸吗，哈哈，真开心啊，MBA现在我还没有资格考，慢慢学吧。",
        courseId: "47e0b0d129ea4968b8a5645c16bf5d2a",
        courseName: "学习趣闻",
        teacherId: "dongbo",
        teacherName: "董波",
        inforDate: "2019-6-11",
        topPicSrc: "/img/floor/a5.png"
      }
    ]
  },
  changeContent(event) {
    // wx.showToast({
    //   title: `切换到标签 ${event.detail.index + 1}`,
    //   icon: 'none'
    // })
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