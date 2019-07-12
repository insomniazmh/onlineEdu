// pages/videoMaterial/videoMaterial.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    activeNames: '1',
    videoUrl: 'https://e.hnfts.cn/file/group1/M00/00/00/wKgVolz_XHSAPZRCAKZadEGkJGs856.mp4',
    curriculum:[
      {
        headText:"高中语文深度进阶诗词专题",
        chapter:"诗词鉴赏是高考中分值占比最小的版块，一方面源于套路较深，一方面在于考察的角度不多，本次课程针对诗词积累较薄弱或希望冲刺满分的学生。让我们一起拿下高分！"
      }
    ],
    courseList: [
      {
        courseDescribe: "今天早上在地铁上用手机看精读，旁边一个男生说:你是准备考MBA吗？我说不是，就是日常学习。难道我看起来像是学霸吗，哈哈，真开心啊，MBA现在我还没有资格考，慢慢学吧。",
        courseId: "47e0b0d129ea4968b8a5645c16bf5d2a",
        courseName: "完成电子商务第一章第一小节",
        teacherId: "dongbo",
        inforDate: "18437",
        topPicSrc: "/img/banner/header.png",
        looks:"/img/icon/looks.png"
      },
      {
        courseDescribe: "今天早上在地铁上用手机看精读，旁边一个男生说:你是准备考MBA吗？我说不是，就是日常学习。难道我看起来像是学霸吗，哈哈，真开心啊，MBA现在我还没有资格考，慢慢学吧。",
        courseId: "47e0b0d129ea4968b8a5645c16bf5d2a",
        courseName: "完成商务英语第一章第一小节",
        teacherId: "dongbo",
        inforDate: "10221",
        topPicSrc: "/img/news/list1.png",
        looks:"/img/icon/looks.png"
      },
    ],
    collapseList:[
      {
        index: '0',
        colpseTitle:"第一讲  高考诗词鉴赏",
        colpseMtitle:"1.1诗词鉴赏考察要点"
      },
      {
        index: '1',
        colpseTitle: "第二讲  高考诗词鉴赏",
        colpseMtitle: "2.1诗词鉴赏考察要点"
      }
    ]
  },
  changeContent(event) {
    // wx.showToast({
    //   title: `切换到标签 ${event.detail.index + 1}`,
    //   icon: 'none'
    // })
  },
  onChange(event) {
    console.log(event.detail);
    this.setData({
      activeNames: event.detail
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 播放进度变化时触发，可获取总时长和当前播放时长
   */
  timeupdate: function (e) {
    console.log(e);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.videoContext = wx.createVideoContext('video');
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