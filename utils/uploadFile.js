const env = require('config.js');
const base64 = require('base64.js');
const Crypto = require('crypto.js');
require('hmac.js');
require('sha1.js');

/**
 * @param {*} options 自定义拓展参数
 */
const uploadFile = function (options) {
  let {
    fileType = 'img', filePath, dir, success, progress, fail
  } = options;
  console.log(`上传${fileType}...`);
  const aliyunFileKey = `${dir}${new Date().getTime()}${Math.floor(Math.random() * 150)}.${filePath.split('.').pop()}`;
  const aliyunServerURL = env.uploadImageUrl;
  const accessid = env.OSSAccessKeyId;
  const policyBase64 = getPolicyBase64();
  const signature = getSignature(policyBase64);

  const uploadTask = wx.uploadFile({
    url: aliyunServerURL,
    filePath: filePath,
    name: 'file',
    formData: {
      name: filePath,
      key: aliyunFileKey,
      policy: policyBase64,
      OSSAccessKeyId: accessid,
      signature,
      success_action_status: '200'
    },
    success(res) {
      if (res.statusCode != 200) {
        failc(new Error('上传错误:' + JSON.stringify(res)));
        return;
      }
      typeof (success) == 'function' && success(aliyunServerURL + aliyunFileKey);
      uploadTask.onProgressUpdate((res) => {
        typeof (progress) == 'function' && progress(res);
      });
    },
    fail(err) {
      typeof (fail) == 'function' && fail(err);
    }
  })
  // uploadTask.abort() // 取消上传任务
}

const getPolicyBase64 = function () {
  let date = new Date();
  date.setHours(date.getHours() + env.timeout);
  const policyText = {
    "expiration": date.toISOString(), //超过这个失效时间之后，就没有办法通过这个policy上传文件了 
    "conditions": [
      ["content-length-range", 0, env.maxSize] // 设置上传文件的大小限制,此处为1个G
    ]
  };
  const policyBase64 = base64.encode(JSON.stringify(policyText));
  return policyBase64;
}

const getSignature = function (policyBase64) {
  const accesskey = env.AccessKeySecret;
  const bytes = Crypto.HMAC(Crypto.SHA1, policyBase64, accesskey, {
    asBytes: true
  });
  const signature = Crypto.util.bytesToBase64(bytes);
  return signature;
}

module.exports = uploadFile;