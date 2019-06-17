//index.js
//获取应用实例
const app = getApp()

Page({
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
    courseList: [
      {
        courseDescribe: "",
        courseId: "47e0b0d129ea4968b8a5645c16bf5d2a",
        courseName: "新编商务英语",
        teacherId: "dongbo",
        teacherName: "董波",
        joinChapterName: "第一讲:商务英语的由来",
        topPicSrc: "http://118.24.120.43:8080/group1/M00/00/06/rBsADFzFVPWAHFgZAAE-NPUKEQM835.jpg"
      },
      {
        courseDescribe: "",
        courseId: "47e0b0d129ea4968b8a5645c16bf5d2a",
        courseName: "电子商务基础与应用",
        teacherId: "dongbo",
        teacherName: "董波",
        joinChapterName: "第二讲:FLASH动画的原理",
        topPicSrc: "/img/zbook.png"
      },
      {
        courseDescribe: "",
        courseId: "47e0b0d129ea4968b8a5645c16bf5d2a",
        courseName: "计算机基础教程",
        teacherId: "dongbo",
        teacherName: "董波",
        joinChapterName: "第五讲:CPU，内存的作用",
        topPicSrc: "/img/7.jpg"
      }
    ]
  },
  
  onLoad: function () {
    
  },

  bindNavBlink: function(e) {
    wx.navigateTo({
      
      url: e.currentTarget.dataset.url
    })
  }
})
