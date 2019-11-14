// pages/reg/reg.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  nav: function(e) {
    let flag = e.currentTarget.dataset.flag
    wx.navigateTo({
      url: '/pages/auth/auth?type=' + flag,
    })
  }

})