// pages/practice/practice.js
var WxParse = require('../../wxParse/wxParse.js');
const webSocket = require('../../utils/websocket.js'); 

Page({
  /**
   * 页面的初始数据
   */
  data: {
    showSub: false,
    radioindex: null,
    checkboxIndex: [],
    checkTOF: true,
    optsValue: ["A", "B", "C", "D", "E", "F"],
    answer: "",
      questionList: [{
        id: 1,
        text: 'question1'
      }, {
          id: 2,
          text: 'question2'
      }]
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var random = Math.random().toString(36).substr(2);//生成随机数
    var that = this;
    console.log(random);
    console.log(getApp().globalData.circleId);
    if (getApp().globalData.circleId && getApp().globalData.studentId && random) {
      // 创建连接
      webSocket.connectSocket({
        url: "wss://e.hnfts.cn/websocket/interactive/" + getApp().globalData.circleId
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
        questionList[i].done = true;
      }
    }
    this.setData({ questionList: questionList });
    console.log(this.data.questionList);
  },

  /**点击单选答案选项 */
  bindradio: function (e) {
    var that = this;
    this.setData({ radioindex: e.currentTarget.dataset.id });
    this.setData({ answer: that.data.optsValue[that.data.radioindex] });
  },

  /**点击多选答案选项 */
  bindCheckbox: function (e) {
    var id = e.currentTarget.dataset.id;//获取当前dom元素绑定数据：index
    var that = this;
    var dataArr = that.data.checkboxIndex;//获取当前多选信息数组
    var flag = true;
    if (dataArr.length > 0) {//如果被点击的选项index在数组中存在，则删除之
      for (var i = 0; i < dataArr.length; i++) {
        if (dataArr[i] == id) {
          dataArr.splice(i, 1);
          flag = false;
        }
      }
    }

    if (flag && (id || id == 0)) {//如果被点击的选项index在数组中不存在，则push之
      dataArr.push(id);
    }

    that.setData({ checkboxIndex: dataArr });//将更新过的数据重新传人data
    var answer = "";
    console.log(dataArr);
    for (var item in dataArr) {//遍历index,取对应的A，B，C，D保存至答案变量
      answer += that.data.optsValue[dataArr[item]];
    }
    that.setData({ answer: answer });//将答案变量赋入data
  },

  /**点击判断答案选项 */
  bindTOF: function (e) {
    if (e.currentTarget.dataset.id == 1) {
      this.setData({
        checkTOF: true,
        answer: true
      });
    } else if (e.currentTarget.dataset.id == 2) {
      this.setData({
        checkTOF: false,
        answer: false
      });
    }
  },

  /**点击确定按钮提交答案 */
  bindSub: function (e) {
    var that = this;
    var postData = {
      "answer": that.data.answer,
      "circleId": getApp().globalData.circleId,
      "cut": that.data.cut,
      "examineeId": getApp().globalData.studentId,
      "questionId": that.data.questionId
    };
    console.log(postData);
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

  /**点击确定按钮提交答案 */
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    this.setData({ answer: e.detail.value.answer });
    this.bindSub(null);
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
      if (data.model == "bookQuestion") {
        that.setData({
          showSub: true,
          radioindex: null,
          checkboxIndex: [],
          answer: "",

          questionId: data.bigQuestion.id,
          cut: data.cut
        });

        if (data.bigQuestion.examChildren[0].examType == "single") {//单选题
          WxParse.wxParse('title', 'html', data.bigQuestion.examChildren[0].choiceQstTxt + "（单选）", that, 5);//拼装问题title
          that.setData({ questionType: "single" });
          //拼装选项
          var opts = data.bigQuestion.examChildren[0].optChildren;
          for (let i = 0; i < opts.length; i++) {
            WxParse.wxParse('opt' + i, 'html', opts[i].optTxt, that);
            if (i === opts.length - 1) {
              WxParse.wxParseTemArray("optArray", 'opt', opts.length, that)
            }
          }
        } else if (data.bigQuestion.examChildren[0].examType == "multiple") {//多选题
          WxParse.wxParse('title', 'html', data.bigQuestion.examChildren[0].choiceQstTxt + "（多选）", that, 5);//拼装问题title
          that.setData({ questionType: "multiple" });
          //拼装选项
          var opts = data.bigQuestion.examChildren[0].optChildren;
          for (let i = 0; i < opts.length; i++) {
            WxParse.wxParse('opt' + i, 'html', opts[i].optTxt, that);
            if (i === opts.length - 1) {
              WxParse.wxParseTemArray("optArray", 'opt', opts.length, that)
            }
          }
        } else if (data.bigQuestion.examChildren[0].examType == "trueOrFalse") {//判断题
          WxParse.wxParse('title', 'html', data.bigQuestion.examChildren[0].trueOrFalseInfo + "（判断）", that, 5);//拼装问题title
          that.setData({ questionType: "trueOrFalse" });
        } else if (data.bigQuestion.examChildren[0].examType == "design") {//主观题
          WxParse.wxParse('title', 'html', data.bigQuestion.examChildren[0].designQuestion + "（主观）", that, 5);//拼装问题title
          that.setData({
            questionType: "design",
            showSub: false
          });
        }
      }
    }

  }
})