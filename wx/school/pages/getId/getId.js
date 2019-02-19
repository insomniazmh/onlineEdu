// pages/getId/getId.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    realName: "",//学生姓名
    idNumber: ""//学生身份证号码
  },

  /**
   * 用户姓名
   */
  bindKeyName(e) {
    this.setData({
      realName: e.detail.value
    })
  },

  /**
   * 用户身份证号码
   */
  bindKeyId(e) {
    this.setData({
      idNumber: e.detail.value
    })
  },
  
  subclick(e) {
    console.log(this.data.realName);
    console.log(this.data.idNumber);
    this.bindUser();
  },

  //绑定学生信息
  bindUser() {
    getApp().agriknow.bindUser(this.data.realName, this.data.idNumber)
      .then(res => {
        wx.showToast({
          title: '绑定成功！',
        });
        getApp().globalData.alreadyBind = true;
        setTimeout(function() {
          wx.navigateTo({
            url: '/pages/school_index/index'
          });
        }, 3000);
      })
      .catch(res => {
        //wx.stopPullDownRefresh()
      })
  }
})