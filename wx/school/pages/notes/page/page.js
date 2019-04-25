// pages/page/page.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    likeFlag: '',
    collectFlag: '',
    pageContent:{},
    pageLike:{},
    pageCollect:{},
    pageCommentary:{}
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
  // 点赞
  changelike: function () {
    let count = this.data.likeCount;
    var that = this;
    var postData = {
      articleId:that.data.id,
      userId: wx.getStorageSync('studentId')
    };
    // console.log(postData)
    getApp().agriknow.notesContentLike(postData).then(res => {
      var con = that.data.pageContent;
      con.clickGood++;
      that.setData({
        pageContent: con
      });
      wx.showToast({
        title: '点赞成功',
        icon: 'success',
        duration: 2000
      })
    })
    .catch(res => {
      //wx.stopPullDownRefresh()
    });
  },
  // 收藏
  changeCollect(){
    var that = this;
    if (this.data.pageContent.isCollect == 'false'){
      var postData = {
        articleId: that.data.id,
        userId: wx.getStorageSync('studentId')
      };
      getApp().agriknow.notesContentCollect(postData).then(res => {
        var note = that.data.pageContent;
        note.isCollect = "true";
        that.setData({
          pageContent: note
        });
        wx.showToast({
          title: '收藏成功',
          icon: 'success',
          duration: 2000
        })
      })
        .catch(res => {
          //wx.stopPullDownRefresh()
        });
    } else if (this.data.pageContent.isCollect == 'true'){
      var postData = {
        articleId: that.data.id,
        userId: wx.getStorageSync('studentId')
      };
      getApp().agriknow.notesDeleContentCollect(postData).then(res => {
        var note = that.data.pageContent;
        note.isCollect = "false";
        that.setData({
          pageContent: note
        });
        wx.showToast({
          title: '取消收藏',
          icon: 'success',
          duration: 2000
        })
      })
        .catch(res => {
          //wx.stopPullDownRefresh()
        });
    }
  },
  // 评论点赞
  likeCommentary:function() {
    var that = this;
    var postData = {
      commentId: "7a938c2f79054b0788ff87e64cedaa87"
    };
    console.log(postData)
    getApp().agriknow.notesCommentary(postData).then(res => {
      that.setData({
        pageCommentary: res.data
      });
      console.log(that.data.pageCommentary);
    })
      .catch(res => {
        //wx.stopPullDownRefresh()
      });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var postData = {
      id:options.id
    };
    that.setData({
      id: options.id
    })
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