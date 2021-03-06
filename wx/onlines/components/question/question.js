Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    singleQuestion: {
      type: Object,
      value: {},
      observer(newVal, oldVal, changedPath) {
        // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
        // 通常 newVal 就是新设置的数据， oldVal 是旧数据
        this.setData({
          userType: wx.getStorageSync('roleId')
        })
        if (newVal && newVal.bigQuestion) {
          console.log(newVal)
          if (newVal.bigQuestion.id) {
            this.loadQuestion(newVal);
          }else {
            this.setData({
              title: '',
              questionType: '',
              analysiShow: false,
              showSub: false
            })
          }
          
        }
      }
    }
  },
  data: {
    //这里是一些组件内部数据
    showSub: false,
    checkTOF: true,
    analysiShow: false,
    answer: "",
    userType: wx.getStorageSync('roleId'),
    upLoadImg: []
  },
  methods: {
    /**点击单选答案选项 */
    bindradio: function (e) {
      var id = e.currentTarget.dataset.id;//获取当前dom元素绑定数据：index
      var opts = this.data.opts;//获取所有选项
      //循环选项，将所有的选项的选中状态都去除
      for (var item in opts) {
        opts[item].selected = false;
      }
      opts[id].selected = true;//给当前点击的选中加上选中状态
      //将答案和修改姑的选项重新赋予data中
      this.setData({ 
        opts: opts,
        answer: opts[id].optValue
     });
    },

    /**点击多选答案选项 */
    bindCheckbox: function (e) {
      var answer = '';
      var id = e.currentTarget.dataset.id;//获取当前dom元素绑定数据：index
      var opts = this.data.opts;//获取所有选项
      opts[id].selected = !opts[id].selected;//改变被点击的选项的选中状态
      console.log(opts[id]);
      //将改变的后的选项赋予data中
      this.setData({
        opts: opts
      });
      //循环选项，将被选中的选项拼装成答案
      for (var item in opts) {
        if (opts[item].selected)
          answer += opts[item].optValue;
      }
      this.setData({ answer: answer });//将答案变量赋入data
    },

    /**点击判断答案选项 */
    bindTOF: function (e) {
      console.log(this.data.userType)
      if (e.currentTarget.dataset.id == 1) {
        this.setData({
          checkTOF: true,
          answer: "Y"
        });
      } else if (e.currentTarget.dataset.id == 2) {
        this.setData({
          checkTOF: false,
          answer: "N"
        });
      }
    },
    
    /**点击确定按钮提交答案（客观题） */
    bindSub: function (e) {
      var that = this;
      var postData = {
        "stuAnswer": that.data.answer,
        "circleId": getApp().globalData.circleId,
        "cut": that.data.cut,
        "examineeId": wx.getStorageSync("studentId"),
        "questionId": that.data.questionId,
        fileList: that.data.upLoadImg,
        "token": wx.getStorageSync('token')
      };
      console.log(that.data.answer);
      if (that.data.answer == "") {
        wx.showToast({
          title: '答案不能为空',
          icon: 'none'
        })
      }else {
        this.triggerEvent('subQuestion', postData);
      }
    },

    /**点击确定按钮提交答案（主观题） */
    formSubmit: function (e) {
      console.log(123456);
      console.log('form发生了submit事件，携带数据为：', e.detail.value);
      this.setData({ 
        answer: e.detail.value.answer,
        showSub: false
      });
      this.bindSub(null);
    },

    /**点击举手按钮 */
    bindRaise: function (e) {
      var postData = {
        "circleId": getApp().globalData.circleId,
        "examineeId": wx.getStorageSync("studentId"),
        "questionId": this.data.questionId,
      }
      this.triggerEvent('raise', postData);
      this.setData({ raiseFlag: false });
    },

    /**拼装显示题目 */
    loadQuestion: function (data) {
      var that = this;
      that.setData({
        showSub: true,//提交按钮是否显示
        raiseFlag: false,//举手按钮是否显示
        designFlag: false,//主观题的提交和重置按钮是否显示
        answer: "",
        upLoadImg: [],
        questionId: data.bigQuestion.id,
        cut: data.cut
      });

      if (data.bigQuestion.examType == "single") {//单选题
        that.setData({ 
          questionType: "single",
          title: data.bigQuestion.choiceQstTxt + "（单选）",//标题
          opts: data.bigQuestion.optChildren//选项
        });
      } else if (data.bigQuestion.examType == "multiple") {//多选题
        that.setData({ 
          questionType: "multiple",
          title: data.bigQuestion.choiceQstTxt,//标题
          opts: data.bigQuestion.optChildren//选项
        });
      } else if (data.bigQuestion.examType == "trueOrFalse") {//判断题
        that.setData({ 
          questionType: "trueOrFalse",
          answer: "Y",
          title: data.bigQuestion.choiceQstTxt + "（判断）"
        });
      } else if (data.bigQuestion.examType == "design") {//主观题
        that.setData({
          questionType: "design",
          title: data.bigQuestion.choiceQstTxt + "（主观）",
          designFlag: true,
          showSub: false
        });
      }

      if (data.participate == "raise") {//需要先举手
        that.setData({ 
          raiseFlag: true,
          showSub: false,
          designFlag: false
        });
      }

      if (data.bigQuestion.stuAnswer) {//已经回答过，需显示答案
        that.setData({
          raiseFlag: false,
          showSub: false,
          designFlag: false,
          analysiShow: true,
          stuAnswer: data.bigQuestion.stuAnswer,
          rightAnswer: data.bigQuestion.answer,
          analysis: data.bigQuestion.analysis
        });
      }else {
        that.setData({
          analysiShow: false
        });
      }

      if (data.bigQuestion.myAnswer) {
        that.setData({ answer: data.bigQuestion.myAnswer });
      }
    },

    // 点击上传图片
    chooseImage: function () {
      var that = this;
      wx.chooseImage({
        success: function (res) {
          var tempFilePaths = res.tempFilePaths;
          for(let i=0;i<tempFilePaths.length;i++) {
            wx.uploadFile({
              url: 'https://e.hnfts.cn/upload/upload',
              filePath: tempFilePaths[i],
              name: 'file',
              formData: {
                'user': 'test'
              },
              // 上传
              success(res) {
                // console.log(res);
                // 获取data中uploadImg中的数据,并存入临时变量arr中
                var arr = that.data.upLoadImg;
                // 接收服务器返回参数并转换为JSON对象
                var img = JSON.parse(res.data)
                // 将返回的图片地址存入临时变量arr中
                arr.push(img);
                // 将拼装完的临时变量放回data中的uploadImg中
                that.setData({
                  upLoadImg: arr
                })
              }
            })
          }
        },
      })
    },
    // 点击删除图片
    deleteImg: function (e) {
      console.log(e);
      console.log(this.data.upLoadImg);
      // 获取data中uploadImg数组
      var arr = this.data.upLoadImg;
      // 循环uploadImg数组
      for (var i = 0; i < arr.length; i++) {
        // 如果id和url相同,删除id
        if (arr[i].fileUrl == e.currentTarget.id) {
          arr.splice(i, 1);
        }
      }
      // 删除结果返回
      this.setData({
        upLoadImg: arr
      })
    }
  }

  
})