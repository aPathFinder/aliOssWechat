import Upload from './Upload'

class ImageUpload extends Upload {
  constructor(options) {
    super();
    this.successFunc = options.success;
    this.failFunc = options.fail;
  }

  uploadImg() {
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
      for (let i = 0; i < res.tempFilePaths.length; i++) {
        wx.showLoading({
          title: '上传中' + (i + 1) + '/' + res.tempFilePaths.length,
          mask: true
        });
        super.init({
          filePath: res.tempFilePaths[i],
          success(result) {
            typeof (self.successFunc) == 'function' && self.successFunc(result);
            wx.hideLoading();
          },
          fail(err) {
            typeof (self.failFunc) == 'function' && self.failFunc(err);
            wx.hideLoading()
          }
        });
      }
    }).catch(err => {
      getApp().tip(err.message)
    });
  }
}

export default ImageUpload;