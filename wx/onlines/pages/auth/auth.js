Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHide: false,
    steps: [
      {
        text: '微信授权'
      },
      {
        text: '实名信息'
      }
    ],
    active: 0,
    items: [
      {name: 'serviceText', checked: false}
    ]
  },

  onLoad: function (option) {
    console.log(option)
    this.setData(option)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (wx.getStorageSync('binding') == '0') {
      wx.navigateTo({
        url: '/pages/index/index'
      });
    }
  },

  //勾选服务协议
  checkboxChange: function(e) {
    let flag = false
    if (e.detail.value[0] =='serviceText') {
      flag = true
    }
    this.setData({
      flag: flag
    })
  },

  //跳转至服务协议
  serviceText: function() {
    console.log(234);
    wx.navigateTo({
      url: '/pages/serviceText/serviceText'
    });
  },

  bindGetUserInfo: function (e) {
    console.log(this.data.flag)
    if (!this.data.flag) {
      wx.showToast({
        title: '请先阅读服务协议',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      this.setData({
        active: 1
      })
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '本产品为河南省外贸学校学生使用，使用前需验证身份，否则将无法使用',
        success: function (res) {
          
        }
      });
    }
  },

  onChangeName(event) {
    // event.detail 为当前输入的值
    this.setData({
      realName: event.detail
    })
  },
  
  onChangeId(event) {
    // event.detail 为当前输入的值
    this.setData({
      idNumber: event.detail
    })
  },

  sub: function() {
    getApp().agriknow.bindUser(this.data.realName, this.data.idNumber)
      .then(res => {
        getApp().globalData.alreadyBind = true;
        wx.showToast({
          title: '绑定成功！'
        });
        wx.setStorageSync('binding', '0')
        setTimeout(function () {
          wx.navigateTo({
            url: '/pages/index/index'
          });
        }, 2000);
        
        
      })
      .catch(res => {
        //wx.stopPullDownRefresh()
      })
  }
})