// pages/class/strom/strom.js
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
      if (data.model == "brainstormQuestion") {
        var wrapedCurrQuestion = {
          bigQuestion: data.brainstormQuestion[0],
          cut: data.cut,
          participate: ""
        };
        this.setData({
          currentQuestion: wrapedCurrQuestion
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
    console.log(random);
    console.log(getApp().globalData.circleId);
    if (getApp().globalData.circleId && random) {
      // 创建连接
      webSocket.connectSocket({
        url: "wss://" + getApp().globalData.url + "/websocket/interactive/" + getApp().globalData.circleId
          + "/" + wx.getStorageSync("token") + "/" + random
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

    getApp().agriknow.answerStrom(postData)
      .then(res => {
        if (res.data.ret == 0) {
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
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('unload');
    // 页面销毁时关闭连接
    webSocket.closeSocket();
  },
})