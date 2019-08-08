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
      // this._general = '/wechat'
      // this._education = '/education'

    this._baseUrl = 'http://192.168.10.2:'
    this._quiz = '8081'
    this._general = '7080'
    this._education = '8080'
    
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
   * 微信登录
   */
  wxLogin(postData = {}) {
    return this._request.getRequest(this._baseUrl + this._general + '/weChat/login', postData).then(res => res.data)
  }

  /**
   * 绑定用户信息
   */
  bindUser(realName = '', idNumber = '') {
    let data = { studentName: realName, stuIDCard: idNumber }
    return this._request.postRequest(this._baseUrl + this._general + '/weChat/binding', data).then(res => res.data)
  }

  /**
   *  加载我的课程（当前学期正在进行中的课程）
   */
  myCourseList(postData = {}) {
    return this._request.getRequest(this._baseUrl + this._education + '/course/myCourseList', postData).then(res => res.data)
  }
  
  /**
   * 提交（预习自测/课后作业）回答
   */
  answerSelfTest(postData = {}) {
    return this._request.postRequest(this._baseUrl + this._quiz + '/studentAnswer/saveAnswer', postData).then(res => res.data)
  }

  /**
   * 查询自己（预习自测/课后作业）回答
   */
  answerSelfFind(postData = {}) {
    return this._request.postRequest(this._baseUrl + this._quiz + '/studentAnswer/findAnswer', postData).then(res => res.data)
  }

  /**
   * 查询自己（预习自测/课后作业）快照
   */
  snapshot(postData = {}) {
    return this._request.postRequest(this._baseUrl + this._quiz + '/studentAnswer/findExerciseBook', postData).then(res => res.data)
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

  /**
   *  资讯列表
   */
  articleFindAll(postData = {}) {
    return this._request.postRequest(this._baseUrl + this._general + '/article/findAllDesc', postData).then(res => res.data)
  }

  /**
   *  资讯详情
   */
  articleDetail(postData = {}) {
    return this._request.postRequest(this._baseUrl + this._general + '/article/findId', postData).then(res => res.data)
  }
}
export default agriknow