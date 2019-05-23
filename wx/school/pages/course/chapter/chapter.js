Page({
  data: {
    course: {},//课程信息
    objectArray1: [],//章
    objectArray2: [],//节
    objectArray3: [],//小节
    index1: 0,
    index2: 0,
    index3: 0
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

/**
   * 根据课程id加载章节信息
   */
  loadChapterByCourseId: function () {
    var that = this;
    var postData = {
      courseId: wx.getStorageSync('courseId')
    }
    getApp().agriknow.loadChapterByCourseId(postData).then(res => {
      that.setData({
        chapterList: res.data
      });
      
      var objectArray1 = [];

      //拼装章中的数据
      for(let i=0;i<res.data.length;i++) {
        if (res.data[i].parent == '0') {
          objectArray1.push(res.data[i]);
        }
      }
      that.setData({
        objectArray1: objectArray1
      });
      that.loadObjectArray2(0);
    })
    .catch(res => {
      //wx.stopPullDownRefresh()
    });
  },

  //拼装节方法
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
    }else {
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

  //跳转至预习页面
  navToPreview: function () {
    //获取当前选中的章节
    var chapter = {};
    if (this.data.objectArray3.length > 0) {
      chapter = this.data.objectArray3[this.data.index3];
    } else if (this.data.objectArray2.length > 0) {
      chapter = this.data.objectArray2[this.data.index2];
    } else if (this.data.objectArray1.length > 0) {
      chapter = this.data.objectArray1[this.data.index1];
    }else {
      wx.showModal({
        title: '本课程没有章节，无法进行下一步',
      });
      return false;
    }
    wx.navigateTo({
      url: '/pages/course/preview/preview?chapterId=' + chapter.id + '&chapterName=' + chapter.text
    })
  },
})