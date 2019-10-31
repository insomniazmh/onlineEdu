// pages/videoMaterial/videoMaterial.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    activeNames: 1,
    linshiFlag: 0,//临时控制默认显示章节
    videoUrl: '',//视频课件url
    docDatum: [],//文档资料
    audioDatum: [],//音频资料
    videoDatum: [],//视频资料
    courseDescribe: '',//课程描述
    chapterList:[]//章节
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
    let that = this

    
      
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
          res.data[i].index = i+1
          chapterList.push(res.data[i])
        }else {
          for (let y = 0; y < chapterList.length; y++) {
            if (res.data[i].parent == chapterList[y].id) {
              chapterList[y].children.push(res.data[i])
            }
            if(that.data.linshiFlag == 0) {
              this.setData({
                chapterId: res.data[i].id
              })
              this.loadVideo(res.data[i].id)
              this.loadDatumList(res.data[i].id)
              this.loadExerciseList(res.data[i].id)
              that.setData({
                linshiFlag: 1
              })
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
    this.setData({
      chapterId: e.currentTarget.dataset.id
    })
    this.loadVideo(e.currentTarget.dataset.id)
    this.loadDatumList(e.currentTarget.dataset.id)
    this.loadExerciseList(e.currentTarget.dataset.id)
  },

  //加载视频课件
  loadVideo: function(chapterId) {
    let that = this
    this.videoContext.pause()
    getApp().agriknow.loadVideo({
      chapterId: chapterId,
      courseId: that.data.courseId
    }).then(res => {
      console.log(res.data[0])
      if (res.data[0]) {
        that.setData({
          videoUrl: res.data[0].fileUrl,
          videoDuration: res.data[0].videoTime
        })
      }else {
        that.setData({
          videoUrl: '',
          videoDuration: 0
        })
      }
      
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
      let datumList = res.data
      let docList = []
      let audioList = []
      let videoList = []
      for (let i = 0; i < datumList.length; i++) {
        if (datumList[i].datumType == '1') {
          docList.push(datumList[i])
        } else if (datumList[i].datumType == '3') {
          videoList.push(datumList[i])
        } else if (datumList[i].datumType == '4') {
          audioList.push(datumList[i])
        }
      }
      that.setData({
        docDatum: docList,
        audioDatum: audioList,
        videoDatum: videoList
      })
    }).catch(res => {
      //wx.stopPullDownRefresh()
    })
  },

  //加载章节练习题(快照)
  loadExerciseList: function (chapterId) {
    let that = this
    getApp().agriknow.snapshot({
      chapterId: chapterId,
      number: 3
    }).then(res => {
      if (res.ret == 0 && res.data.length>0) {
        var questions = res.data;
        for (let i = 0; i < questions.length; i++) {
          questions[i].cut = '';
          if (questions[i].stuAnswer) {
            questions[i].done = true;
          }
        }
        that.setData({
          questionList: questions,
          currentQuestion: questions[0]
        });
        that.wrapQuestion();
      }
    }).catch(res => {
      //wx.stopPullDownRefresh()
    })
  },

  /**点击上面按钮切换题目 */
  bindtab: function (e) {
    console.log(e.currentTarget.dataset.id);
    var questionList = this.data.questionList;
    for (let i = 0; i < questionList.length; i++) {
      if (e.currentTarget.dataset.id == questionList[i].id) {
        this.setData({ currentQuestion: questionList[i] });
        this.wrapQuestion();
      }
    }
  },

  /**
   * 接收question组件提交信息
   */
  onSubQuestion: function (e) {
    var postData = e.detail;
    console.log(e)
    var that = this;
    postData.chapterId = this.data.chapterId;
    postData.courseId = this.data.courseId;
    postData.classId = wx.getStorageSync('classId');
    postData.chapterName = 'xxx';

    getApp().agriknow.answerSelfTest(postData)
      .then(res => {
        if (res.ret == 0) {
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 2000
          });
          var questionList = that.data.questionList;
          for (let i = 0; i < questionList.length; i++) {
            if (questionList[i].id == that.data.currentQuestion.id) {
              questionList[i].done = true;
              questionList[i].myAnswer = postData.answer;
            }
          }
          that.setData({
            questionList: questionList
          });
        }
      })
      .catch(res => {
        //wx.stopPullDownRefresh()
      });
  },

  /**
   * 封装currentQuestion给question组件使用
   */
  wrapQuestion: function () {
    var wrapedCurrQuestion = {
      bigQuestion: this.data.currentQuestion,
      cut: '',
      participate: ""
    };
    this.setData({
      wrapedCurrQuestion: wrapedCurrQuestion
    });
  },

  /**
   * 播放进度变化时触发，可获取总时长和当前播放时长
   */
  timeupdate: function (e) {
    console.log(e);
    this.setData({
      locationTime: e.detail.currentTime.toFixed(0),
      duration: (e.timeStamp / 1000).toFixed(0)
    })
  },

  videoParse: function(e) {
    console.log('视频暂停了')
    clearInterval(this.data.intervalIndex)
  },

  videoPlay: function(e) {
    let that = this
    console.log('视频播放了')
    let index = setInterval(function () {
      if (that.data.videoDuration && that.data.locationTime) {
        let postData = {
          chapterId: that.data.chapterId,
          courseId: that.data.courseId,
          duration: that.data.locationTime,
          locationTime: that.data.locationTime,
          studentId: wx.getStorageSync('studentId'),
          videoDuration: that.data.videoDuration
        }

        getApp().agriknow.saveChapterRecord(postData)
          .then(res => {

          })
          .catch(res => {
            //wx.stopPullDownRefresh()
          });

      }
    }, 3000)
    this.setData({
      intervalIndex: index
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.videoContext = wx.createVideoContext('video');
  },

  //章节列表插件要求写法
  onChange(event) {
    console.log(event.detail)
    this.setData({
      activeNames: event.detail
    });
  },

  /**
   * 下载资料
   */
  download: function (e) {
    var that = this;
    this.setData({
      loadingHidden: false
    });
    wx.downloadFile({
      url: e.currentTarget.dataset.url,
      success(res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          that.setData({
            loadingHidden: true
          });
          console.log(res.tempFilePath)
          // 保存图片到本地
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: function (data) {
              wx.showModal({
                title: '下载成功',
                content: '图片以保存至您的手机',
              })
            },
          });

          wx.openDocument({
            filePath: res.tempFilePath,
            success: function (res) {
              console.log('打开文档成功')
            }
          })

        }
      }
    })
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