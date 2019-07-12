Page({
  data: {
    course: {},//课程信息
    activeNames: '0',
    collapseList: []//章节列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    this.setData({
      courseName: wx.getStorageSync('courseName')
    });
    this.loadChapterByCourseId();
  },

  onChange(event) {
    this.setData({
      activeNames: event.detail
    });
  },

  /**
   * 根据课程id加载章节信息
   */
  loadChapterByCourseId: function () {
    var that = this;
    var postData = {
      courseId: wx.getStorageSync('courseId')
    }
    getApp().agriknow.loadChapterByCourseId(postData).then(res => {
      var collapseList = [];
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].parent == '0') {
          res.data[i].colpseMtitle = [];
          collapseList.push(res.data[i]);
        }
      }

      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].parent != '0') {
          for (let j = 0; j < collapseList.length; j++) {
            if (res.data[i].parent == collapseList[j].id) {
              collapseList[j].colpseMtitle.push(res.data[i]);
            }
          }
        }
      }

      that.setData({
        collapseList: collapseList
      });
      
    })
    .catch(res => {
      //wx.stopPullDownRefresh()
    });
  },

  //跳转至预习页面
  navToPreview: function (e) {
    wx.navigateTo({
      url: '/pages/course/preview/preview?chapterId=' + e.currentTarget.id + '&chapterName=' + e.currentTarget.text
    })
  },
})