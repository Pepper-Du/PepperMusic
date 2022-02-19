// pages/login/login.js
import request from '../../utils/request.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    password: '',
    isShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 表单项内容实施收集
  handleInput(event) {
    let type = event.currentTarget.id
    this.setData({
      [type]: event.detail.value
    })
  },

  // 密码的显示与隐藏
  safePwd() {
    this.setData({
      isShow: !this.data.isShow
    })
  },

  // 登录
  async login() {
    let { phone, password } = this.data
    // 前端验证

    // 手机号不能为空
    if(!phone) {
      // 提示用户
      wx.showToast({
        title: '手机号不能为空',
        icon: 'error'
      }) 
      return
    }
    // 手机号是否正确
    let phoneReg = /^1[3-9]\d{9}$/
    if(!phoneReg.test(phone)) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'error'
      }) 
      return
    }

    // 密码不能为空
    if(!password) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'error'
      }) 
      return
    }

    // 后端验证
    let result = await request('/login/cellphone', { phone, password, isLogin: true })
    if(result.code === 200) {
      wx.showToast({
        title: '登录成功'
      })

      // 将用户的信息存储至本地
      wx.setStorageSync('userInfo', JSON.stringify(result.profile))
      
      // 登录成功跳转
      wx.reLaunch({
        url: '/pages/personal/personal'
      })
    }else if(result.code === 400) {
      wx.showToast({
        title: '手机号输入错误',
        icon: 'error'
      })
    }else if(result.code === 502) {
      wx.showToast({
        title: '密码输入错误',
        icon: 'error'
      })
    }else{
      wx.showToast({
        title: '登录失败，请稍后重新登录',
        icon: 'error'
      })
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