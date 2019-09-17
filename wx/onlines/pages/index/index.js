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
    courseList: [
      // {
      //   alias: "上册",
      //   courseDescribe: "<p>werr&nbsp;</p>",
      //   courseId: "d30b4000f80149ccbddd469542d515f3",
      //   courseName: "测试911",
      //   courseNumber: "38217b2927974f4181091c526de374fd",
      //   teacherName: "董波",
      //   joinChapterName: "第二讲:FLASH动画的原理",
      //   createTime: "2019-09-11 15:43:20",
      //   createUser: "15012345678",
      //   isValidated: "0",
      //   jobsPercentage: "80",
      //   learningTime: "6",
      //   topPicSrc: "https://e.hnfts.cn/file/group1/M00/00/02/wKgVol14pKiAQHJcAAEvLL88Lx8614.jpg",
      //   updateTime: "2019-09-11 15:43:20",
      //   updateUser: "15012345678",
      //   videoPercentage: "20"
      // }
    ]

  },

  myCourses: function() {
    let that = this
    getApp().agriknow.myCourseList()
      .then(res => {
        console.log(res)
        that.setData({
          courseList: res.data
        })
      })
      .catch(res => {
        //wx.stopPullDownRefresh()
      })
  },

  jumpTransaction: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url + '?id=' + e.currentTarget.dataset.course.courseId
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
              if (!getApp().globalData.token) {
                that.wxLogin(res.userInfo.avatarUrl);
              }
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
    this.myCourses()
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
              if (resData.binding && resData.binding == '0') {
                wx.setStorageSync('token', resData.token)//将token信息存入本地
                wx.setStorageSync('classId', resData.classId)
                that.loadMyCourse();
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
