/**
 * name: agriknow.js
 * description: 在线教育服务器提供的服务
 * author: 赵孟浩
 * date: 2019-2-18
 */
import request from './request.js'
class agriknow {
  constructor() {
    this._baseUrl = 'https://e.hnfts.cn'
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
    return this._request.postRequest(this._baseUrl + '/quiz/classRoom/join/interactiveRoom', postData).then(res => res.data)
  }

  /**
   * 提交提问回答
   */
  answerQuiz(postData = {}) {
    return this._request.postRequest(this._baseUrl + '/quiz/interact/send/answer', postData).then(res => res.data)
  }

  /**
   * 提交提问举手
   */
  raise(postData = {}) {
    return this._request.postRequest(this._baseUrl + '/quiz/interact/send/raise', postData).then(res => res.data)
  }

  /**
   * 提交练习回答
   */
  answerPractice(postData = {}) {
    return this._request.postRequest(this._baseUrl + '/quiz/interact/sendBook/answer', postData).then(res => res.data)
  }

  /**
   * 提交问卷回答
   */
  answerSurvey(postData = {}) {
    return this._request.postRequest(this._baseUrl + '/quiz/interactSurvey/send/answer', postData).then(res => res.data)
  }

  /**
   * 提交任务回答
   */
  answerTask(postData = {}) {
    return this._request.postRequest(this._baseUrl + '/quiz/TaskInteract/send/answer', postData).then(res => res.data)
  }

  /**
   * 提交头脑风暴回答
   */
  answerStrom(postData = {}) {
    return this._request.postRequest(this._baseUrl + '/quiz/brainstormInteract/send/answer', postData).then(res => res.data)
  }

  /**
   * 微信登录
   */
  wxLogin() {
    return this._request.wxLogin()
  }

}
export default agriknow