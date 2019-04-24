//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    wishList: [
      { dzzs: '22', collected: 1, id: 1 },
    ],
    pageList: []
  },

  // 更改点赞状态
  onCollectionTap: function (event) {
    // 获取当前点击下标
    var index = event.currentTarget.dataset.index;
    // data中获取列表
    var message = this.data.wishList;
    for (let i in message) { //遍历列表数据
      if (i == index) { //根据下标找到目标
        var collectStatus = false
        if (message[i].collected == 0) { //如果是没点赞+1
          collectStatus = true
          message[i].collected = parseInt(message[i].collected) + 1
          message[i].dzzs = parseInt(message[i].dzzs) + 1
        } else {
          collectStatus = false
          message[i].collected = parseInt(message[i].collected) - 1
          message[i].dzzs = parseInt(message[i].dzzs) - 1
        }
        // wx.showToast({
        //   title: collectStatus ? '收藏成功' : '取消收藏',
        // })
      }
    }
    this.setData({
      wishList: message
    })
  },
  release: function(){
    wx.navigateTo({
      url: '../release/release',
    })
  },
  showToast(){
    wx.showToast({
      title: '收藏成功',
      // icon:'success',
      duration:1500,
    })
  },
  topage:function(){
    wx.navigateTo({
      url: '../page/page',
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
        sort:1
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
