var WxParse = require('../../wxParse/wxParse.js');

Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    singleQuestion: {
      type: Object,
      value: {},
      observer(newVal, oldVal, changedPath) {
        // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
        // 通常 newVal 就是新设置的数据， oldVal 是旧数据
        console.log(newVal);
      }
    }
  },
  data: {
    // 这里是一些组件内部数据
    showSub: false,
    radioindex: null,
    checkboxIndex: [],
    checkTOF: true,
    optsValue: ["A", "B", "C", "D", "E", "F"],
    answer: ""
  },
  lifetimes: {
    attached() {
      
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  methods: {
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
      return false;
      wx.request({
        method: "post",
        url: 'https://' + getApp().globalData.url + '/quiz/interact/send/answer',
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

    /**点击举手按钮 */
    bindRaise: function (e) {
      wx.request({
        method: "post",
        url: 'https://' + getApp().globalData.url + '/quiz/interact/raise',
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
    }
  }
})