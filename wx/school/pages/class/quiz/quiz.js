// pages/class/quiz/quiz.js
const webSocket = require('../../../utils/websocket.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {

  },

  // socket收到的信息回调
  onSocketMessageCallback: function (res) {
    var that = this;
    var data = JSON.parse(res);
    console.log('收到消息回调', res)
    if (data.model == 'pong') {
      console.log('******pong*********');
    } else {
      //如果推送类型为问题，显示出来
      if (data.model == "questions") {
        that.setData({
          currentQuestion: data
        });

        //回调接口，告诉服务器已经收到信息
        getApp().agriknow.delSelectStu({
          circleId: getApp().globalData.circleId,
          stuId: wx.getStorageSync("studentId")
        }).then(res => {
          console.log(res);
        });
      }
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var random = Math.random().toString(36).substr(2);//生成随机数
    var that = this;
    if (getApp().globalData.circleId && random) {
      // 创建连接
      webSocket.connectSocket({
        url: "wss://" + getApp().globalData.url + "/websocket/interactive/" + getApp().globalData.circleId
          + "/" + wx.getStorageSync("token") + "/" + random
        // url: "wss://" + getApp().globalData.url + "/websocket/interactive/" + getApp().globalData.circleId
        //   + "/" + wx.getStorageSync("studentId") + "/student/" + random
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
   * 接收question组件提交信息
   */
  onSubQuestion(e) {
    //e.detail // 自定义组件触发事件时提供的detail对象
    var postData = e.detail;

    getApp().agriknow.answerQuiz(postData)
      .then(res => {
        console.log(res);
        if (res.ret == 0) {
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
   * 接收question组件举手信息
   */
  onRaise(e) {
    var postData = e.detail;
    getApp().agriknow.raise(postData)
      .then(res => {
        if (res.data.ret == 0) {
          wx.showToast({
            title: '举手成功，等待老师选人',
            icon: 'none',
            duration: 2000
          });
        }
      })
      .catch(res => {
        //wx.stopPullDownRefresh()
      });
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('unload');
    // 页面销毁时关闭连接
    webSocket.closeSocket();
  },
})