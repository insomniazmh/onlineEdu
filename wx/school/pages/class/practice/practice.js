// pages/practice/practice.js
const webSocket = require('../../../utils/websocket.js'); 

Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentQuestion: {},
    questionList: []
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var random = Math.random().toString(36).substr(2);//生成随机数
    var that = this;
    if (getApp().globalData.circleId && getApp().globalData.studentId && random) {
      // 创建连接
      webSocket.connectSocket({
        url: "wss://" + getApp().globalData.url + "/websocket/interactive/" + getApp().globalData.circleId
          + "/" + getApp().globalData.studentId + "/student/" + random
      });
      // 设置接收消息回调
      webSocket.onSocketMessageCallback = this.onSocketMessageCallback;
    } else {
      wx.showToast({
        title: '网络异常，请退出重试',
        icon: 'none',
        duration: 2000
      });
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('unload');
    // 页面销毁时关闭连接
    webSocket.closeSocket();
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
    wx.request({
      method: "post",
      url: 'https://' + getApp().globalData.url + '/quiz/interact/sendBook/answer',
      data: postData,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        if (res.data.ret == 0) {
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
      }
    })
  },

  // socket收到的信息回调
  onSocketMessageCallback: function (res) {
    var that = this;
    var data = JSON.parse(res);
    if (data.model == 'pong') {
      console.log('******pong*********');
    } else {
      //如果推送类型为问题，显示出来
      if (data.model == "bookQuestion") {
        //拼装cut
        for (let i = 0; i < data.bookQuestions.length; i++) {
          data.bookQuestions[i].cut = data.cut;
        }
        //如果为第一次收到题目，则直接赋值，如果不是第一次，则将收到题目与现有题目合并
        if(that.data.questionList.length > 0) {
          var quesArr = that.data.questionList;
          for (let i = 0; i < data.bookQuestions.length; i++) {
            quesArr.push(data.bookQuestions[i]);
          }
          that.setData({
            questionList: quesArr
          });
        }else {
          that.setData({
            questionList: data.bookQuestions,
            currentQuestion: data.bookQuestions[0]
          });
          that.wrapQuestion();
        }
      }
    }
  },

  /**
   * 封装currentQuestion给question组件使用
   */
  wrapQuestion: function() {
    var wrapedCurrQuestion = {
      bigQuestion: this.data.currentQuestion,
      cut: this.data.currentQuestion.cut,
      participate: ""
    };
    this.setData({
      wrapedCurrQuestion: wrapedCurrQuestion
    });
  }

})