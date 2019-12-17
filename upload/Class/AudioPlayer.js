class AudioPlayer {
  constructor(options) {
    this.startPlayCallback = options.startPlay;
    this.endplayCallback = options.endPlay;
    const innerAudioContext = wx.createInnerAudioContext();
    innerAudioContext.autoplay = true;
    innerAudioContext.src = options.autidoSrc;
    // BUG
    //iOS在静音下仍能播放.
    innerAudioContext.obeyMuteSwitch = false;
    innerAudioContext.onPlay(() => {
      typeof (this.startPlayCallback) == 'function' && this.startPlayCallback();
    });
    innerAudioContext.onEnded(() => {
      typeof (this.endplayCallback) == 'function' && this.endplayCallback();
    });
    innerAudioContext.onError((res) => {
      console.log(res.errMsg);
      console.log(res.errCode);
    });
    this.innerAudioContext = innerAudioContext;
  }
}

export default AudioPlayer;