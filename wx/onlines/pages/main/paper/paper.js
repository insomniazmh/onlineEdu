// pages/main/paper/paper.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeName: '0',
    upLoadImg: [],
  },
  onChange(event) {
    this.setData({
      activeName: event.detail
    });
  },
  // 点击上传图片
  chooseImage: function () {
    var that = this;
    wx.chooseImage({
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        wx.uploadFile({
          // url: 'https://e.hnfts.cn/upload/upload',
          filePath: tempFilePaths[0],
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
            arr.push(img.fileUrl);
            // 将拼装完的临时变量放回data中的uploadImg中
            that.setData({
              upLoadImg: arr
            })
          }
        })
      },
    })
  },
  // 点击删除图片
  deleteImg: function (e) {
    var that = this;
    // 获取data中uploadImg数组
    var arr = that.data.upLoadImg;
    // 循环uploadImg数组
    for (var i = 0; i < arr.length; i++) {
      // 如果id和url相同,删除id
      if (arr[i] == e.currentTarget.id) {
        arr.splice(i, 1);
      }
    }
    // 删除结果返回
    that.setData({
      upLoadImg: arr
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
})