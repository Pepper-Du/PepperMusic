// pages/songDetail/songDetail.js
import request from '../../utils/request'
import PubSub from 'pubsub-js'
import moment from 'moment'

// 获取全局App实例
const appInstance = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false, // 标识音乐是否播放
    musicInfo: {}, // 音乐详情
    musicUrl: '', // 音乐链接
    currentTime: '00:00', // 音乐的当前播放进度
    durationTime: '', // 音乐的总时长
    currentWidth: 0 // 实时进度条的宽度
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

    // 判断当前页面的音乐是否正在播放
    if(appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId) {
      // 正在播放，修改isPlay
      this.setData({
        isPlay: true
      })
    }

    // 处理用户操作系统的控制音乐播放/暂停的按钮
    // 创建控制音乐播放的实例
    this.backgroundAudioManager = wx.getBackgroundAudioManager()
    // 监视音乐的播放/暂停
    this.backgroundAudioManager.onPlay(() => {
      // 修改isPlay的状态
      this.changeIsPlayState(true)

      // 修改全局音乐播放的状态
      appInstance.globalData.musicId = musicId
    })

    this.backgroundAudioManager.onPause(() => {
      this.changeIsPlayState(false)
    })

    // 监听音乐的停止
    this.backgroundAudioManager.onStop(() => {
      this.changeIsPlayState(false)
    })

    // 监听音乐实时播放进度
    this.backgroundAudioManager.onTimeUpdate(() => {
      // 格式化音乐的当前播放进度
      let currentTime = moment(this.backgroundAudioManager.currentTime * 1000).format('mm:ss')

      // 计算当前进度条的宽度
      let currentWidth = this.backgroundAudioManager.currentTime / this.backgroundAudioManager.duration * 100
      this.setData({
        currentTime,
        currentWidth
      })
    })

    // 监听音乐播放结束
    this.backgroundAudioManager.onEnded(() => {
      // 自动切换至下一首
      PubSub.subscribe('musicId', (msg, musicId) => {
        // 获取音乐详情
        this.getMusicInfo(musicId)
  
        // 获取音乐播放链接,并自动播放
        this.getMusicUrl(musicId).then(res => {
          this.musicControl(true)
        })
  
        // 取消订阅
        PubSub.unsubscribe('musicId')
      })
      PubSub.publish('switchType', 'next')
  
      // 重置进度条区域
      this.setData({
        currentTime: '00:00',
        currentWidth: 0
      })
    })
  },

  // 修改isPlay状态的功能函数
  changeIsPlayState(isPlay) {
      // 修改isPlay的状态
      this.setData({
        isPlay
      })

      // 修改全局音乐播放的状态
      appInstance.globalData.isMusicPlay = isPlay

  },

  // 获取音乐详情的方法
  async getMusicInfo(musicId) {
    let musicInfoData = await request('/song/detail', { ids: musicId })
    
    // 获取音乐总时长
    let durationTime = moment(musicInfoData.songs[0].dt).format('mm:ss')
    
    this.setData({
      musicInfo: musicInfoData.songs[0],
      durationTime
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
    
    if(isPlay) {
      // 播放
      this.backgroundAudioManager.src = this.data.musicUrl
      this.backgroundAudioManager.title = this.data.musicInfo.name
    }else{
      // 暂停
      this.backgroundAudioManager.pause()
    }
  },

  // 点击切换音乐的回调
  handleSwitchMusic(event) {
    // 获取切歌的类型
    let type = event.currentTarget.id

    // 关闭当前播放的音乐
    this.backgroundAudioManager.stop()

    // 订阅来自recommendSong页面发布的消息
    PubSub.subscribe('musicId', (msg, musicId) => {
      // 获取音乐详情
      this.getMusicInfo(musicId)

      // 获取音乐播放链接,并自动播放
      this.getMusicUrl(musicId).then(res => {
        this.musicControl(true)
      })

      // 取消订阅
      PubSub.unsubscribe('musicId')
    })

    // 发布消息给recommendSong页面
    PubSub.publish('switchType', type)
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