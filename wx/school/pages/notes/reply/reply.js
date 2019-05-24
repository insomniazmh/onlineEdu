// pages/release/release.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },
  
  /**x`
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(getApp().globalData.articleId);//查看帖子id是否传成功
    console.log(options.title);//查看帖子title是否传成功
    this.setData({
      articleId: getApp().globalData.articleId,
      title: options.title
    });
  },
  bindFormSubmit: function (e) {
    var postData = {
      articleId: this.data.articleId,
      content: e.detail.value.textarea,
      userId: wx.getStorageSync('studentId'),
      userType: "S"
    }
    console.log(postData);
    getApp().agriknow.notesCommentadded(postData).then(res => {
      wx.showToast({
        title: '评论成功',
        icon: 'success',
        duration: 2000
      });
      setTimeout(function (){
        wx.navigateBack({
          delta: 1
        });
      }, '1000');
    })
    .catch(res => {
      //wx.stopPullDownRefresh()
    });
  }

})