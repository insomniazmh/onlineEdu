// pages/page/page.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    likeFlag: '',
    likeCount: 1321,
    collectFlag: '',
    collectCount:200,
    pageContent:{},
    
  },
  jumpRep(){
    wx.navigateTo({
      url: '../textarea/textarea',
    })
  },
    reply:function(){
      wx.navigateTo({
        url: '../reply/reply',
      })
    },
    release: function () {
    wx.navigateTo({
      url: '../release/release',
    })
  },
  changelike: function () {
    let count = this.data.likeCount;
    if (this.data.likeFlag == '') {
      count++;
      this.setData({
        likeFlag: 'red',
        likeCount: count
      });
      wx.showToast({
        title: '点赞成功',
        icon: 'success',
        duration: 2000
      })
    }else {
      count--;
      this.setData({
        likeFlag: '',
        likeCount:count
      });
      wx.showToast({
        title: '取消点赞',
        icon: 'success',
        duration: 2000
      })
    }
  },
  changeCollect(){
    let number = this.data.collectCount;
    var that = this;
    var postData = {
      id: "43f6cc2ab62a44cd8f76cde19de0a4d8"
    };
    console.log(postData)
    getApp().agriknow.notesContentLike(postData).then(res => {
      that.setData({
        pageContent: res.data
      });
      console.log(that.data.pageContent);
    })
      .catch(res => {
        //wx.stopPullDownRefresh()
      });
      
    if (this.data.collectFlag == ''){
      number++;
      this.setData({
        collectFlag:'yellow',
        collectCount:number
      })
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        duration: 2000
      })
    }else{
      number--;
      this.setData({
        collectFlag:'',
        collectCount:number
      })
      wx.showToast({
        title: '取消收藏',
        icon: 'success',
        duration: 2000
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var postData = {
      id:"43f6cc2ab62a44cd8f76cde19de0a4d8"
    };
    console.log(postData)
    getApp().agriknow.notesContent(postData).then(res => {
      that.setData({
        pageContent: res.data
      });
      console.log(that.data.pageContent);
    })
      .catch(res => {
        //wx.stopPullDownRefresh()
      });
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