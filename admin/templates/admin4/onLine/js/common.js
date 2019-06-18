var common = {
	
	//正式服
	url: 'https://e.hnfts.cn/education',
	url2: 'https://e.hnfts.cn/quiz',
	uploadUrl: 'https://e.hnfts.cn/upload/upload',

	//测试服
//	url: 'http://192.168.10.2:8080',
//	url2: 'http://192.168.10.2:8081',
//	uploadUrl: 'http://192.168.10.2:8612/upload',

	pageSize: 10,

	toast: function(settings) {
		var defaults = {
			type: 1,
			title: "操作成功",
			message: ""
		};
		
		$.extend(settings, defaults);
		
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
	
	signOut: function() {
		localStorage.removeItem("username");
		localStorage.removeItem("token");
		window.location.href = "login.html";
	},
	
	//网络请求--继伟接口
	ajax: function(settings) {
		var defaults = {
			method: 'post',
			gateway: 'edu',
			operate: false,
			url: '',
			data: {},
			success: function(response) {}
		};
		settings = $.extend(defaults, settings);

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

		settings.$http({
			headers: {
				token: localStorage.getItem("token")
			},
			method: settings.method,
			url: postUrl,
			data: settings.data,
		}).then(function successCallback(response) {
			console.log("请求："+JSON.stringify(settings.data)+"--返回"+JSON.stringify(response));
			var data = response.data;
			if(data.ret == 0) {
				if(settings.operate) {
					common.toast({
						title: "操作成功"
					});
				}
				settings.success(response.data);
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
	
	goUrl: function(url, type) {
		window.location.href = '#/' + url + '.html';
	},
	
	addTitleForQuestion: function(settings) {
		$(settings.questionArr).each(function() {
			if(settings.select) {
				this.select = true;
			}
			if(this.examChildren) {
				if(this.examChildren[0].examType == "single") {
					this.title = this.examChildren[0].choiceQstTxt + "（单选）";
				} else if(this.examChildren[0].examType == "multiple") {
					this.title = this.examChildren[0].choiceQstTxt + "（多选）";
				} else if(this.examChildren[0].examType == "trueOrFalse") {
					this.title = this.examChildren[0].trueOrFalseInfo + "（判断）";
				} else if(this.examChildren[0].examType == "design") {
					this.title = this.examChildren[0].designQuestion + "（主观）";
				}
			}
			
		});
		return settings.questionArr;
	},
	
	//上传文件
	fileUpload: function(settings) {
		// 初始化Web Uploader
		var uploader = WebUploader.create({
			// 选完文件后，是否自动上传。
			auto: true,
			// swf文件路径
			swf: '/js/Uploader.swf',
			// 文件接收服务端。
			server: common.uploadUrl,
			// 选择文件的按钮。可选。
			// 内部根据当前运行是创建，可能是input元素，也可能是flash.
			pick: '#' + settings.id
		});

		uploader.on('uploadBeforeSend', function(block, data, headers) {
			if(settings.beforeSend) {
				var result = settings.beforeSend();
				if(!result.continue) {
					common.toast({
						title: result.title,
						type: 2
					});
					uploader.stop(true);
				}
			} else {
				Metronic.blockUI({
					boxed: true,
					message: "上传中，请耐心等待..."
				});
			}

		})

		uploader.on('uploadSuccess', function(file, response) {
			Metronic.unblockUI();
			//			common.toast({
			//				title: "上传成功",
			//			});
			settings.success(file, response, uploader);
		});

		uploader.on('uploadError', function(file) {
			Metronic.unblockUI();
			common.toast({
				title: "上传失败",
				type: 2
			});
		});
	},

}