[阿里云OSS官方文档](https://help.aliyun.com/document_detail/92883.html?spm=a2c4g.11186623.6.651.1cd32f08YK9IUm)

### 功能列表
    - 阿里云最大单词上传有5G, config.js中有最大上传容量参数.如需请设置
    - 在使用过程中,建议上下文设置为getApp().global属性,便于使用

#### 图片上传预览
    - 最基础的.上传成功后显示图片

#### 音频上传播放
    - 上传后点击开始播放,播放结束后隐藏播放按钮

#### 视频上传播放
    - 已知小程序方面的bug
        - 小程序拍摄视频(maxDuration参数)
            - 时间限制60s以上仍为60停止,时间设置无效.
            - 60s以下时候,部分机型无效.
  
### 说明

#### 本demo也参考了其他项目.
#### 如果有问题欢迎提出issue
    