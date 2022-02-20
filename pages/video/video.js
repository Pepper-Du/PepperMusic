// pages/video/video.js
import request from '../../utils/request'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [], // 导航标签数据
    navId: '', // 导航标签栏的标识
    videoList: '', // 视频列表数据
    videoId: '', // 视频id标识
    videoTimeUpdate: [], // 视频已播放的时间
    isTriggered: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取导航标签数据
    this.getVideoGroupListData()
  },
  // 获取导航标签数据
  async getVideoGroupListData() {
    let videoGroupListData = await request('/video/group/list')
    this.setData({
      videoGroupList: videoGroupListData.data.slice(0,14),
      navId: videoGroupListData.data[0].id
    })

    // 获取视频列表数据
    this.getVideoListData(this.data.navId)
  },

  // 获取视频列表数据
  async getVideoListData(navId) {
    let videoListData = await request('/video/group', { id: navId })
    
    // 关闭正在加载
    wx.hideLoading()

    let index = 0
    let videoList = videoListData.datas.map( item => {
      item.id = index++
      return item
    })
    this.setData({
      videoList,
      isTriggered: false //关闭下拉刷新加载
    })
  },

  // 点击切换导航
  changeNav(event) {
    let navId = event.currentTarget.id
    this.setData({
      navId: navId>>>0, //位移运算符，强制转换为Number
      videoList: []
    })

    // 显示正在加载
    wx.showLoading({
      title: '正在加载'
    })

    // 动态获取当前导航对应的视频列表数据
    this.getVideoListData(this.data.navId)
  },
  
  // 点击播放/继续播放的回调
  handlePlay(event) {
    let vid = event.currentTarget.id

    // 关闭上一个播放的视频
    this.vid !== vid && this.videoContext && this.videoContext.stop()
    this.vid = vid

    // 更新data中videoId的状态数据
    this.setData({
      videoId: vid
    })
    // 创建控制video标签的实例对象
    this.videoContext = wx.createVideoContext(vid)

    // 判断当前的视频之前是否播放过，是否有播放记录,跳转至上次播放位置
    let { videoTimeUpdate } = this.data
    let videoItem = videoTimeUpdate.find( item => item.vid === vid )
    if(videoItem) {
      this.videoContext.seek( videoItem.currentTime )
    }
  },

  // 监听视频播放进度的回调
  handleTimeUpdate(event) {
    let videoTimeObj = { vid: event.currentTarget.id, currentTime: event.detail.currentTime }

    // 判断videoTimeUpdate数组中是否有当前视频的播放记录
    let { videoTimeUpdate } = this.data
    let videoItem = videoTimeUpdate.find( item => item.vid === videoTimeObj.vid )
    if(videoItem) {
      // 有
      videoItem.currentTime = videoTimeObj.currentTime
    }else {
      // 无
      videoTimeUpdate.push(videoTimeObj)
    }

    // 更新数据
    this.setData({
      videoTimeUpdate
    })
  },

  // 视频播放结束调用
  handleEnded(event) {
    // 移除videoTimeUpdate数组中当前视频对象
    let { videoTimeUpdate } = this.data
    videoTimeUpdate.splice( videoTimeUpdate.findIndex( item => item.vid === event.currentTarget.id ), 1 )
    this.setData({
      videoTimeUpdate
    })
  },

  // 自定义scroll-view下拉刷新回调
  handleRefresh() {
    // 发请求获取最新的视频列表数据
    this.getVideoListData(this.data.navId)
  },

  // 跳转至搜索页面
  toSearch() {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },
  // 自定义scroll-view上拉触底刷新
  handleToLower() {
    // 数据分页

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
    return {
      title: 'PepperMusic',
      page: '/pages/video/video',
    }
  }
})