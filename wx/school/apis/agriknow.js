/**
 * name: agriknow.js
 * description: 在线教育服务器提供的服务
 * author: 赵孟浩
 * date: 2019-2-18
 */
import request from './request.js'
class agriknow {
  constructor() {
    // this._baseUrl = 'https://e.hnfts.cn'
    // this._quiz = '/quiz'
    //this._wx = 'wechat'

    this._baseUrl = 'http://192.168.10.2:'
    this._quiz = '8081'
    this._wx = '8090'
    
    this._request = new request
    this._request.setErrorHandler(this.errorHander)
  }

  /**
   * 统一的异常处理方法
   */
  errorHander(res) {
    wx.showToast({
      title: '网络错误',
      icon: 'none'
    })
    
  }

  /**
   * 绑定用户信息
   */
  bindUser(realName = '', idNumber = '') {
    let data = { userName: realName, idCardNo: idNumber }
    return this._request.postRequest(this._baseUrl + '/wechat/user/binding', data).then(res => res.data)
  }

  /**
   *  学生进入课堂
   */
  joinClass(postData = {}) {
    return this._request.postRequest(this._baseUrl + this._quiz + '/classRoom/join/interactiveRoom', postData).then(res => res.data)
  }

  /**
   * 提交提问回答
   */
  answerQuiz(postData = {}) {
    return this._request.postRequest(this._baseUrl + this._quiz + '/interact/send/answer', postData).then(res => res.data)
  }

  /**
   * 提交提问举手
   */
  raise(postData = {}) {
    return this._request.postRequest(this._baseUrl + this._quiz + '/interact/raise', postData).then(res => res.data)
  }


  /**
   * 收到问题后回调服务器
   */
  delSelectStu(postData = {}) {
    return this._request.postRequest(this._baseUrl + this._quiz + '/interact/fabu/delSelectStu', postData).then(res => res.data)
  }

  /**
   * 提交练习回答
   */
  answerPractice(postData = {}) {
    return this._request.postRequest(this._baseUrl + this._quiz + '/interact/sendBook/answer', postData).then(res => res.data)
  }

  /**
   * 提交问卷回答
   */
  answerSurvey(postData = {}) {
    return this._request.postRequest(this._baseUrl + this._quiz + '/interactSurvey/send/answer', postData).then(res => res.data)
  }

  /**
   * 提交任务回答
   */
  answerTask(postData = {}) {
    return this._request.postRequest(this._baseUrl + this._quiz + '/TaskInteract/send/answer', postData).then(res => res.data)
  }

  /**
   * 提交头脑风暴回答
   */
  answerStrom(postData = {}) {
    return this._request.postRequest(this._baseUrl + this._quiz + '/brainstormInteract/send/answer', postData).then(res => res.data)
  }

  /**
   * 微信登录
   */
  wxLogin(postData = {}) {
    return this._request.getRequest(this._baseUrl + this._wx + '/user/login', postData).then(res => res.data)
  }

}
export default agriknow