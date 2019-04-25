//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    pageList: []
  },
  release: function(){
    wx.navigateTo({
      url: '../release/release',
    })
  },
  showToast(){
    
  },
  topage:function(e){
    var articleId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../page/page?id=' + articleId
    })
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
      // 列表详情
  onLoad: function (options) {
    var that = this;
      var postData = {
        isValidated:0,
        page: 0,
        size: 15,
        sort:1,
        userId: wx.getStorageSync('studentId')
      };
    getApp().agriknow.notesList(postData).then(res => {
        that.setData({
          pageList: res.data
        });
        console.log(that.data.pageList);
      })
        .catch(res => {
          //wx.stopPullDownRefresh()
        });
  }
})
