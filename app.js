//app.js
App({
  onLaunch: function () {

  },
  tip(title) {
    wx.showToast({
      title: title || '提示内容为空',
      icon: 'none',
      duration: 5000
    });
  },
  globalData: {
    recorderManager: wx.getRecorderManager()
  }
})