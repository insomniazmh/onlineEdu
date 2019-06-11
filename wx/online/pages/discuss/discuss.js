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

      active: 1,
  },
  courseList: [
    {
      courseDescribe: "",
      courseId: "47e0b0d129ea4968b8a5645c16bf5d2a",
      courseName: "新编商务英语",
      courseDate: "2019-6-11",
      teacherId: "dongbo",
      teacherName: "董波",
      joinChapterName: "第一讲:商务英语的由来",
      topPicSrc: "http://118.24.120.43:8080/group1/M00/00/06/rBsADFzFVPWAHFgZAAE-NPUKEQM835.jpg"
    },
    {
      courseDescribe: "",
      courseId: "47e0b0d129ea4968b8a5645c16bf5d2a",
      courseName: "电子商务基础与应用",
      courseDate: "2019-6-11",
      teacherId: "dongbo",
      teacherName: "董波",
      joinChapterName: "第二讲:FLASH动画的原理",
      topPicSrc: "/img/zbook.png"
    },
    {
      courseDescribe: "",
      courseId: "47e0b0d129ea4968b8a5645c16bf5d2a",
      courseName: "计算机基础教程",
      courseDate: "2019-6-11",
      teacherId: "dongbo",
      teacherName: "董波",
      joinChapterName: "第五讲:CPU，内存的作用",
      topPicSrc: "/img/7.jpg"
    }
  ],
  onChange(event) {
    
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