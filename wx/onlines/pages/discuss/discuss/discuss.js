// pages/discuss/discuss.js
Page({

  /**
   * 页面的初始数据
   */
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
    active: 0,
    listContent:[
      {
        headPortrait:"/img/floor/up1.png",
        titleName:"Super invincible 菁",
        publishDate:"2019-06-18",
        textTitle:"十一长假哪也不去，宅在家里看电影！",
        textContent:"每逢长假，总有那么一群人选择远离人山人海，静静地呆在家，坐在电脑电视前。长时间的工作学习让他们感觉很疲惫，对什么都提不起劲，打开电脑却不知道干什么好…",
        imgDetail:"/img/news/list1.png"
      },
      {
        headPortrait: "/img/floor/up1.png",
        titleName: "Super invincible 菁",
        publishDate: "2019-06-18",
        textTitle: "十一长假哪也不去，宅在家里看电影！",
        textContent: "每逢长假，总有那么一群人选择远离人山人海，静静地呆在家，坐在电脑电视前。长时间的工作学习让他们感觉很疲惫，对什么都提不起劲，打开电脑却不知道干什么好…",
        imgDetail: "/img/news/list1.png"
      },
    ],
  },

  changeContent(event) {
    wx.showToast({
      title: `切换到标签 ${event.detail.index + 1}`,
      icon:'none'
    })
  },
  jumpTransaction: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    
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