import Upload from './Upload';

class VideoUpload extends Upload {
    constructor(options) {
        super();
        this.successFunc = options.success;
        this.processFunc = options.process;
        this.failFunc = options.fail;
    }

    makeVideo() {
        let self = this;
        new Promise((resolve, reject) => {
            wx.chooseVideo({
                sourceType: ['album', 'camera'],
                success({tempFilePath, duration, size, height, width}) {
                    resolve({tempFilePath, duration, size, height, width});
                }
            });
        }).then((options) => {
            self._uploadVideo(options);
        });
    }

    _uploadVideo({tempFilePath, duration, size, height, width}) {
        console.log('视频大小',(size/1024/1024).toFixed(2)+'M'); 
        wx.showLoading({ title: '上传中...' });
        super.init({
            filePath: tempFilePath,
            success: function (videoSrc) { 
                typeof(this.successFunc) == 'function' && this.successFunc(videoSrc);
            },
            progress: function(res) { 
                typeof(this.processFunc) == 'function' && this.processFunc(res);
            },
            fail: function (err) {
                typeof(this.failFunc) == 'function' && this.failFunc(err);
            }
        });
    }
}

export default VideoUpload;