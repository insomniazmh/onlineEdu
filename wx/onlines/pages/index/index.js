//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    imgUrls: [
      "/img/banner_1.jpg",
      "/img/banner_1.jpg",
      "/img/banner_1.jpg",
      "/img/banner_1.jpg"
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 500,
    courseList: []

  },

  myCourses: function() {
    let that = this
    getApp().agriknow.myCourseList()
      .then(res => {
        console.log(res)
        for(let i=0;i<res.data.length;i++) {
          if (res.data[i].chapterName && res.data[i].chapterName.length>17) {
            res.data[i].chapterName = res.data[i].chapterName.substring(0, 15)+'...'
          }
          
        }
        that.setData({
          courseList: res.data
        })
      })
      .catch(res => {
        //wx.stopPullDownRefresh()
      })
  },

  jumpTransaction: function (e) {
    let course = e.currentTarget.dataset.course
    let url = e.currentTarget.dataset.url + '?id=' + course.courseId + '&courseName=' + course.courseName
    if (course.chapterId) {
      url = url + '&chapterId=' + course.chapterId
    }
    wx.navigateTo({
      url: url
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              wx.setStorageSync('portrait', res.userInfo.avatarUrl)//将token信息存入本地
              // if (!wx.getStorageSync('token')) {
              //   that.wxLogin(res.userInfo.avatarUrl);
              // }else {
              //   that.myCourses()
              // }
              that.wxLogin(res.userInfo.avatarUrl);
            }
          });
        } else {
          // 用户没有授权
          wx.navigateTo({
            url: '/pages/reg/reg',
          })
        }
      }
    });

    
  },

  onLoad: function () {
  },

  //微信登录
  wxLogin: function (portrait) {
    var that = this;
    wx.login({
      success(res) {
        if (res.code) {
          getApp().agriknow.wxLogin({
            code: res.code,
            portrait: portrait
          }).then(res => {
            if (res.ret == 0) {
              var resData = res.data;
              wx.setStorageSync('token', resData.token)//将token信息存入本地
              wx.setStorageSync('binding', resData.binding)//将绑定状态存入本地
              wx.setStorageSync('roleId', resData.roleId)//将用户类型存入本地
              if (resData.binding && resData.binding == '0') {
                wx.setStorageSync('classId', resData.classId)
                wx.setStorageSync('studentId', resData.studentId)
                that.myCourses()
              } else {
                //将页面跳转至绑定页
                wx.showModal({
                  title: '未找到身份信息',
                  content: '您的身份还未验证，请先绑定身份信息',
                  showCancel: false,
                  duration: 2000,
                  success: function () {
                    getApp().globalData.alreadyBind = false;
                    wx.navigateTo({
                      url: '/pages/reg/reg'
                    });
                  }
                });
              }
            } else {
              wx.showToast({
                title: '登录失败，请退出重试',
                icon: 'none',
                duration: 2000
              });
            }
          }).catch(res => {
            //wx.stopPullDownRefresh()
          });
        } else {
          wx.showToast({
            title: '网络异常',
            icon: 'none',
            duration: 2000
          });
        }
      }
    })
  },

  bindNavBlink: function(e) {
    wx.navigateTo({
      
      url: e.currentTarget.dataset.url
    })
  }
})
