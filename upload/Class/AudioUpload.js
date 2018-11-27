import Upload from 'Upload'

class AudioUpload extends Upload {
    constructor(options) {
        super();
        const {recorderManager} = getApp().globalData;
        this.recorderManager = recorderManager;

        this._init(options);
    }

    _init(options) {
        let self = this;
        let {startRecord : startRecordCallback, stopRecord: stopRecordCallback, success, fail} = options;
        self.successFunc = success;
        self.failFunc = fail;
        this.recorderManager.onStart(() => {
            console.log('开始录音');
            typeof(startRecordCallback) == 'function' && startRecordCallback();
        });
        this.recorderManager.onStop(({ tempFilePath }) => {
            typeof(stopRecordCallback) == 'function' && stopRecordCallback();
            self._audioUpload(tempFilePath);
        });
        this.recorderManager.onError(err => {
            console.log('录音错误', err);
        });
    }

    startRecord() {
        this.recorderManager.start();
    }

    stopRecord() {
        this.recorderManager.stop();
    }

    _audioUpload(tempFilePath) {
        let self = this;
        super.init({
            filePath: tempFilePath,
            success: function (result) {
                typeof(self.successFunc) == 'function' && self.successFunc(result);
                wx.hideLoading();
            },
            fail: function (err) {
                typeof(self.failFunc) == 'function' && self.failFunc(err);
                wx.hideLoading();
            }
        });
    }
}

export default AudioUpload;