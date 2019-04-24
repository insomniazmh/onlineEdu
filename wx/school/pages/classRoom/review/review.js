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
    ],
    imgHoverIndex: 0,
    texts:"至少输入5个字!",
    min:5,  //最少字数
    max:200 //最大字数
  },
  chooseThis(e) {
    this.setData({
      imgHoverIndex: e.currentTarget.dataset.index
    })
  },
    // 字数限制
  count:function(e){
    // 获取输入框内容
    var value = e.detail.value;
    // 获取输入框内容长度
    var len = parseInt(value.length);
    // 最少字数限制
    if(len <= this.data.min)
      this.setData({
        texts:""
      })
      else if(len > this.data.min){
        this.setData({
          texts:""
        })
        // 最多字数限制
      if(len > this.data.max) return;
      // 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行
        this.setData({
          currentWordNumber:len  //当前字数
        })
      }
  }, 
  // 星星点击事件
  starTap: function (e) {
    var index = e.currentTarget.dataset.index; // 获取当前点击的是第几颗星星
    var tempUserStars = this.data.userStars; // 暂存星星数组
    var len = tempUserStars.length; // 获取星星数组的长度
    for (var i = 0; i < len; i++) {
      if (i <= index) { // 小于等于index的是满心
        tempUserStars[i] = 'http://118.24.120.43:8611/img/star-active.png'
      } else { // 其他是空心
        tempUserStars[i] = 'http://118.24.120.43:8611/img/star.png'
      }
    }
    // 重新赋值就可以显示了
    this.setData({
      userStars: tempUserStars
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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