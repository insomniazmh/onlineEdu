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
    pageCommentList:[]
  },
  jumpRep(){
    wx.navigateTo({
      url: '../textarea/textarea',
    })
  },
  // 评论回复
    reply:function(e){
      var commentId = e.currentTarget.dataset.id
      wx.navigateTo({
        url: '../reply/reply?id=' + commentId,
      })
      console.log(e)
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
  likeCommentary:function(e) {
    var that = this;
    var postData = {
      commentId: e.currentTarget.id
    };
    getApp().agriknow.notesCommentary(postData).then(res => {
      var list = that.data.pageCommentList;
      console.log(list.length);
      for(var i=0;i<2;i++){
        if (list[i].commentId === e.currentTarget.id){
          list[i].goodCount++;
        }
      }
      that.setData({
        pageCommentList: list
      });
      // console.log(that.data.pageCommentary);
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
      id:options.id,
      userId: wx.getStorageSync('studentId')
    };
    that.setData({
      id: options.id
    })
    // console.log(postData)
    getApp().agriknow.notesContent(postData).then(res => {
      that.setData({
        pageContent: res.data
      });
      // console.log(that.data.pageContent);
    })
      .catch(res => {
        //wx.stopPullDownRefresh()
      });

    // 评论列表
    var postData = {
      articleId: options.id,
      sortVo:{
        isValidated:0,
        page:0,
        size:'15',
        sort:1
      }
    };
    getApp().agriknow.notesComponents(postData).then(res => {
      that.setData({
        pageCommentList: res.data
      });
      // console.log(that.data.pageCommentList);
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