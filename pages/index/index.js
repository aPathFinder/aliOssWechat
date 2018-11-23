const uploadImage = require('../../utils/uploadFile.js');
const util = require('../../utils/util.js');

Page({
    data: {
        imgSrc: '',
        recordStatus: false,
        autidoSrc: '',
        videoSrc: ''
    }, 
    /**
     * 选择并上传照片
     */
    chooseImg() {
        let self = this;
        new Promise((resolve, reject) => {
            wx.chooseImage({
                count: 9, 
                sizeType: ['original', 'compressed'],  
                sourceType: ['album', 'camera'], 
                success(res) { 
                    resolve(res);
                }, 
                fail(err) {
                    reject(err);
                }
            })
        }).then((res) => {
            let tempFilePaths = res.tempFilePaths;
            let nowTime = util.formatTime(new Date());
            for (let i = 0; i < res.tempFilePaths.length; i++) {
                wx.showLoading({
                    title: '上传中' + (i + 1) + '/' + res.tempFilePaths.length,
                    mask: true
                })
                
                uploadImage({
                    filePath: res.tempFilePaths[i],
                    dir: `cbb/${nowTime}/`,
                    success(result) {
                        console.log("上传成功图片地址为", result);
                        self.setData({imgSrc: result});
                        wx.hideLoading();
                    },
                    fail(err) {
                        console.log("上传失败", err);
                        wx.hideLoading()
                    }
                });
            }
        }).catch(err => {getApp().tip(err.message)})
        
    },
    /**
     * 录制音频上传
     */
    startRecord() {
        let self = this;
        const {recorderManager} = getApp().globalData;
        recorderManager.onStart(() => {
            console.log('开始录音');
        });
        recorderManager.onStop(({ tempFilePath }) => {
            let nowTime = util.formatTime(new Date()); 
            uploadImage({
                fileType: 'audio',
                filePath: tempFilePath,
                dir: 'cbb/' + nowTime + '/',
                success: function (result) {
                    self.setData({autidoSrc: result});
                    console.log("上传成功录音", result); 
                    wx.hideLoading();
                },
                fail: function (err) {
                    console.log("上传录音失败", err);
                    wx.hideLoading()
                }
            });
        });
        recorderManager.onError(err => {
            console.log('录音错误', err);
        });
        recorderManager.start();
        this.setData({recordStatus: true});
        getApp().tip('已开始');
    },
    stopRecord() {
        const {recorderManager} = getApp().globalData;
        recorderManager.stop();
        this.setData({recordStatus: false});
        getApp().tip('已停止');
    },
    handlePlay() {
        const innerAudioContext = wx.createInnerAudioContext();
        innerAudioContext.autoplay = true;
        innerAudioContext.src = this.data.autidoSrc;
        // BUG
        innerAudioContext.obeyMuteSwitch = false;//iOS在静音下仍能播放.
        innerAudioContext.onPlay(() => {
            console.log('开始播放');
            getApp().tip('开始播放');
        });
        innerAudioContext.onEnded(() => {
            console.log('播放结束');
            this.setData({autidoSrc: ''});
            getApp().tip('播放结束');
        });
        innerAudioContext.onError((res) => {
            console.log(res.errMsg);
            console.log(res.errCode);
        });
    },
    //OSS上传视频
    handleMakeVideo() {
        let self = this;
        new Promise((resolve, reject) => {
            wx.chooseVideo({
                sourceType: ['album', 'camera'],
                success({tempFilePath, duration, size, height, width}) {
                    resolve({tempFilePath, duration, size, height, width});
                }
            });
        }).then(({tempFilePath, duration, size, height, width}) => {
            console.log('视频大小',(size/1024/1024).toFixed(2)+'M'); 
            wx.showLoading({ title: '上传中...' })
            uploadImage({
                fileType: 'video',
                filePath: tempFilePath,
                dir: `cbb/${util.formatTime(new Date())}/`,
                success: function (videoSrc) {
                    console.log("======上传成功视频地址为：", videoSrc); 
                    self.setData({videoSrc});
                    wx.hideLoading();
                    getApp().tip('上传成功');
                },
                process(res) { 
                    console.log('上传进度', res.progress)
                    // console.log('已经上传的数据长度', res.totalBytesSent)
                    // console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
                },
                fail: function (err) {
                    console.log("======上传视频失败======", err);
                    wx.hideLoading()
                    getApp().tip('上传失败');
                }
            });
        });
    },
    bindended() {
        this.setData({videoSrc: ''});
    }
})