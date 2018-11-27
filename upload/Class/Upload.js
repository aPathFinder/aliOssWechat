import {uploadImageUrl, AccessKeySecret, OSSAccessKeyId, timeout, maxSize} from '../config/index';
const base64 = require('../lib/base64'); 
const Crypto = require('../lib/crypto');
require('../lib/hmac');
require('../lib/sha1');

class Upload {
    constructor() {

    }

    init(options) {
        let newTime = _formatTime(new Date());

        let {filePath, dir = `cbb/${newTime}/`, success, progress, fail} = options;
        this.filePath = !!filePath ? filePath : '';
        this.aliyunFileKey = `${dir}${new Date().getTime()}${Math.floor(Math.random() * 150)}.${filePath.split('.').pop()}`;
        this.policyBase64 = this._getPolicyBase64();
        this.signature = this._getSignature(this.policyBase64);
        this.success = success;
        this.progress = progress || function() {
            console.log('暂无进度回调');
        };
        this.fail = fail;
        this.uploadTask();
    }

    uploadTask() {
        let self = this;
        const upload = wx.uploadFile({
            url: uploadImageUrl,  
            filePath: this.filePath,
            name: 'file',
            formData: {
                name: this.filePath,
                key: this.aliyunFileKey,
                policy: this.policyBase64,
                OSSAccessKeyId,
                signature: this.signature,
                success_action_status: '200'
            },
            success(res) {
                if (res.statusCode != 200) {failc(new Error('上传错误:' + JSON.stringify(res))); return;}
                typeof(self.success) == 'function' && self.success(uploadImageUrl + self.aliyunFileKey); 
                upload.onProgressUpdate((res) => {
                    console.log(self.progress);
                    typeof(self.progress) == 'function' && self.progress(res);
                });
            },
            fail(err) {
                typeof(self.fail) == 'function' && self.fail(err);
            }
        })
    }

    _getPolicyBase64() {
        let date = new Date();
        date.setHours(date.getHours() + timeout);
        const policyText = {
            "expiration": date.toISOString(), //超过这个失效时间之后，就没有办法通过这个policy上传文件了 
            "conditions": [
                ["content-length-range", 0, maxSize] // 设置上传文件的大小限制,此处为1个G
            ]
        };
        const policyBase64 = base64.encode(JSON.stringify(policyText));
        return policyBase64;
    }
    
    _getSignature(policyBase64) { 
        const bytes = Crypto.HMAC(Crypto.SHA1, policyBase64, AccessKeySecret, {
            asBytes: true
        });
        return Crypto.util.bytesToBase64(bytes);
    }
}

const _formatTime = date => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    return [year, month, day].map(_formatNumber).join('-');
}

const _formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

export default Upload;