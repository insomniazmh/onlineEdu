/***
Metronic AngularJS App Main Script
***/

/* Metronic App */
var MetronicApp = angular.module("MetronicApp", [
	"ui.router",
	"ui.bootstrap",
	"oc.lazyLoad",
	"ngSanitize"
]);

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
MetronicApp.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
	$ocLazyLoadProvider.config({
		cssFilesInsertBefore: 'ng_load_plugins_before' // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
	});
}]);

/********************************************
 BEGIN: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/
/**
`$controller` will no longer look for controllers on `window`.
The old behavior of looking on `window` for controllers was originally intended
for use in examples, demos, and toy apps. We found that allowing global controller
functions encouraged poor practices, so we resolved to disable this behavior by
default.

To migrate, register your controllers with modules rather than exposing them
as globals:

Before:

```javascript
function MyController() {
  // ...
}
```

After:

```javascript
angular.module('myApp', []).controller('MyController', [function() {
  // ...
}]);

Although it's not recommended, you can re-enable the old behavior like this:

```javascript
angular.module('myModule').config(['$controllerProvider', function($controllerProvider) {
  // this option might be handy for migrating old apps, but please don't use it
  // in new ones!
  $controllerProvider.allowGlobals();
}]);
**/

//AngularJS v1.3.x workaround for old style controller declarition in HTML
MetronicApp.config(['$controllerProvider', function($controllerProvider) {
	// this option might be handy for migrating old apps, but please don't use it
	// in new ones!
	$controllerProvider.allowGlobals();
}]);

/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/

/* Setup global settings */
MetronicApp.factory('settings', ['$rootScope', function($rootScope) {
	// supported languages
	var settings = {
		layout: {
			pageSidebarClosed: false, // sidebar state
			pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
		},
		layoutImgPath: Metronic.getAssetsPath() + 'admin/layout/img/',
		layoutCssPath: Metronic.getAssetsPath() + 'admin/layout/css/'
	};

	$rootScope.settings = settings;

	return settings;
}]);

/* Setup App Main Controller */
MetronicApp.controller('AppController', ['$scope', '$rootScope', function($scope, $rootScope) {
	$scope.$on('$viewContentLoaded', function() {
		Metronic.initComponents(); // init core components
		//Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 
	});

	//切换课程回调
	$rootScope.$on('course', function(d, data) {
		$rootScope.courseId = data.courseId;
		$rootScope.course = data;
		localStorage.setItem('courseId', data.courseId);
		$scope.$broadcast('course', data);
	});

	//切换章节回调
	$rootScope.$on('currentNode', function(d, data) {
		$rootScope.currentNodeId = data.id;
		$rootScope.currentNode = data;
		localStorage.setItem('currentNodeId', data.id);
		$scope.$broadcast('currentNode', data);
	});

	//切换知识点回调
	$rootScope.$on('kPointNode', function(d, data) {
		if(data.knodeId) {
			$rootScope.knode = data;
			localStorage.setItem('knodeId', data.knodeId);
		} else {
			$rootScope.knode = {
				nodeName: ""
			};
			localStorage.setItem('knodeId', "");
		}
		$scope.$broadcast('kPointNode', data);
	});
}]);

/***
Layout Partials.
By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial 
initialization can be disabled and Layout.init() should be called on page load complete as explained above.
***/

/* Setup Layout Part - Header */
MetronicApp.controller('HeaderController', ['$scope', '$rootScope', '$http', '$location', function($scope, $rootScope, $http, $location) {
	$scope.$on('$includeContentLoaded', function() {
		Layout.initHeader(); // init header

		var pageData = {
			sortVo: {
				page: 0,
				size: common.pageSize
			}
		};
		//加载课程列表
		common.ajax({
			$scope: $scope,
			$http: $http,
			url: '/course/findAll',
			data: pageData,
			success: function(data) {
				$(data.data).each(function() {
					if(!this.topPicSrc) {
						this.topPicSrc = 'images/zanwu.jpg';
					}
				});
				$rootScope.courses = data.data;
				if(!localStorage.getItem('courseId') && data.data.length > 0) {
					//默认选中第一个课程
					localStorage.setItem('courseId', data.data[0].courseId);
					$rootScope.course = data.data[0];
				}
			}
		});

		//header中课程被选中事件，获取被选中的课程
		$scope.changeCourse = function(row) {
			$rootScope.$emit("course", row);
		}
	});
}]);

/* Setup Layout Part - Sidebar */
MetronicApp.controller('SidebarController', ['$scope', function($scope) {
	$scope.$on('$includeContentLoaded', function() {
		Layout.initSidebar(); // init sidebar
	});
}]);

/* Setup Layout Part - Sidebar */
MetronicApp.controller('PageHeadController', ['$scope', '$rootScope', function($scope, $rootScope) {
	$scope.$on('$includeContentLoaded', function() {
		Demo.init(); // init theme panel
	});
}]);

/* Setup Layout Part - Footer */
MetronicApp.controller('FooterController', ['$scope', function($scope) {
	$scope.$on('$includeContentLoaded', function() {
		Layout.initFooter(); // init footer
	});
}]);

/* Setup Rounting For All Pages */
MetronicApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

	// Redirect any unmatched url
	$urlRouterProvider.otherwise("/dashboard.html");

	$stateProvider

		// 课程列表
		.state('coursesList', {
			url: "/coursesList.html",
			templateUrl: "views/course/coursesList.html",
			data: {
				pageTitle: '课程管理',
				pageSubTitle: '课程列表'
			},
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'MetronicApp',
						insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
						files: [

							'js/controllers/CoursesListController.js'

						]
					});
				}]
			}
		})

		// 备课列表
		.state('prepareLessonsList', {
			url: "/prepareLessonsList.html",
			templateUrl: "views/course/prepareLessonsList.html",
			data: {
				pageTitle: '课程管理',
				pageSubTitle: '备课列表'
			},
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'MetronicApp',
						insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
						files: []
					});
				}]
			}
		})

		// 我的课程
		.state('myCourses', {
			url: "/myCourses.html",
			templateUrl: "views/course/myCourses.html",
			data: {
				pageTitle: '课程管理',
				pageSubTitle: '我的课程'
			},
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'MetronicApp',
						insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
						files: []
					});
				}]
			}
		})

		// 备课详情
		.state('prepareLessons', {
			url: "/prepareLessons.html",
			templateUrl: "views/course/prepareLessons.html",
			data: {
				pageTitle: '课程管理',
				pageSubTitle: '备课详情'
			},
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'MetronicApp',
						insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
						files: []
					});
				}]
			}
		})

		// 课堂协助
		.state('helper', {
			url: "/helper.html",
			templateUrl: "views/interaction/helper.html",
			data: {
				pageTitle: '教学互动',
				pageSubTitle: '课堂活动'
			},
			controller: "CoursesListController",
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'MetronicApp',
						insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
						files: [
							'../../../assets/global/plugins/bootstrap-contextmenu/bootstrap-contextmenu.js',
							'../../../assets/admin/pages/css/profile.css',
							'../../../assets/admin/pages/scripts/components-context-menu.js',
						]
					});
				}]
			}
		})

		// 课堂协助
		.state('helper2', {
			url: "/helper2.html",
			templateUrl: "views/interaction/helper2.html",
			data: {
				pageTitle: '教学互动',
				pageSubTitle: '课堂活动'
			},
			controller: "",
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'MetronicApp',
						insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
						files: [
							'../../../assets/admin/pages/css/profile.css',
							'../../../assets/admin/pages/scripts/charts-amcharts.js',
						]
					});
				}]
			}
		})

		//课程总览
		.state('courseOverview', {
			url: "/courseOverview.html",
			templateUrl: "views/interaction/courseOverview.html",
			data: {
				pageTitle: '教学互动',
				pageSubTitle: '课程总览'
			},
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'MetronicApp',
						insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
						files: []
					});
				}]
			}
		})

		//上课
		.state('begin', {
			url: "/begin.html",
			templateUrl: "views/interaction/begin.html",
			data: {
				pageTitle: '教学互动',
				pageSubTitle: '上课'
			},
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'MetronicApp',
						insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
						files: []
					});
				}]
			}
		})

		//知识点题库
		.state('knowledgePoint', {
			url: "/knowledgePoint.html",
			templateUrl: "views/database/knowledgePoint.html",
			data: {
				pageTitle: '资料库',
				pageSubTitle: '知识点题库'
			},
			controller: "",
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'MetronicApp',
						insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
						files: [
							'../../../assets/global/plugins/bootstrap-contextmenu/bootstrap-contextmenu.js',
							'../../../assets/admin/pages/scripts/components-context-menu.js',
							'js/controllers/CoursesListController.js'

						]
					});
				}]
			}
		})
		
		//大题
		.state('bigQuestion', {
			url: "/bigQuestion.html",
			templateUrl: "views/database/bigQuestion.html",
			data: {
				pageTitle: '大题',
				pageSubTitle: '大题'
			},
			controller: "",
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'MetronicApp',
						insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
						files: [
							'../../../assets/global/plugins/bootstrap-contextmenu/bootstrap-contextmenu.js',
							'../../../assets/admin/pages/scripts/components-context-menu.js',
							'js/controllers/CoursesListController.js'

						]
					});
				}]
			}
		})

		// 课程列表2
		.state('cl2', {
			url: "/cl2.html",
			templateUrl: "views/database/cl2.html",
			data: {
				pageTitle: '教辅资料库',
				pageSubTitle: '课程列表'
			},
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'MetronicApp',
						insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
						files: []
					});
				}]
			}
		})
		
		// 课程列表4-课程总览
		.state('cl4', {
			url: "/cl4.html",
			templateUrl: "views/interaction/cl4.html",
			data: {
				pageTitle: '教学互动',
				pageSubTitle: '课程总览'
			},
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'MetronicApp',
						insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
						files: []
					});
				}]
			}
		})
		
		// 课程列表6-上课
		.state('cl6', {
			url: "/cl6.html",
			templateUrl: "views/interaction/cl6.html",
			data: {
				pageTitle: '教学互动',
				pageSubTitle: '上课'
			},
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'MetronicApp',
						insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
						files: []
					});
				}]
			}
		})

		//教辅资料库
		.state('assistant', {
			url: "/assistant.html",
			templateUrl: "views/database/assistant.html",
			data: {
				pageTitle: '资料库',
				pageSubTitle: '教辅资料库'
			},
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'MetronicApp',
						insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
						files: [
							'js/webuploader-0.1.5/webuploader.css'
						]
					});
				}]
			}
		})

		//教辅题册
		.state('xitice', {
			url: "/xitice.html",
			templateUrl: "views/database/xitice.html",
			data: {
				pageTitle: '资料库',
				pageSubTitle: '教辅题册'
			},
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'MetronicApp',
						insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
						files: [
							'js/webuploader-0.1.5/webuploader.css'
						]
					});
				}]
			}
		})

		//任务和风暴
		.state('task', {
			url: "/task.html",
			templateUrl: "views/database/task.html",
			data: {
				pageTitle: '资料库',
				pageSubTitle: '任务和风暴'
			},
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'MetronicApp',
						insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
						files: [
							'js/webuploader-0.1.5/webuploader.css'
						]
					});
				}]
			}
		})

		//问卷
		.state('survey', {
			url: "/survey.html",
			templateUrl: "views/database/survey.html",
			data: {
				pageTitle: '资料库',
				pageSubTitle: '问卷'
			},
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'MetronicApp',
						insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
						files: [
							'js/webuploader-0.1.5/webuploader.css'
						]
					});
				}]
			}
		})

		//教辅资料库
		.state('testPaper', {
			url: "/testPaper.html",
			templateUrl: "views/database/testPaper.html",
			data: {
				pageTitle: '资料库',
				pageSubTitle: '试卷库'
			},
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'MetronicApp',
						insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
						files: []
					});
				}]
			}
		})

		//统计
		.state('statistics', {
			url: "/statistics.html",
			templateUrl: "views/statistics/statistics.html",
			data: {
				pageTitle: '统计',
				pageSubTitle: '统计'
			},
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'MetronicApp',
						insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
						files: [
							'../../../assets/admin/pages/scripts/charts-amcharts.js',
						]
					});
				}]
			}
		})

		//角色
		.state('role', {
			url: "/role.html",
			templateUrl: "views/role/role.html",
			data: {
				pageTitle: '权限管理',
				pageSubTitle: '角色管理'
			},
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'MetronicApp',
						insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
						files: []
					});
				}]
			}
		})

		//学生
		.state('student', {
			url: "/student.html",
			templateUrl: "views/user/student.html",
			data: {
				pageTitle: '用户管理',
				pageSubTitle: '学生'
			},
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'MetronicApp',
						insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
						files: []
					});
				}]
			}
		})

		//教学教务人员
		.state('teacher', {
			url: "/teacher.html",
			templateUrl: "views/user/teacher.html",
			data: {
				pageTitle: '用户管理',
				pageSubTitle: '教学教务人员'
			},
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'MetronicApp',
						insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
						files: []
					});
				}]
			}
		})

		//单个问题详情
		.state('singleQuestion', {
			url: "/singleQuestion.html",
			templateUrl: "views/single/singleQuestion.html",
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'MetronicApp',
						insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
						files: []
					});
				}]
			}
		})

		//单节课程
		.state('singleLession', {
			url: "/singleLession.html",
			templateUrl: "views/single/singleLession.html",
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'MetronicApp',
						insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
						files: []
					});
				}]
			}
		})

		// Dashboard
		.state('dashboard', {
			url: "/dashboard.html",
			templateUrl: "views/dashboard.html",
			data: {
				pageTitle: ' 首页',
				pageSubTitle: '统计信息 & 报告'
			},
			controller: "DashboardController",
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'MetronicApp',
						insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
						files: [
							'../../../assets/global/plugins/morris/morris.css',
							'../../../assets/admin/pages/css/tasks.css',

							'../../../assets/global/plugins/morris/morris.min.js',
							'../../../assets/global/plugins/morris/raphael-min.js',
							'../../../assets/global/plugins/jquery.sparkline.min.js',

							'../../../assets/admin/pages/scripts/index3.js',
							'../../../assets/admin/pages/scripts/tasks.js',

							'js/controllers/DashboardController.js'
						]
					});
				}]
			}
		})

		// AngularJS plugins
		.state('fileupload', {
			url: "/file_upload.html",
			templateUrl: "views/file_upload.html",
			data: {
				pageTitle: "课程添加"
			},
			controller: "GeneralPageController",
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load([{
						name: 'angularFileUpload',
						files: [
							'../../../assets/global/plugins/dropzone/css/dropzone.css',
							'js/webuploader-0.1.5/webuploader.css',
							'js/controllers/GeneralPageController.js',
							'js/webuploader-0.1.5/webuploader.min.js',
							'../../../assets/global/plugins/dropzone/dropzone.js',
							'../../../assets/admin/pages/scripts/form-dropzone.js',
							'../../../assets/global/plugins/angularjs/plugins/angular-file-upload/angular-file-upload.min.js',
						]
					}, {
						name: 'MetronicApp',
						files: [
							'js/controllers/GeneralPageController.js'
						]
					}]);
				}]
			}
		})

		// 修改密码
		.state('updatePwd', {
			url: "/updatePwd.html",
			templateUrl: "views/updatePwd.html",
			data: {
				pageTitle: '修改密码',
				pageSubTitle: '修改密码'
			},
			controller: "",
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load([{
						name: 'MetronicApp',
						files: [
						]
					}]);
				}]
			}
		})

		//课程添加
		.state('courseAdd', {
			url: "/courseAdd.html",
			templateUrl: "views/course/courseAdd.html",
			data: {
				pageTitle: '课程管理',
				pageSubTitle: '课程添加',
				btn_taps: true
			},
			controller: "GeneralPageController",
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load([{
						name: 'MetronicApp',
						files: [
							'../../../assets/global/plugins/dropzone/css/dropzone.css',
							'js/webuploader-0.1.5/webuploader.css',
							'js/webuploader-0.1.5/demo.css',
							'js/controllers/GeneralPageController.js',

							'../../../assets/global/plugins/dropzone/dropzone.js',
							'../../../assets/admin/pages/scripts/form-dropzone.js',
							'../../../assets/global/plugins/angularjs/plugins/angular-file-upload/angular-file-upload.min.js',
						]
					}]);
				}]
			}
		})

		//课程修改
		.state('courseEdit', {
			url: "/courseEdit.html",
			templateUrl: "views/course/courseEdit.html",
			data: {
				pageTitle: '课程管理',
				pageSubTitle: '课程修改',
				btn_taps: true
			},
			controller: "GeneralPageController",
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load([{
						name: 'MetronicApp',
						files: [
							'../../../assets/global/plugins/dropzone/css/dropzone.css',
							'js/webuploader-0.1.5/webuploader.css',
							'js/webuploader-0.1.5/demo.css',
							'js/controllers/GeneralPageController.js',

							'../../../assets/global/plugins/dropzone/dropzone.js',
							'../../../assets/admin/pages/scripts/form-dropzone.js',
							'../../../assets/global/plugins/angularjs/plugins/angular-file-upload/angular-file-upload.min.js',
						]
					}]);
				}]
			}
		})
		
		//心得
		.state('gain', {
			url: "/gain.html",
			templateUrl: "views/gainAndNotes/gain.html",
			data: {
				pageTitle: '心得体会',
				pageSubTitle: '心得',
				btn_taps: true
			},
			controller: "GeneralPageController",
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load([{
						name: 'MetronicApp',
						files: [
							'js/controllers/GeneralPageController.js',
						]
					}]);
				}]
			}
		})
		
		//笔记
		.state('notes', {
			url: "/notes.html",
			templateUrl: "views/gainAndNotes/notes.html",
			data: {
				pageTitle: '笔记',
				btn_taps: true
			},
			controller: "GeneralPageController",
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load([{
						name: 'MetronicApp',
						files: [
							'js/controllers/GeneralPageController.js',
						]
					}]);
				}]
			}
		})
		
		//笔记详情
		.state('notes_item', {
			url: "/notes_item.html",
			templateUrl: "views/gainAndNotes/notes_item.html",
			data: {
				pageTitle: '笔记详情',
				btn_taps: true
			},
			controller: "GeneralPageController",
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load([{
						name: 'MetronicApp',
						files: [
							'js/controllers/GeneralPageController.js',
						]
					}]);
				}]
			}
		})

		// User Profile Dashboard
		.state("profile.dashboard", {
			url: "/dashboard",
			templateUrl: "views/profile/dashboard.html",
			data: {
				pageTitle: 'User Profile',
				pageSubTitle: 'user profile dashboard sample'
			}
		})

		// Todo
		.state('test', {
			url: "/test",
			templateUrl: "views/test/test.html",
			data: {
				pageTitle: 'Todo',
				pageSubTitle: 'user todo & tasks sample'
			},
			controller: "TodoController",
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'MetronicApp',
						insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
						files: [
							'../../../assets/global/plugins/bootstrap-datepicker/css/datepicker3.css',
							'../../../assets/global/plugins/select2/select2.css',
							'../../../assets/admin/pages/css/todo.css',
							'../../../assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',
							'../../../assets/admin/pages/css/profile.css',
							'../../../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
							'../../../assets/global/plugins/select2/select2.min.js',

							//'../../../assets/admin/pages/scripts/todo.js',

							'js/controllers/TodoController.js'
						]
					});
				}]
			}
		})

}]);

/* Init global settings and run the app */
MetronicApp.run(["$rootScope", "settings", "$state", function($rootScope, settings, $state) {
	$rootScope.$state = $state; // state to be accessed from view
}]);

MetronicApp.directive('repeatFinish',function(){
    return {
        link: function(scope,element,attr){
            if(scope.$last == true){
                scope.$eval( attr.repeatFinish )
            }
        }
    }
})
