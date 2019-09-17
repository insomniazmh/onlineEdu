var common = {
	
	// url: 'http://1z695163y1.iask.in:11056',
	//正式服
	 url: 'https://e.hnfts.cn/lineEdu',
	 url2: 'https://e.hnfts.cn/lineEduQuiz',

	//测试服
	// url: 'http://192.168.10.2:7080',
	// url2: 'http://192.168.10.2:7081',
	
	uploadUrl: 'https://e.hnfts.cn/upload/upload',
	
	pageSize: 15,

	//提示信息
	toast: function(settings) {
		var defaults = {
			type: 1,
			title: "操作成功",
			message: ""
		};
		settings = $.extend(defaults, settings);
		toastr.options = {
			"closeButton": true,
			"debug": false,
			"positionClass": "toast-top-center",
			"onclick": null,
			"showDuration": "1000",
			"hideDuration": "1000",
			"timeOut": "3000",
			"extendedTimeOut": "1000",
			"showEasing": "swing",
			"hideEasing": "linear",
			"showMethod": "fadeIn",
			"hideMethod": "fadeOut"
		};
		if(settings.type == 1) {
			toastr.success(settings.message, settings.title);
		}else {
			toastr.error(settings.message, settings.title);
		}
	},
	
	//退出登录
	signOut: function() {
		localStorage.removeItem("username");
		localStorage.removeItem("token");
		window.location.href = "login.html";
	},
	
	goUrl: function(url) {
		window.location.href = '#/' + url + '.html';
	},
	
	//网络请求
	ajax: function(settings) {
		var defaults = {
			method: 'post',
			gateway: 'edu',
			operate: false,
			url: '',
			success: function(response) {}
		};
		settings = $.extend(defaults, settings);
		
		if(settings.data && !settings.data.userId) {
			settings.data.userId = localStorage.getItem('userid')
		}
		
		if(settings.data) {
			settings.data.centerAreaId = ''
		}

		Metronic.blockUI({
			boxed: true,
			message: "加载中，请耐心等待..."
		});
		
		let postUrl = '';
		if(settings.gateway == 'edu') {
			postUrl = common.url + settings.url;
		}else {
			postUrl = common.url2 + settings.url;
		}
		
		if(settings.tip) {
			var index = layer.confirm(settings.tip, {
				btn: ['确定','取消'] //按钮
			}, function(){
				common.http(settings, postUrl);
				layer.close(index);
			}, function(){
				window.setTimeout(function() {
					Metronic.unblockUI();
				});
			});
		}else {
			common.http(settings, postUrl);
		}
	},
	
	http: function(settings, postUrl) {
		let headers = {}
		if(settings.headers) {
			headers = settings.headers
		}
		headers.token = localStorage.getItem("token")
		settings.$http({
			headers: headers,
			method: settings.method,
			url: postUrl,
			data: settings.data,
		}).then(function successCallback(response) {
			var data = response.data;
			if(data.ret == 0) {
				if(settings.operate) {
					common.toast({
						title: "操作成功"
					});
				}
				settings.success(data.data);
			} else if(data.ret == 4) {
				common.toast({
					type: 2,
					title: "操作失败",
					message: '登录信息已过期，请重新登录'
				});
				common.signOut();
			}else {
				layer.closeAll('dialog');
				common.toast({
					type: 2,
					title: "操作失败",
					message: data.msg
				});
				if(settings.error) {
					settings.error(response);
				}
			}
			window.setTimeout(function() {
				Metronic.unblockUI();
			});
		}, function errorCallback(response) {
			layer.closeAll('dialog');
			window.setTimeout(function() {
				Metronic.unblockUI();
			});
			common.toast({
				type: 2,
				title: "网络异常"
			});
		});
	},
	
	ajax2: function(settings) {
		settings.gateway = 'quiz';
		common.ajax(settings);
	},
	
	addTitleForQuestion: function(settings) {
		$(settings.questionArr).each(function() {
			if(settings.select) {
				this.select = true;
			}
			if(this.examType == "single") {
				this.title = this.choiceQstTxt + "（单选）";
			} else if(this.examType == "multiple") {
				this.title = this.choiceQstTxt + "（多选）";
			} else if(this.examType == "trueOrFalse") {
				this.title = this.choiceQstTxt + "（判断）";
			} else if(this.examType == "design") {
				this.title = this.choiceQstTxt + "（主观）";
			}
			
		});
		return settings.questionArr;
	},
	
	//上传文件
	fileUpload: function(settings) {
		let url = common.uploadUrl;
		if(settings.type == 'excel') {
			url = common.url + settings.url;
		}
		
		let options = {
			// 选完文件后，是否自动上传。
			auto: true,
			// swf文件路径
			swf: '/js/Uploader.swf',
			// 文件接收服务端。
			server: url,
			// 选择文件的按钮。可选。
			// 内部根据当前运行是创建，可能是input元素，也可能是flash.
			pick: '#' + settings.id
		}
		if(settings.options) {
			options = $.extend(options, settings.options);
		}
		
		// 初始化Web Uploader
		var uploader = WebUploader.create(options);
		
		uploader.on('fileQueued', function(file) {
			console.log( file );
			var flag = common.checkFileExt(file.name, settings.type);
			if(flag && settings.fileQueued) {
				settings.fileQueued(file.name);
			}
		})
		
	
		uploader.on('uploadBeforeSend', function(block, data, headers) {
			console.log( uploader.getFiles() );
			if(settings.beforeSend) {
				let rtn = settings.beforeSend()
				if(!rtn.continue) {
					common.toast({
						title: rtn.title,
						type: 2
					});
					uploader.removeFile( data.id, true );
					uploader.cancelFile( data.id, true );
					return false
				}
			}
			var flag = common.checkFileExt(data.name, settings.type);
			console.log(data);
			if(!flag) {
				uploader.removeFile( data.id, true );
				uploader.cancelFile( data.id, true );
				console.log( uploader.getFiles() );
			}else {
				Metronic.blockUI({
					boxed: true,
					message: "上传中，请耐心等待..."
				});
			}
			
		})
	
		uploader.on('uploadSuccess', function(file, response) {
			Metronic.unblockUI();
			settings.success(file, response, uploader);
		});
	
		uploader.on('uploadError', function(file) {
			Metronic.unblockUI();
			common.toast({
				title: "上传失败",
				type: 2
			});
		});
		if(options.uploadBtn && !options.auto) {
			$("#"+options.uploadBtn).on('click', function() {
				uploader.upload();
			});
		}
		
	},
	
	//校验文件后缀
	checkFileExt: function(filename, filetype){
		 var flag = false; //状态
		 var arr = [];
		 
		 if(filetype == 'doc') {
		 	arr = ["jpg","png",'doc','docx','txt']
		 }else if(filetype == 'audio') {
		 	arr = ["mp3"];
		 }else if(filetype == 'video') {
		 	arr = ["mp4"];
		 }else if(filetype == 'pic') {
		 	arr = ["jpg","png"];
		 }else if(filetype == 'ppt') {
		 	arr = ["ppt","pptx"];
		 }else if(filetype == 'excel') {
		 	arr = ["xls","xlsx"];
		 }
		 
		 //取出上传文件的扩展名
		 var index = filename.lastIndexOf(".");
		 var ext = filename.substr(index+1);
		 //循环比较
		 for(var i=0;i<arr.length;i++) {
		  if(ext == arr[i])
		  {
		   flag = true; //一旦找到合适的，立即退出循环
		   break;
		  }
		 }
		 var text = arr.join(',');
		 //条件判断
		 if(!flag) {
		  layer.alert('文件不合法,只支持'+text+'格式');
		 }
		 
		 return flag;
	},
	
	openModal: function(settings) {
		if(!settings.$rootScope.currentNode) {
			layer.alert("请先选择章节");
			return false;
		}
		
		if(settings.$rootScope.currentNode.id == '0') {
			layer.alert("题目不能加到课程上");
			return false;
		}
				
		layer.confirm("您确定要为--(" + settings.$rootScope.currentNode.text + ")--章节创建" + settings.tips + "吗", {
			btn: ['确定', "取消"] //按钮
		}, function() {
			settings.success();
			layer.closeAll('dialog');
		});
	},
	
	//加载列表
	loadDataList: function(settings) {
		if(!settings.$scope.currentPage) {
			settings.$scope.currentPage = 1
		}
			
		let postData = {
			"page": settings.$scope.currentPage - 1,
			"size": settings.$rootScope.pageSize,
			// sortVo: {
			// 	"page": settings.$scope.currentPage - 1,
			// 	"size": settings.$rootScope.pageSize,
			// }
		};
		let method = 'post';
		if(settings.method) {
			method = settings.method
		}
		
		if(settings.$scope.searchObj) {
			postData = Object.assign(postData, settings.$scope.searchObj);
		}
		
		postData.centerAreaId = '1f184d63f76644e3bb0889d7e43d9309'
		console.log(postData);
		
		common.ajax({
			method: method,
			$scope: settings.$scope,
			$http: settings.$http,
			data: postData,
			url: settings.url,
			success: function(res) {
				if(!res.content) {
					res.content = res;
				}
				settings.$scope.totalItems = res.totalPages;
				settings.$scope.bigTotalItems = res.totalElements;
				if(settings.rtnData) {
					settings.$scope[settings.rtnData] = res.content;
				}else {
					settings.$scope.data = res.content;
				}
				if(settings.success) {
					settings.success()
				}
			}
		});
	}

}