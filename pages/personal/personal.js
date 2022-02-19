// pages/personal/personal.js
import request from '../../utils/request'

// 手指起始坐标
let startY = 0 
// 手指移动坐标
let moveY = 0
// 手指移动距离
let moveDistance = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    transData: 'translateY(20rpx)',
    transitionData: '',
    userInfo: {}, //用户信息
    recentPlayList: [] //用户最近播放记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo')
    if(userInfo) {
      // 更新用户信息
      this.setData({
        userInfo: JSON.parse(userInfo)
      })

      // 获取用户播放记录
      this.getRecentPlayListData(this.data.userInfo.userId)
    }
  },

  // 获取用户最近播放记录的方法
  async getRecentPlayListData(userId) {
    let recentPlatListData = await request('/user/record', { uid: userId, type: 1})
    let index = 0
    let recentPlayList = recentPlatListData.weekData.slice(0, 10).map(item => {
      item.id = index++
      return item
    })
    this.setData({
      recentPlayList
    })
  },
  // 下拉效果
  handleTouchStart(event) {
    this.setData({
      transitionData: ''
    })
    // 获取手指起始坐标
    startY = event.touches[0].clientY
  },
  handleTouchMove(event) {
    moveY = event.touches[0].clientY
    moveDistance = moveY - startY

    if(moveDistance <= 0) return
    if(moveDistance >= 100) {
      moveDistance = 100
    }
    this.setData({
      transData: `translateY(${ moveDistance }rpx)`
    })
  },
  handleTouchEnd() {
    this.setData({
      transData: `translateY(20rpx)`,
      transitionData: 'transform 0.5s linear'
    })
  },

  // 转到登录页面
  toLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    })
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