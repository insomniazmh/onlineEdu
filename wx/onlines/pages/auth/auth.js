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
    active: 0
  },

  onLoad: function () {

  },

  bindGetUserInfo: function (e) {
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
        wx.showToast({
          title: '绑定成功！',
        });
        getApp().globalData.alreadyBind = true;
        wx.navigateTo({
          url: '/pages/index/index'
        });
      })
      .catch(res => {
        //wx.stopPullDownRefresh()
      })
  }
})