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
}]);

/***
Layout Partials.
By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial 
initialization can be disabled and Layout.init() should be called on page load complete as explained above.
***/

/* Setup Layout Part - Header */
MetronicApp.controller('HeaderController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initHeader(); // init header
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
        $rootScope.kps = [];
        $scope.createKp = function() {
        	var html = '<a class="btn btn-circle btn-sm btn-info" name="kp"><span>'+$("#kp").val()+'</span><i class="fa fa-times" name="remove"></i></a>';
        	$("#kpContent").append(html);
        };
        
        $("#kpContent").on("click", "a[name='kp']", function() {
			$("#kpContent a[name='kp']").removeClass("btn-danger").addClass("btn-info");
			$(this).removeClass("btn-info").addClass("btn-danger");
			var html = $(this).children("span").html();
			$scope.$apply(function() {　　
				if(html != "无") {
					$rootScope.currKP = '-' + html;
				} else {
					$rootScope.currKP = '';
				}
			});

		});
		
		$("#kpContent").on("click", "i[name='remove']", function() {
			$(this).closest("a").remove();
			return false;
		});
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
    
    // 报名信息添加
    .state('enrollAdd', {
      url: "/enrollAdd.html",
      templateUrl: "views/enroll/enrollAdd.html",     
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
      templateUrl: "views/statistics/statistics.html",     
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

    //  学生信息统计
    .state('statisticsAdd', {
      url: "/statisticsAdd.html",
      templateUrl: "views/statistics/statisticsAdd.html",     
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

     //  学生成绩
    .state('achievement', {
      url: "/achievement.html",
      templateUrl: "views/schoolroll/achievement.html",     
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

    //  学籍添加
    .state('schoolrollAdd', {
      url: "/schoolrollAdd.html",
      templateUrl: "views/schoolroll/schoolrollAdd.html",     
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
    
    //  入学信息
    .state('schoolrollInfo', {
      url: "/schoolrollInfo.html",
      templateUrl: "views/schoolroll/schoolrollInfo.html",     
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
      templateUrl: "views/schoolroll/studyalienation/studyAlienation.html",     
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

    //  学籍异动添加
    .state('studyalienation', {
      url: "/alienationAdd.html",
      templateUrl: "views/schoolroll/studyalienation/alienationAdd.html",     
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
  
    //  异动审核列表
    .state('auditList', {
      url: "/auditList.html",
      templateUrl: "views/schoolroll/studyalienation/auditList.html",     
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
     
    //  异动审核
    .state('studyTake', {
      url: "/studyTake.html",
      templateUrl: "views/schoolroll/studyalienation/studyTake.html",     
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
    
    //  审核详情
    .state('alienationDetails', {
      url: "/alienationDetails.html",
      templateUrl: "views/schoolroll/studyalienation/alienationDetails.html",     
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

    //  考务成绩
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
    
    //  学费标准
    .state('tuitionStandard', {
      url: "/tuitionStandard.html",
      templateUrl: "views/financialWork/tuitionStandard.html",     
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

    //  缴费流水
    .state('paymentFlow', {
      url: "/paymentFlow.html",
      templateUrl: "views/financialWork/paymentFlow.html",     
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

  //  课时费流水
    .state('classHourCost', {
      url: "/classHourCost.html",
      templateUrl: "views/financialWork/classHourCost.html",     
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
    
  //  通知公告
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
}]);

/* Init global settings and run the app */
MetronicApp.run(["$rootScope", "settings", "$state", function($rootScope, settings, $state) {
    $rootScope.$state = $state; // state to be accessed from view
}]);