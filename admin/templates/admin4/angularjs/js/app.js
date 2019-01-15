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
		console.log(data);
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
				$scope.courses = data.data;
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
			controller: "CoursesListController",
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

		// UI Select
		.state('uiselect', {
			url: "/ui_select.html",
			templateUrl: "views/ui_select.html",
			data: {
				pageTitle: 'AngularJS Ui Select',
				pageSubTitle: 'select2 written in angularjs'
			},
			controller: "UISelectController",
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load([{
						name: 'ui.select',
						insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
						files: [
							'../../../assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
							'../../../assets/global/plugins/angularjs/plugins/ui-select/select.min.js'
						]
					}, {
						name: 'MetronicApp',
						files: [
							'js/controllers/UISelectController.js'
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

		// Tree View
		.state('tree', {
			url: "/tree",
			templateUrl: "views/tree.html",
			data: {
				pageTitle: 'jQuery Tree View',
				pageSubTitle: 'tree view samples'
			},
			controller: "GeneralPageController",
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load([{
						name: 'MetronicApp',
						insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
						files: [
							'../../../assets/global/plugins/jstree/dist/themes/default/style.min.css',

							'../../../assets/global/plugins/jstree/dist/jstree.min.js',
							'../../../assets/admin/pages/scripts/ui-tree.js',
							'js/controllers/GeneralPageController.js'
						]
					}]);
				}]
			}
		})

		// Form Tools
		.state('formtools', {
			url: "/form-tools",
			templateUrl: "views/form_tools.html",
			data: {
				pageTitle: 'Form Tools',
				pageSubTitle: 'form components & widgets sample'
			},
			controller: "GeneralPageController",
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load([{
						name: 'MetronicApp',
						insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
						files: [
							'../../../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
							'../../../assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
							'../../../assets/global/plugins/jquery-tags-input/jquery.tagsinput.css',
							'../../../assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
							'../../../assets/global/plugins/typeahead/typeahead.css',

							'../../../assets/global/plugins/fuelux/js/spinner.min.js',
							'../../../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
							'../../../assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
							'../../../assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
							'../../../assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
							'../../../assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
							'../../../assets/global/plugins/jquery-tags-input/jquery.tagsinput.min.js',
							'../../../assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
							'../../../assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
							'../../../assets/global/plugins/typeahead/handlebars.min.js',
							'../../../assets/global/plugins/typeahead/typeahead.bundle.min.js',
							'../../../assets/admin/pages/scripts/components-form-tools.js',

							'js/controllers/GeneralPageController.js'
						]
					}]);
				}]
			}
		})

		// Date & Time Pickers
		.state('pickers', {
			url: "/pickers",
			templateUrl: "views/pickers.html",
			data: {
				pageTitle: 'Date & Time Pickers',
				pageSubTitle: 'date, time, color, daterange pickers'
			},
			controller: "GeneralPageController",
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load([{
						name: 'MetronicApp',
						insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
						files: [
							'../../../assets/global/plugins/clockface/css/clockface.css',
							'../../../assets/global/plugins/bootstrap-datepicker/css/datepicker3.css',
							'../../../assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
							'../../../assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
							'../../../assets/global/plugins/bootstrap-daterangepicker/daterangepicker-bs3.css',
							'../../../assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',

							'../../../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
							'../../../assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
							'../../../assets/global/plugins/clockface/js/clockface.js',
							'../../../assets/global/plugins/bootstrap-daterangepicker/moment.min.js',
							'../../../assets/global/plugins/bootstrap-daterangepicker/daterangepicker.js',
							'../../../assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
							'../../../assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',

							'../../../assets/admin/pages/scripts/components-pickers.js',

							'js/controllers/GeneralPageController.js',

							'js/controllers/GeneralPageController.js'
						]
					}]);
				}]
			}
		})

		// Custom Dropdowns
		.state('dropdowns', {
			url: "/dropdowns",
			templateUrl: "views/dropdowns.html",
			data: {
				pageTitle: 'Custom Dropdowns',
				pageSubTitle: 'select2 & bootstrap select dropdowns'
			},
			controller: "GeneralPageController",
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load([{
						name: 'MetronicApp',
						insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
						files: [
							'../../../assets/global/plugins/bootstrap-select/bootstrap-select.min.css',
							'../../../assets/global/plugins/select2/select2.css',
							'../../../assets/global/plugins/jquery-multi-select/css/multi-select.css',

							'../../../assets/global/plugins/bootstrap-select/bootstrap-select.min.js',
							'../../../assets/global/plugins/select2/select2.min.js',
							'../../../assets/global/plugins/jquery-multi-select/js/jquery.multi-select.js',

							'../../../assets/admin/pages/scripts/components-dropdowns.js',

							'js/controllers/GeneralPageController.js'
						]
					}]);
				}]
			}
		})

		// Advanced Datatables
		.state('datatablesAdvanced', {
			url: "/datatables/advanced.html",
			templateUrl: "views/datatables/advanced.html",
			data: {
				pageTitle: 'Advanced Datatables',
				pageSubTitle: 'advanced datatables samples'
			},
			controller: "GeneralPageController",
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'MetronicApp',
						insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
						files: [
							'../../../assets/global/plugins/select2/select2.css',
							'../../../assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',
							'../../../assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css',
							'../../../assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css',

							'../../../assets/global/plugins/select2/select2.min.js',
							'../../../assets/global/plugins/datatables/all.min.js',
							'js/scripts/table-advanced.js',

							'js/controllers/GeneralPageController.js'
						]
					});
				}]
			}
		})

		// Ajax Datetables
		.state('datatablesAjax', {
			url: "/datatables/ajax.html",
			templateUrl: "views/datatables/ajax.html",
			data: {
				pageTitle: 'Ajax Datatables',
				pageSubTitle: 'ajax datatables samples'
			},
			controller: "GeneralPageController",
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'MetronicApp',
						insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
						files: [
							'../../../assets/global/plugins/select2/select2.css',
							'../../../assets/global/plugins/bootstrap-datepicker/css/datepicker.css',
							'../../../assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',

							'../../../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
							'../../../assets/global/plugins/select2/select2.min.js',
							'../../../assets/global/plugins/datatables/all.min.js',

							'../../../assets/global/scripts/datatable.js',
							'js/scripts/table-ajax.js',

							'js/controllers/GeneralPageController.js'
						]
					});
				}]
			}
		})

		// User Profile
		.state("profile", {
			url: "/profile",
			templateUrl: "views/profile/main.html",
			data: {
				pageTitle: 'User Profile',
				pageSubTitle: 'user profile sample'
			},
			controller: "UserProfileController",
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'MetronicApp',
						insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
						files: [
							'../../../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
							'../../../assets/admin/pages/css/profile.css',
							'../../../assets/admin/pages/css/tasks.css',

							'../../../assets/global/plugins/jquery.sparkline.min.js',
							'../../../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',

							'../../../assets/admin/pages/scripts/profile.js',

							'js/controllers/UserProfileController.js'
						]
					});
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

		// User Profile Account
		.state("profile.account", {
			url: "/account",
			templateUrl: "views/profile/account.html",
			data: {
				pageTitle: 'User Account',
				pageSubTitle: 'user profile account sample'
			}
		})

		// User Profile Help
		.state("profile.help", {
			url: "/help",
			templateUrl: "views/profile/help.html",
			data: {
				pageTitle: 'User Help',
				pageSubTitle: 'user profile help sample'
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