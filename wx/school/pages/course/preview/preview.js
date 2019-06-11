// pages/notes/classRoom/classRoom.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingHidden: true,
    currentQuestion: {},
    questionList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      chapter: options
    });
    this.loadKnowPoints();
    this.loadDatumList();
    this.loadExerciseList();
  },

  /**
   * 根据章节加载知识点
   */
  loadKnowPoints: function () {
    var postData = {
      chapterId: this.data.chapter.chapterId
    }
    getApp().agriknow.loadKnowPoints(postData).then(res => {
      console.log(res.data);
      that.setData({
        knowPoints: res.data
      });
    })
    .catch(res => {
      //wx.stopPullDownRefresh()
    });
  },

  /**
   * 根据章节加载资料
   */
  loadDatumList: function () {
    var that = this;
    var postData = {
      courseId: wx.getStorageSync('courseId'),
      chapterId: this.data.chapter.chapterId,
      datumArea: 3,
      sortVo: {
        "isValidated": "0",
        "page": 0,
        "size": 10,
        "sort": 1
      }
    }
    getApp().agriknow.loadDatumList(postData).then(res => {
      var knowPoints = res.data;
      var videoList = [];//视频
      var audioList = [];//音频
      var linkList = [];//链接
      var docList = [];//文档
      for(let i=0;i<knowPoints.length;i++) {
        if (knowPoints[i].datumType == '1') {
          docList.push(knowPoints[i]);
        } else if (knowPoints[i].datumType == '3') {
          videoList.push(knowPoints[i]);
        } else if (knowPoints[i].datumType == '4') {
          audioList.push(knowPoints[i]);
        } else if (knowPoints[i].datumType == '5') {
          linkList.push(knowPoints[i]);
        }
      }
      
      that.setData({
        videoList: videoList,
        audioList: audioList,
        linkList: linkList,
        docList: docList
      });
    })
    .catch(res => {
      //wx.stopPullDownRefresh()
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
   * 根据章节id加载预习练习题目
   */
  loadExerciseList: function () {
    var that = this;
    let postData = {
      "chapterId": this.data.chapter.chapterId,
      "courseId": wx.getStorageSync('courseId'),
      "exeBookType": "2"
    };
    getApp().agriknow.loadExerciseList(postData).then(res => {
      var questions = res.data;
      for (let i = 0; i < questions.length; i++) {
        questions[i].cut = '';
      }
      that.setData({
        questionList: questions,
        currentQuestion: questions[0]
      });
      that.wrapQuestion();
    });
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
    var that = this;
    postData.exeBookType = 2;
    postData.preview = 'before';
    postData.chapterId = this.data.chapter.chapterId;
    postData.courseId = wx.getStorageSync('courseId');
    postData.classId = wx.getStorageSync('classId');

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

          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 2000
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