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
MetronicApp.controller('AppController', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope) {
    $scope.$on('$viewContentLoaded', function() {
      Metronic.initComponents(); // init core components
      //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 
        
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
				
				$rootScope.centerList = [];
				$rootScope.majorList = [];
				$rootScope.allPlanList = []
				$scope.showBar = false
				
				// 加载所有学习中心信息
				// common.ajax({
				// 	$scope: $scope,
				// 	$http: $http,
				// 	data: {
				// 		page: 0,
				// 		size: 100,
				// 	},
				// 	url: '/learnCenter/findAllPage',
				// 	success: function(res) {
				// 		$rootScope.centerList = res.content;
				// 	}
				// });
				
				console.log(localStorage.getItem('auth'))
				if(localStorage.getItem('auth') == 3) {
					$scope.showBar = true
				}
				
				//加载我的课程
				common.ajax({
					$scope: $scope,
					$http: $http,
					data: {
						page: 0,
						size: 100,
					},
					url: '/course/findMyCourse',
					success: function(res) {
						$rootScope.myCourseList = res;//我的课程列表
						if($rootScope.myCourseList.length > 0) {
							$rootScope.currCourse = $rootScope.myCourseList[0]//默认第一个课程为当前课程
							$rootScope.currCourseId = $rootScope.myCourseList[0].courseId//默认第一个课程为当前课程
							//如果已有当前课程id，根据id切换当前课程（处理刷新页面的情况）
							if(localStorage.getItem('currCourseId')) {
								for(let value of $rootScope.myCourseList) {
									if(value.courseId == localStorage.getItem('currCourseId')) {
										$rootScope.currCourse = value
									}
								}
							}
						}
					}
				});
				
				//加载所有教学计划
				common.ajax({
					$scope: $scope,
					$http: $http,
					data: {
						page: 0,
						size: 10000,
						agoDay: 30,
					},
					url: '/teachPlan/findByPlanIdPageAll',
					success: function(res) {
						$rootScope.allPlanList = res.content;
					}
				});
		
				$scope.changeCourse = function(row) {
					$rootScope.currCourseId = row.courseId
					$rootScope.currCourse = row
				}
    });
}]);

/* Setup Layout Part - Sidebar */
MetronicApp.controller('SidebarController', ['$scope', function($scope) {
	
	$scope.$on('$includeContentLoaded', function() {
		$scope.auth = localStorage.getItem('auth')
			Layout.initSidebar(); // init sidebar
	});
}]);

/* Setup Layout Part - Sidebar */
MetronicApp.controller('PageHeadController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.$on('$includeContentLoaded', function() {        
        Demo.init(); // init theme panel
				
				//header中课程被选中事件，获取被选中的课程
				
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
    $urlRouterProvider.otherwise("/home.html");

    $stateProvider
    // 主页
    .state('home', {
      url: "/home.html",
      templateUrl: "views/template/home.html",            
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
		
		// 课程导入
		.state('courseImport', {
			url: "/courseImport.html",
			templateUrl: "views/course/courseImport.html",
			data: {
				pageTitle: '课程导入',
				pageSubTitle: '课程导入'
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
    
    // 报名信息
    .state('enroll', {
      url: "/enroll.html",
      templateUrl: "views/enroll/enroll.html",     
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
    
    // 报名信息审核
    .state('enrollExamine', {
      url: "/enrollExamine.html",
      templateUrl: "views/enroll/enrollExamine.html",     
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

    // 报名计划
    .state('enrollPlan', {
      url: "/enrollPlan.html",
      templateUrl: "views/enroll/enrollPlan.html",     
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
    //  学生信息
    .state('statistics', {
      url: "/statistics.html",
      templateUrl: "views/enroll/statistics.html",     
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
		//  学生学习信息
		.state('study', {
		  url: "/study.html",
		  templateUrl: "views/student/study.html",     
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
    
     //  学籍管理
    .state('schoolroll', {
      url: "/schoolroll.html",
      templateUrl: "views/schoolroll/schoolroll.html",     
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

    //  异动管理
    .state('studyAlienation', {
      url: "/studyAlienation.html",
      templateUrl: "views/schoolroll/studyAlienation.html",     
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

    //  教学管理
    .state('teachingManagement', {
      url: "/teachingManagement.html",
      templateUrl: "views/teachingManagement/teachingManagement.html",     
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
    
    //  教学管理添加
    .state('teachingManagementAdd', {
      url: "/teachingManagementAdd.html",
      templateUrl: "views/teachingManagement/teachingManagementAdd.html",     
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

    //  平时成绩
    .state('peacetimeAchievement', {
      url: "/peacetimeAchievement.html",
      templateUrl: "views/teachingManagement/peacetimeAchievement.html",     
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

    //  实践成绩
    .state('practicalAchievements', {
      url: "/practicalAchievements.html",
      templateUrl: "views/teachingManagement/practicalAchievements.html",     
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
    
    //  考点信息
    .state('examinationInfo', {
      url: "/examinationInfo.html",
      templateUrl: "views/examination/examinationInfo.html",     
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

    
    //  考务日程
    .state('examinationSchedule', {
      url: "/examinationSchedule.html",
      templateUrl: "views/examination/examinationSchedule.html",     
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

    //  考试成绩
    .state('examinationResults', {
      url: "/examinationResults.html",
      templateUrl: "views/examination/examinationResults.html",     
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
    
    //成绩确认
    .state('resultConfirm', {
      url: "/resultConfirm.html",
      templateUrl: "views/examination/resultConfirm.html",     
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
    
  //  综合列表
    .state('comprehensiveList', {
      url: "/comprehensiveList.html",
      templateUrl: "views/graduationManagement/comprehensiveList.html",     
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

  //  毕业论文
    .state('Dissertation', {
      url: "/Dissertation.html",
      templateUrl: "views/graduationManagement/Dissertation.html",     
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

  //  论文导师
    .state('thesisAdvisor', {
      url: "/thesisAdvisor.html",
      templateUrl: "views/graduationManagement/thesisAdvisor.html",     
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

  //  课时费管理
    .state('hoursManagement', {
      url: "/hoursManagement.html",
      templateUrl: "views/financialWork/hoursManagement.html",     
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

  //  课时费标准
    .state('hoursStandard', {
      url: "/hoursStandard.html",
      templateUrl: "views/financialWork/hoursStandard.html",     
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


  //  外聘教师审核
    .state('externalTeacherAudit', {
      url: "/externalTeacherAudit.html",
      templateUrl: "views/schoolEnterpriseCooperation/externalTeacherAudit.html",     
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
       
  //  外聘教师添加
    .state('externalTeachersAdd', {
      url: "/externalTeachersAdd.html",
      templateUrl: "views/schoolEnterpriseCooperation/externalTeachersAdd.html",     
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
    
  //  外聘教师信息
    .state('externalTeachersInfo', {
      url: "/externalTeachersInfo.html",
      templateUrl: "views/schoolEnterpriseCooperation/externalTeachersInfo.html",     
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
         
  //  外聘教师课时明细
    .state('externalTeachersDetailed', {
      url: "/externalTeachersDetailed.html",
      templateUrl: "views/schoolEnterpriseCooperation/externalTeachersDetailed.html",     
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
    
  	//通知公告
    .state('notice', {
      url: "/notice.html",
      templateUrl: "views/notice/notice.html",     
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
		
		//资讯
		.state('information', {
		  url: "/information.html",
		  templateUrl: "views/notice/information.html",     
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
    
    //公告类别
    .state('noticeType', {
      url: "/noticeType.html",
      templateUrl: "views/notice/noticeType.html",     
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
    
    //课程添加
		.state('courseAdd', {
			url: "/courseAdd.html",
			templateUrl: "views/course/courseAdd.html",
			data: {
				pageTitle: '课程管理',
				pageSubTitle: '课程添加',
				btn_taps: true
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
		
		//课程编辑
		.state('courseEdit', {
			url: "/courseEdit.html",
			templateUrl: "views/course/courseEdit.html",
			data: {
				pageTitle: '课程编辑',
				pageSubTitle: '课程编辑',
				btn_taps: true
			},
			controller: "",
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
		
		// 课程字典
		.state('courseDic', {
			url: "/courseDic.html",
			templateUrl: "views/course/courseDic.html",
			data: {
				pageTitle: '计划课程名称'
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
		
		// 课程审核
		.state('courseExamine', {
			url: "/courseExamine.html",
			templateUrl: "views/course/courseExamine.html",
			data: {
				pageTitle: '课程审核'
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
		
		// 外聘教师
		.state('teachers', {
			url: "/teachers.html",
			templateUrl: "views/teacher/teachers.html",
			data: {
				pageTitle: '教师信息'
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
		
		// 线下成绩录入
		.state('offLineResult', {
			url: "/offLineResult.html",
			templateUrl: "views/teacher/offLineResult.html",
			data: {
				pageTitle: '线下成绩录入'
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
		
		// 教学计划
		.state('plans', {
			url: "/plans.html",
			templateUrl: "views/plan/plans.html",
			data: {
				pageTitle: '教学计划'
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
		
		// 教学计划
		.state('centerPlan', {
			url: "/centerPlan.html",
			templateUrl: "views/plan/centerPlan.html",
			data: {
				pageTitle: '教学计划'
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
		
		// 教学计划资料
		.state('planDatum', {
			url: "/planDatum.html",
			templateUrl: "views/plan/planDatum.html",
			data: {
				pageTitle: '教学计划资料'
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
		
		//教学资料
		.state('assistant', {
			url: "/assistant.html",
			templateUrl: "views/database/assistant.html",
			data: {
				pageTitle: '教学资料',
				pageSubTitle: '教学资料'
			}
		})
		
		//学生信息
		.state('student', {
			url: "/student.html",
			templateUrl: "views/student/student.html",
			data: {
				pageTitle: '学生信息',
				pageSubTitle: '学生信息'
			}
		})
		
		//学分统计
		.state('score', {
			url: "/score.html",
			templateUrl: "views/student/score.html",
			data: {
				pageTitle: '学分统计',
				pageSubTitle: '学分统计'
			}
		})
		
		//课时统计
		.state('keshi', {
			url: "/keshi.html",
			templateUrl: "views/teacher/keshi.html",
			data: {
				pageTitle: '课时统计',
				pageSubTitle: '课时统计'
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
		
		//学习中心维护
		.state('center', {
			url: "/center.html",
			templateUrl: "views/system/center.html",
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
		
		//专业维护
		.state('major', {
			url: "/major.html",
			templateUrl: "views/system/major.html",
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
		
		//角色权限维护
		.state('auth', {
			url: "/auth.html",
			templateUrl: "views/system/auth.html"
		})
}]);

/* Init global settings and run the app */
MetronicApp.run(["$rootScope", "settings", "$state", function($rootScope, settings, $state) {
    $rootScope.$state = $state; // state to be accessed from view
		$rootScope.pageSize = 15;
		$rootScope.auth = localStorage.getItem('auth')
    $rootScope.activeColor = function(value, callback) {
			value.active = !value.active;
			if(callback) {
				callback();
			}
		}
    
    $rootScope.radioActiveColor = function(value, array, callback) {
    	for(obj of array) {
    		obj.active = false;
    	}
			value.active = true;
			if(callback) {
				callback();
			}
		}
		
		$rootScope.verifyStatusHelper = function(status) {
			let rtn = ''
			if(status == 0) {
				rtn = '审核通过'
			}else if(status == 1) {
				rtn = '待审核'
			}else if(status == 2) {
				rtn = '审核未通过'
			}
			return rtn
		}
}]);