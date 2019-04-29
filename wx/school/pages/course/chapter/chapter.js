Page({
  data: {
    objectArray1: [
      {
        id: 0,
        name: '第一章'
      },
      {
        id: 1,
        name: '第二章'
      },
      {
        id: 2,
        name: '第三章'
      },
      {
        id: 3,
        name: '第四章'
      }
    ],
    objectArray2: [
      {
        id: 0,
        name: '第一节'
      },
      {
        id: 1,
        name: '第二节'
      },
      {
        id: 2,
        name: '第三节'
      }
    ],
    objectArray3: [
      {
        id: 0,
        name: '第一小节'
      },
      {
        id: 1,
        name: '第二小节'
      }
    ],
    index1: 0,
    index2: 0,
    index3: 0
  },
  goOn: function(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  bindPickerChange1: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index1: e.detail.value
    })
  },
  bindPickerChange2: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index2: e.detail.value
    })
  },
  bindPickerChange3: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index3: e.detail.value
    })
  }
})