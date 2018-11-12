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
    
    	// 课程列表
        .state('courseList', {
            url: "/courseList.html",
            templateUrl: "views/template/courseList.html",     
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
        
        // 课程详情
        .state('course', {
            url: "/course.html",
						templateUrl: "views/template/course.html",  
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
        
        //论坛
        .state('post', {
            url: "/post.html",
            templateUrl: "views/template/post.html",            
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
				
				//视频
				.state('video', {
						url: "/video.html",
						templateUrl: "views/template/video.html",            
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

        // User Profile Dashboard
        .state("profile.dashboard", {
            url: "/dashboard",
            templateUrl: "views/profile/dashboard.html",
            data: {pageTitle: 'User Profile', pageSubTitle: 'user profile dashboard sample'}
        })

        // User Profile Account
        .state("profile.account", {
            url: "/account",
            templateUrl: "views/profile/account.html",
            data: {pageTitle: 'User Account', pageSubTitle: 'user profile account sample'}
        })

        // User Profile Help
        .state("profile.help", {
            url: "/help",
            templateUrl: "views/profile/help.html",
            data: {pageTitle: 'User Help', pageSubTitle: 'user profile help sample'}      
        })

        // Todo
        .state('test', {
            url: "/test",
            templateUrl: "views/test/test.html",
            data: {pageTitle: 'Todo', pageSubTitle: 'user todo & tasks sample'},
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