// pages/index/index.js
// 导入发送请求组件
import request from '../../utils/request.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 轮播图数据
    bannerList: [],
    // 推荐歌曲数据
    recommendList: [],
    // 排行榜数据
    topList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function () {
    // 获取轮播图数据
    let bannerListData = await request('/banner', { type: 2 })
    this.setData({
      bannerList: bannerListData.banners
    })

    // 获取推荐歌曲数据
    let recommendListData = await request('/personalized', { limit: 10 })
    this.setData({
      recommendList: recommendListData.result
    })

    // 获取排行榜数据
    let index = 0
    let topListArry = []
    while( index < 5) {
      let topListData = await request('/top/list', { idx: index })
      let topListItem = { id: topListData.playlist.id, name: topListData.playlist.name, tracks: topListData.playlist.tracks.slice(0,3)}
      topListArry.push(topListItem)
      this.setData({
        topList: topListArry
      })
      index++
    }


  },

  // 跳转至recommendSong的回调
  toRecommendSong() {
    wx.navigateTo({
      url: '/songPackage/pages/recommendSong/recommendSong'
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