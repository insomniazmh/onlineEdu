// pages/reply/reply.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    objectArray: [
      {id: 0,name: '电子商务'},
      {id: 1,name: '商务英语'},
      {id: 2,name: '计算机基础'},
      {id: 3,name: '马克思列宁主义'}
    ],
    upLoadImg:[],
    index:1,
    inputValue:"",
  },

  switch1Change(e){
    console.log('swtch发生改变,')
  },

  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },

  /**
   * 获取帖子标题
   */
  bindKeyinput(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  //获取帖子内容并立即发帖
  bindFormSubmit(e) {
    this.saveNote(e.detail.value.textarea);
  },

  saveNote: function (content) {
    var that = this;
    var description = "";
    if (content.length > 20) {
      description = content.substring(0, 20) + '...';
    }else {
      description = content;
    }
    var postData = {
      articleConten: content,
      articleType:"xd",
      classId:'1611',
      courseId:"2c9180846827407401682b57f4a60000",
      description: description,
      // images: this.data.upLoadImg,
      title: this.data.inputValue,
      userId: wx.getStorageSync('studentId')
    };
    console.log(postData)
    getApp().agriknow.notesPosted(postData).then(res => {
      wx.showToast({
        title: '发帖成功',
        icon: 'success',
        duration: 2000
      });
      setTimeout(function () {
        wx.navigateBack({
          delta: 1
        });
      }, '1000');
    })
      .catch(res => {
        //wx.stopPullDownRefresh()
      });
  },


  // 点击上传图片
  chooseImage: function(){
    var that = this;
    wx.chooseImage({
      success: function(res) {
        var tempFilePaths = res.tempFilePaths;
        wx.uploadFile({
          url: 'https://e.hnfts.cn/upload/upload',
          filePath: tempFilePaths[0],
          name: 'file',
          formData:{
            'user':'test'
          },
          // 上传
          success(res) {
            // console.log(res);
            // 获取data中uploadImg中的数据,并存入临时变量arr中
            var arr = that.data.upLoadImg;
            // 接收服务器返回参数并转换为JSON对象
            var img = JSON.parse(res.data)
            // 将返回的图片地址存入临时变量arr中
            arr.push(img.fileUrl);
            // 将拼装完的临时变量放回data中的uploadImg中
            that.setData({
              upLoadImg:arr
            })
          }
        })
      },
    })
  },
  // 点击删除图片
  deleteImg: function(e){
    var that = this;
    // 获取data中uploadImg数组
    var arr = that.data.upLoadImg;
    // 循环uploadImg数组
    for(var i=0;i<arr.length;i++){
      // 如果id和url相同,删除id
      if(arr[i] == e.currentTarget.id){
        arr.splice(i,1);
      }
    }
    // 删除结果返回
    that.setData({
      upLoadImg:arr
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
})