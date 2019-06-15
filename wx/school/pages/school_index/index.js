// pages/school_index/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
            url: '/pages/auth/auth',
          })
        }
      }
    });
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
              console.log(resData.token);
              wx.setStorageSync('token', resData.token)//将token信息存入本地
              wx.setStorageSync('studentId', resData.studentId)//将studentId信息存入本地
              wx.setStorageSync('className', resData.className)//将班级信息存入本地
              that.setData({
                className: resData.className
              });
              that.loadMyCourse();
              if (resData.binding && resData.binding == '0') {
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
                      url: '/pages/getId/getId'
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

  joinRoom: function (e) {
    //学生进入课堂
    getApp().agriknow.joinClass({
      circleId: getApp().globalData.circleId,
      examineeId: wx.getStorageSync("studentId")
    }).then(res => {
      if (res.ret == 0) {
        //将页面跳转至上课
        wx.navigateTo({
          url: '/pages/class/students_interaction/students_interaction'
        })
      }
    })
      .catch(res => {
        //wx.stopPullDownRefresh()
      });
  },

  goTo(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },

  //跳转至章节选择页面
  navToChapter(e) {
    wx.setStorageSync('courseId', e.currentTarget.dataset.course.courseId)//将课程id存入本地
    wx.setStorageSync('courseName', e.currentTarget.dataset.course.courseName)//将课程id存入本地
    wx.navigateTo({
      url: '/pages/course/chapter/chapter'
    })
  },

  //扫描二维码,获取班级id
  scanCode(e) {
    var that = this;
    var app = getApp();
    if (app.globalData.circleId && app.globalData.circleId != "") {
      wx.showModal({
        title: '提示',
        content: '已进入过课堂，需要重新扫描吗？',
        cancelText: '直接进入',
        confirmText: '重新扫描',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.scanCode({
              success(res) {
                if (res.result && res.result.indexOf("interactionQr") == 0) {
                  var circleId = res.result.slice(13);
                  app.globalData.circleId = circleId;//将班级id存入全局变量中
                  that.joinRoom(e);
                } else {
                  wx.showToast({
                    title: '二维码不正确，请重新扫描',
                    icon: 'none',
                    duration: 2000
                  });
                }
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
            that.joinRoom(e);
          }
        }
      })
    } else {
      wx.scanCode({
        success(res) {
          if (res.result && res.result.indexOf("interactionQr") == 0) {
            var circleId = res.result.slice(13);
            app.globalData.circleId = circleId;//将班级id存入全局变量中
            that.joinRoom(e);
          } else {
            wx.showToast({
              title: '二维码不正确，请重新扫描',
              icon: 'none',
              duration: 2000
            });
          }

        }
      })
    }
  },

  /**
   * 加载我的课程（当前学期正在进行中的课程）
   */
  loadMyCourse: function() {
    var that = this;
    getApp().agriknow.myCourseList().then(res => {
      let courseList = res.data;
      //演示数据，正式部署时需删除
      courseList.push({
        courseDescribe: "基础英语描述",
        courseId: "3419bb57a7004463a172a2c897c22452",
        courseName: "新编商务英语",
        teacherId: "dongbo",
        teacherName: "董波",
        topPicSrc: "http://118.24.120.43:8080/group1/M00/00/06/rBsADFzFVPWAHFgZAAE-NPUKEQM835.jpg"
      })

      // courseList.push({
      //   courseDescribe: "",
      //   courseId: "47e0b0d129ea4968b8a5645c16bf5d2a",
      //   courseName: "FLASH动画设计",
      //   teacherId: "dongbo",
      //   teacherName: "董波",
      //   topPicSrc: "http://118.24.120.43:8080/group1/M00/00/06/rBsADFzFVPWAHFgZAAE-NPUKEQM835.jpg"
      // })
      that.setData({
        courseList: res.data
      })
    }).catch(res => {
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
    if (!getApp().globalData.alreadyBind) {
      //将页面跳转至绑定页
      wx.showModal({
        title: '未找到身份信息',
        content: '您的身份还未验证，请先绑定身份信息',
        showCancel: false,
        duration: 2000,
        success: function () {
          wx.navigateTo({
            url: '/pages/getId/getId'
          });
        }
      });
    }
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