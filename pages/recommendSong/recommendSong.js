// pages/recommendSong/recommendSong.js
import request from '../../utils/request'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: '', // 日
    month: '', // 月
    recommendList: '' // 推荐列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断用户是否登录
    let userInfo = wx.getStorageSync('userInfo')
    if(!userInfo) {
      // 提示用户
      wx.showToast({
        title: '请先登录',
        icon: 'error',
        success: () => {
          // 跳转至登录页面
          wx.reLaunch({
            url: '/pages/login/login'
          })
        }
      })
    }

    // 更新日期
    let Day = new Date().getDate()
    let Month = new Date().getMonth() + 1
    let day =  Day < 10 ? '0' + Day : Day
    let month = Month < 10 ? '0' + Month : Month
    this.setData({
      day,
      month
    })

    // 获取每日推荐的数据
    this.getRecommendListData()
  },

  // 获取每日推荐的数据方法
  async getRecommendListData() {
    let recommendListData = await request('/recommend/songs')
    this.setData({
      recommendList: recommendListData.recommend
    })
  },

  // 跳转至SongDetail页面
  toSongDetail(event) {
    let song = event.currentTarget.dataset.song

    wx.navigateTo({
      url: '/pages/songDetail/songDetail?musicId=' + song.id
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