// pages/notes/afterClass/afterClass.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userStars: [
      'http://118.24.120.43:8611/img/icon/star-active.png',
      'http://118.24.120.43:8611/img/icon/star-active.png',
      'http://118.24.120.43:8611/img/icon/star-active.png',
      'http://118.24.120.43:8611/img/icon/star-active.png',
      'http://118.24.120.43:8611/img/icon/star.png'
    ],
    imgLIst: [
      {
        url: `http://118.24.120.43:8611/img/icon/r_icon_g.png`,
        hoverUrl: `http://118.24.120.43:8611/img/icon/r_icon.png`
      },
      {
        url: `http://118.24.120.43:8611/img/icon/w_icon_g.png`,
        hoverUrl: `http://118.24.120.43:8611/img/icon/w_icon.png`
      },
    ]
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      chapter: options,
      className: wx.getStorageSync('className'),
      portrait: wx.getStorageSync('portrait')
    });
    this.loadKnowPoints();
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
   * 根据章节id加载预习练习题目
   */
  loadExerciseList: function () {
    var that = this;
    let postData = {
      "chapterId": this.data.chapter.chapterId,
      "courseId": wx.getStorageSync('courseId'),
      "exeBookType": "3"
    };
    getApp().agriknow.loadExerciseList(postData).then(res => {
      console.log(res.data);

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
    postData.exeBookType = 3;
    postData.preview = 'after';
    postData.chapterId = this.data.chapter.chapterId;
    postData.courseId = wx.getStorageSync('courseId');
    postData.classId = wx.getStorageSync('classId');
    postData.chapterName = this.data.chapter.chapterName;

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

  //评价
  evaluate: function() {
    wx.showActionSheet({
      itemList: ['5分', '4分', '3分', '2分', '1分'],
      success(res) {
        console.log(res.tapIndex)
      },
      fail(res) {
        console.log(res.errMsg)
      }
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