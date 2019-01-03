// pages/haveClass/haveClass.js
var WxParse = require('../../wxParse/wxParse.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    radioindex: 0,
    optsValue: ["A", "B", "C", "D", "E", "F"]
  },

  /**点击答案选项 */
  bindradio: function (e) {
    var that = this;//作用域
    that.setData({ radioindex: e.target.dataset.id });
  },

  /**点击确定按钮提交答案 */
  bindSub: function (e) {
    var that =this;
    var postData = {
      "answer": "",
      "circleId": getApp().globalData.circleId,
      "cut": that.data.cut,
      "examineeId": getApp().globalData.studentId,
      "questionId": that.data.questionId
    };

    if (that.data.questionType == 'single') {
      if (that.data.radioindex) {
        postData.answer = that.data.optsValue[that.data.radioindex];
      }else {
        postData.answer = "A";
      }
    }

    wx.request({
      method: "post",
      url: 'https://e.hnfts.cn/quiz/interact/send/answer',
      data: postData,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        if (res.data.ret == 0) {
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 2000
          });
        }
      }
    })
  },

  /**点击举手按钮 */
  bindRaise: function (e) {
    wx.request({
      method: "post",
      url: 'https://e.hnfts.cn/quiz/interact/raise',
      data: {
        "circleId": getApp().globalData.circleId,
        "examineeId": getApp().globalData.studentId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        if (res.data.ret == 0) {
          wx.showToast({
            title: '举手成功，等待老师选人',
            icon: 'none',
            duration: 2000
          });
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var random = Math.random().toString(36).substr(2);//生成随机数
    var that = this;

    //模拟学生扫码进入
    wx.request({
      method: "post",
      url: 'https://e.hnfts.cn/quiz/classRoom/join/interactiveRoom',
      data: {
        examineeId: getApp().globalData.studentId,
        circleId: getApp().globalData.circleId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
      }
    })

    //开启websocket连接
    wx.connectSocket({
      url: "wss://e.hnfts.cn/websocket/interactive/" + getApp().globalData.circleId + "/" + getApp().globalData.studentId+"/student/"+ random,
      header: {
        'content-type': 'application/json'
      },
      protocols: ['protocol1'],
      method: 'GET'
    })
 
    wx.onSocketOpen(function() {
      console.log(123);
    })

    //接收服务器返回信息
    wx.onSocketMessage(function(res){
      var data = JSON.parse(res.data);
      console.log(data);
      //如果推送类型为问题，显示出来
      if (data.model == "questions") {
        that.setData({ 
          questionId: data.bigQuestion.id,
          cut: data.cut
        });
        WxParse.wxParse('title', 'html', data.bigQuestion.examChildren[0].choiceQstTxt, that, 5);//拼装问题title

        if (data.bigQuestion.examChildren[0].examType == "single") {//单选的情况
          that.setData({ questionType: "single" });
          //拼装选项
          var opts = data.bigQuestion.examChildren[0].optChildren;
          for (let i = 0; i < opts.length; i++) {
            WxParse.wxParse('opt' + i, 'html', opts[i].optTxt, that);
            if (i === opts.length - 1) {
              WxParse.wxParseTemArray("optArray", 'opt', opts.length, that)
            }
          }
        }

        if (data.participate == "raise" && data.bigQuestion.selected=="2") {//需要先举手
          that.setData({ raiseFlag: true });
        }else {
          that.setData({ raiseFlag: false });
        }
      }
      
    })

    wx.onSocketError(function(res) {
      console.log(res);
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