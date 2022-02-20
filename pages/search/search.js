// pages/search/search.js
import request from '../../utils/request'
let timer = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholderData: '', // 搜索框默认搜索内容
    hotList: [], // 热搜榜列表数据
    inputSearchData: '', // 搜索框输入的内容
    searchList: [], // 关键词模糊匹配数据
    historyList: [], // 搜索的历史记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取placeholderData数据
    this.getPlaceholder()

    // 获取本地搜索历史记录
    this.getSearchHistory()

    // 获取hotList数据
    this.getHotList()
  },

  // 获取本地搜索历史记录的功能函数
  getSearchHistory() {
    let historyList = wx.getStorageSync('searchHistory')

    if(historyList) {
      this.setData({
        historyList
      })  
    }
  },

  // 获取placeholderData数据的方法
  async getPlaceholder() {
    let placeholderData = await request('/search/default')
    this.setData({
      placeholderData: placeholderData.data.showKeyword
    })
  },

  // 获取hotList数据的方法
  async getHotList() {
    let hotListData = await request('/search/hot/detail')
    this.setData({
      hotList: hotListData.data
    })
  },

  // 获取searchList数据的方法
  async getSearchList(inputSearchData) {
    if(!inputSearchData) {
      this.setData({
        searchList: []
      })
      return
    }
    let searchListData = await request('/search', { keywords: inputSearchData, limit: 10 })

    this.setData({
      searchList: searchListData.result.songs
    })

    // 将搜索的关键字添加到搜索历史记录中
    let { historyList } = this.data

    if(historyList.indexOf(inputSearchData) !== -1) {
      historyList.splice(historyList.indexOf(inputSearchData), 1)
    }else {
      if(historyList.length >= 10) {
        historyList.splice(historyList.length - 1, 1)
      }
    }
    
    historyList.unshift(inputSearchData)

    this.setData({
      historyList
    })

    wx.setStorageSync('searchHistory', historyList) 
  },
  
  // 搜索框内容发生改变的回调
  handleInputChange(event) {
    this.setData({
      inputSearchData: event.detail.value.trim()
    })

    // 获取searchList数据
    // 防抖
    if(timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      this.getSearchList(this.data.inputSearchData)
    }, 300)
  },

  // 清空搜索内容
  clearinputSearch() {
    this.setData({
      inputSearchData: '',
      searchList: []
    })
  },

  // 删除历史记录
  deleteSearchHistory() {
    wx.removeStorageSync('searchHistory')
    this.setData({
      historyList: []
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