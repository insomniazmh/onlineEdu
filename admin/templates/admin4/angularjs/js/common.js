var common = {

	//正式服
	url: 'https://e.hnfts.cn/education',
	url2: 'https://e.hnfts.cn/quiz',
	uploadUrl: 'https://e.hnfts.cn/upload/upload',
	webSocketUrl: 'wss://e.hnfts.cn/websocket',

	//测试服
	// url: 'http://192.168.10.2:8080',
	// url2: 'http://192.168.10.2:8081',
	// uploadUrl: 'http://192.168.10.2:8612/upload',
	// webSocketUrl: 'ws://192.168.10.2:9000',
	
	
	pageSize: 10,
	//提示框
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
		} else {
			toastr.error(settings.message, settings.title);
		}

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

	//多文件上传
	multiFileUpload: function(settings) {
		// 初始化Web Uploader
		var uploader = WebUploader.create({
			// 选完文件后，是否自动上传。
			auto: false,
			// swf文件路径
			swf: '/js/Uploader.swf',
			// 文件接收服务端。
			server: common.uploadUrl,
			// 选择文件的按钮。可选。
			// 内部根据当前运行是创建，可能是input元素，也可能是flash.
			pick: '#' + settings.id
		});

		uploader.onFileQueued = function(file) {
			console.log(file);
			var $li = $('<li id="' + file.id + '">' +
					'<p class="imgWrap"></p>' +
					'</li>'),

				$btns = $('<div class="file-panel">' +
					'<i class="glyphicon glyphicon-trash"></i>' +
					'</div>').appendTo($li),
				$wrap = $li.find('p.imgWrap');

			if(file.getStatus() === 'invalid') {
				common.toast({
					title: file.statusText
				});
			} else {
				// @todo lazyload
				$wrap.text('预览中');
				uploader.makeThumb(file, function(error, src) {
					if(error) {
						$wrap.text('不能预览');
						return;
					}

					var img = $('<img src="' + src + '">');
					$wrap.empty().append(img);
				}, 110, 110);
			}

			$li.on('mouseenter', function() {
				$btns.stop().animate({
					height: 30
				});
			});

			$li.on('mouseleave', function() {
				$btns.stop().animate({
					height: 0
				});
			});

			$btns.on('click', 'i', function() {
				uploader.removeFile(file);
				$li.remove();
			});

			$li.appendTo('.pics');
		};

		uploader.on('uploadBeforeSend', function(block, data, headers) {
			Metronic.blockUI({
				boxed: true,
				message: "上传中，请耐心等待..."
			});
		})

		uploader.on('uploadSuccess', function(file, response) {
			Metronic.unblockUI();
			common.toast({
				title: "上传成功",
			});
			settings.success(file, response, uploader);
		});

		uploader.on('uploadError', function(file) {
			Metronic.unblockUI();
			common.toast({
				title: "上传失败",
				type: 2
			});
		});

		$(settings.uploadBtn).click(function() {
			uploader.upload();
		})
	},

	//网络请求--继伟接口
	ajax: function(settings) {
		var defaults = {
			method: 'post',
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

		settings.$http({
			headers: {
				token: localStorage.getItem("token")
			},
			method: settings.method,
			url: common.url + settings.url,
			data: settings.data,
		}).then(function successCallback(response) {
			//					console.log("请求："+JSON.stringify(settings.data)+"--返回"+JSON.stringify(response));
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

	//网络请求--永永接口
	ajax2: function(settings) {
		var defaults = {
			method: 'post',
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

		settings.$http({
			headers: {
				token: localStorage.getItem("token")
			},
			method: settings.method,
			url: common.url2 + settings.url,
			data: settings.data,
		}).then(function successCallback(response) {
			//					console.log("请求："+JSON.stringify(settings.data)+"返回"+JSON.stringify(response));
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
			} else {
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
			console.log("error");
			window.setTimeout(function() {
				Metronic.unblockUI();
			});
			common.toast({
				type: 2,
				title: "网络异常"
			});
		});
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
	
	signOut: function() {
		localStorage.removeItem("username");
		localStorage.removeItem("token");
		window.location.href = "login.html";
	},
	
	compare: function(propertyName) {
		return function(obj1, obj2) {
			let val1 = obj1[propertyName];
	    let val2 = obj2[propertyName];
	    if(val1 < val2){
	       return -1;
	    }else if(val1 > val2){
	       return 1;
	    }else{
	       return 0;
	    }
		}
	},
	
	//校验文件后缀
	checkFileExt: function(filename, filetype){
		 var flag = false; //状态
		 var arr = [];
		 
		 if(filetype == 'doc') {
		 	arr = ["jpg","png",'doc','docx']
		 }else if(filetype == 'audio') {
		 	arr = ["mp3"];
		 }else if(filetype == 'video') {
		 	arr = ["mp4"];
		 }else if(filetype == 'pic') {
		 	arr = ["jpg","png"];
		 }else if(filetype == 'ppt') {
		 	arr = ["ppt","pptx"];
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
	}
}

//复制链接到剪切板
var clipboard = new ClipboardJS('.clipboard');
clipboard.on('success', function(e) {
	console.log(e);
});
clipboard.on('error', function(e) {
	console.log(e);
});