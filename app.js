//app.js
App({
    onLaunch: function () {
        
    },
    tip(title) {
        wx.showToast({
            title,
            icon: 'none',
            duration: 5000
        });
    },
    globalData: {
        recorderManager: wx.getRecorderManager()
    }
})