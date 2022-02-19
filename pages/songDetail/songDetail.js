// pages/songDetail/songDetail.js
import request from '../../utils/request'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false, // 标识音乐是否播放
    musicInfo: {}, // 音乐详情
    musicUrl: '', // 音乐链接
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // options: 用于接收路由跳转传过来的参数
    let musicId = options.musicId

    // 获取音乐详情
    this.getMusicInfo(musicId)

    // 获取音乐播放链接
    this.getMusicUrl(musicId)
  },

  // 获取音乐详情的方法
  async getMusicInfo(musicId) {
    let musicInfoData = await request('/song/detail', { ids: musicId })
    this.setData({
      musicInfo: musicInfoData.songs[0]
    })
  },

  // 获取音乐播放链接
  async getMusicUrl(musicId) {
    let musicUrlData = await request('/song/url', { id: musicId})
    this.setData({
      musicUrl: musicUrlData.data[0].url
    })
  },
  // 点击播放/暂停的回调
  handleMusicPlay() {
    this.setData({
      isPlay: !this.data.isPlay
    })

    // 控制音乐播放/暂停
    this.musicControl(this.data.isPlay)
  },

  // 控制音乐播放/暂停的功能函数
  musicControl(isPlay) {
    // 创建控制音乐播放的实例
    let backgroundAudioManager = wx.getBackgroundAudioManager()

    if(isPlay) {
      // 播放
      backgroundAudioManager.src = this.data.musicUrl
      backgroundAudioManager.title = this.data.musicInfo.name
    }else{
      // 暂停
      backgroundAudioManager.pause()
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})