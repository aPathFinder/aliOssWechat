const uploadImage = require('../../utils/uploadFile.js');
const util = require('../../utils/util.js');
import ImageUpload from '../../upload/Class/ImageUpload';
import AudioUpload from '../../upload/Class/AudioUpload';
import AudioPlayer from '../../upload/Class/AudioPlayer';
import VideoUpload from '../../upload/Class/VideoUpload';

Page({
    data: {
        imgSrc: '',
        recordStatus: false,
        autidoSrc: '',
        videoSrc: '',

        Audio: null
    }, 
    onLoad() {   
        let self = this;
        let Audio = new AudioUpload({
            startRecord() {
                self.setData({recordStatus: true});
                getApp().tip('已开始');
            }, stopRecord() {
                self.setData({recordStatus: false});
                getApp().tip('已停止');
            }, success(res) {
                self.setData({autidoSrc: res});
                console.log("上传成功录音", res); 
            }, fail() {
                console.log("上传录音失败", err);  
            }
        });
        
        this.setData({ Audio });
    },
    startRecord() {
        this.data.Audio.startRecord();
    },
    stopRecord() {
        this.data.Audio.stopRecord();
    },
    /**
     * 选择并上传照片
     */
    chooseImg() {
        let self = this;
        let upload = new ImageUpload({
            success(res) {
                console.log("上传成功图片地址为", res);
                self.setData({imgSrc: res});
            },
            fail(err) {
                console.log("上传失败", err);
            }
        });
        upload.uploadImg();
    },  
    handlePlay() {
        let self = this;
        new AudioPlayer({
            autidoSrc: self.data.autidoSrc,
            startPlay() {
                console.log('开始播放');
                getApp().tip('开始播放');
            }, endPlay() {
                console.log('播放结束');
                self.setData({autidoSrc: ''});
                getApp().tip('播放结束');
            }
        });
    },
    //OSS上传视频
    handleMakeVideo() {
        let self = this;
        let videoUpload = new VideoUpload({
            success(videoSrc) {

                console.log("======上传成功视频地址为：", videoSrc); 
                self.setData({videoSrc});
                wx.hideLoading();
                getApp().tip('上传成功');
            }, process(res) {

                console.log('上传进度', res.progress)
                // console.log('已经上传的数据长度', res.totalBytesSent)
                // console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
            }, fail() {

                console.log("======上传视频失败======", err);
                wx.hideLoading()
                getApp().tip('上传失败');
            }
        });
        videoUpload.makeVideo();
    },
    bindended() {
        this.setData({videoSrc: ''});
    }
})