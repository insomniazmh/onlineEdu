// pages/videoMaterial/videoMaterial.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    activeNames: '1',
    videoUrl: '',
    courseDescribe: '',
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
    chapterList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      courseId: options.id
    })
    this.loadCourseDescribe()
    this.loadChapter()
  },

  //加载课程详情获取课程描述
  loadCourseDescribe: function() {
    let that = this
    getApp().agriknow.loadCourseDetail({
      courseId: that.data.courseId
    }).then(res => {
      console.log(res.data.courseDescribe)
      that.setData({
        courseDescribe: res.data.courseDescribe
      })
    })
  },

  //根据课程id获取章节列表
  loadChapter: function () {
    let that = this
    let chapterList = []
    getApp().agriknow.loadChapterByCourseId({
      courseId: that.data.courseId
    }).then(res => {
      //拼装章节，两层循环
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].parent == '0') {
          res.data[i].children = [] 
          chapterList.push(res.data[i])
        }else {
          for (let y = 0; y < chapterList.length; y++) {
            if (res.data[i].parent == chapterList[y].id) {
              chapterList[y].children.push(res.data[i])
            }
          }
        }
      }
      that.setData({
        chapterList: chapterList
      })
    }).catch(res => {

    })
  },

  //点击章节切换资源
  chooseChapter: function (e) {
    this.loadVideo(e.currentTarget.dataset.id)
    this.loadDatumList(e.currentTarget.dataset.id)
    this.loadExerciseList(e.currentTarget.dataset.id)
  },

  //加载视频课件
  loadVideo: function(chapterId) {
    let that = this
    getApp().agriknow.loadVideo({
      chapterId: chapterId
    }).then(res => {
      that.setData({
        videoUrl: res.data[0].fileUrl
      })
    })
    .catch(res => {
      //wx.stopPullDownRefresh()
    })
  },

  //加载章节资料
  loadDatumList: function (chapterId) {
    let that = this
    getApp().agriknow.loadDatumList({
      chapterId: chapterId
    }).then(res => {

    }).catch(res => {
      //wx.stopPullDownRefresh()
    })
  },

  //加载章节练习题
  loadExerciseList: function (chapterId) {
    let that = this
    getApp().agriknow.loadExerciseList({
      chapterId: chapterId
    }).then(res => {

    }).catch(res => {
      //wx.stopPullDownRefresh()
    })
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

  //章节列表插件要求写法
  onChange(event) {
    this.setData({
      activeNames: event.detail
    });
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