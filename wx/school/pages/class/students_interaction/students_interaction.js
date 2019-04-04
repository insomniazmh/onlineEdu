// pages/students_interaction/students_interaction.js
Page({

  goUrl(e) {
    console.log(e.currentTarget.dataset.url);
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },

  /**
   * 页面的初始数据
   */
  data: {

  }
})