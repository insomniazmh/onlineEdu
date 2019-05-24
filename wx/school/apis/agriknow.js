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
      this._quiz = '/quiz'
      this._wx = '/wechat'
      this._education = '/education'

    // this._baseUrl = 'http://192.168.10.2:'
    // this._quiz = '8081'
    // this._wx = '8090'
    // this._education = '8080'

    //this._baseUrlXD = 'http://192.168.10.10:8090'
    
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
   *  加载我的课程（当前学期正在进行中的课程）
   */
  myCourseList(postData = {}) {
    return this._request.getRequest(this._baseUrl + this._education + '/course/myCourseList', postData).then(res => res.data)
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
    return this._request.postRequest(this._baseUrl + this._quiz + '/stuInteract/send/answer', postData).then(res => res.data)
  }

  /**
   * 提交提问举手
   */
  raise(postData = {}) {
    return this._request.postRequest(this._baseUrl + this._quiz + '/stuInteract/raise', postData).then(res => res.data)
  }


  /**
   * 收到问题后回调服务器
   */
  delSelectStu(postData = {}) {
    return this._request.postRequest(this._baseUrl + this._quiz + '/stuInteract/fabu/delSelectStu', postData).then(res => res.data)
  }

  /**
   * 提交练习回答
   */
  answerPractice(postData = {}) {
    return this._request.postRequest(this._baseUrl + this._quiz + '/stuInteract/sendBook/answer', postData).then(res => res.data)
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
  // answerTask(postData = {}) {
  //   return this._request.postRequest(this._baseUrl + this._quiz + '/TaskInteract/send/answer', postData).then(res => res.data)
  // }

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

  /**
   *  发布心得
   */
  saveNote(postData = {}) {
    return this._request.postRequest(this._baseUrl + this._education + '/article/saveOrUpdate', postData).then(res => res.data)
  }

  /**
   *  列表详情
   */
  notesList(postData = {}) {
    return this._request.postRequest(this._baseUrl + this._education + '/article/findStuAllDesc', postData).then(res => res.data)
  }

  /**
   *  内容详情
   */
  notesContent(postData = {}) {
    return this._request.postRequest(this._baseUrl + this._education + '/article/findId', postData).then(res => res.data)
  }

  /**
   *  帖子添加
   */
  notesPosted(postData = {}) {
    return this._request.postRequest(this._baseUrl + this._education + '/article/saveOrUpdate', postData).then(res => res.data)
  }

  /**
   *  分页列表
   */
  notesPageList(postData = {}){
    return this._request.postRequest(this._baseUrl + this._education + '/article/findStuAllDesc',postData).then(res => res.data)
  }

  /**
   *  点赞
   */
  notesContentLike(postData = {}) {
    return this._request.postRequest(this._baseUrl + this._education + '/article/addGood',postData).then(res => res.data)
  }

  /**
   *  收藏
   */
  notesContentCollect(postData = {}) {
    return this._request.postRequest(this._baseUrl + this._education + '/article/addCollect',postData).then(res => res.data)
  }

  /**
   *  取消收藏
   */
  notesDeleContentCollect(postData = {}) {
    return this._request.postRequest(this._baseUrl + this._education + '/article/delCollect', postData).then(res => res.data)
  }

  /**
   *  评论添加
   */
  notesCommentadded(postData = {}) {
    return this._request.postRequest(this._baseUrl + this._education + '/articleComment/saveOrUpdate',postData).then(res => res.data)
  }

  /**
   *  评论回复
   */
  notesCommentSavaReply(postData = {}) {
    return this._request.postRequest(this._baseUrl + this._education + '/articleComment/saveReply', postData).then(res => res.data)
  }
  /**
   *  评论点赞
   */
  notesCommentary(postData = {}) {
    return this._request.postRequest(this._baseUrl + this._education + '/articleComment/addGood',postData).then(res => res.data)
  }


  /**
   *  评论列表
   */
  notesComponents(postData = {}) {
    return this._request.postRequest(this._baseUrl + this._education + '/articleComment/findArticleId',postData).then(res => res.data)
  }

  /**
   *  根据课程id加载章节信息
   */
  loadChapterByCourseId(postData = {}) {
    return this._request.postRequest(this._baseUrl + this._education + '/courseChapter/findByCourseId', postData).then(res => res.data)
  }

  /**
   *  根据章节id加载知识点
   */
  loadKnowPoints(postData = {}) {
    return this._request.postRequest(this._baseUrl + this._education + '/kNode/findByChapter', postData).then(res => res.data)
  }

  /**
   *  根据章节id加载资料
   */
  loadDatumList(postData = {}) {
    return this._request.postRequest(this._baseUrl + this._education + '/courseData/findDatumList', postData).then(res => res.data)
  }

  /**
   *  根据章节id加载预习练习（课后作业）题目
   */
  loadExerciseList(postData = {}) {
    return this._request.postRequest(this._baseUrl + this._quiz + '/exerciseBook/findExerciseBook', postData).then(res => res.data)
  }

/*------------------------------------------------------------------------------------------------------------*/
  /**
   *  公告列表
   */
noticeFind(postData = {}) {
  return this._request.postRequest(this._baseUrl + this._education + '/notice/findById', postData).then(res => res.data)
  }
    /**
   *  公告详情
   */
  noticeFindAll(postData = {}) {
    return this._request.postRequest(this._baseUrl + this._education + '/notice/findAll', postData).then(res => res.data)
  }
      /**
   *  公告详情
   */
  checkoutTest(postData = {}) {
    return this._request.postRequest(this._baseUrl + this._education + '/notice/findAll', postData).then(res => res.data)
  }
}
export default agriknow