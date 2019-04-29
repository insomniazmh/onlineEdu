var common = {

	//正式服
	url: 'https://e.hnfts.cn/education',
	url2: 'https://e.hnfts.cn/quiz',
	webSocketUrl: 'wss://e.hnfts.cn/websocket',

	//测试服
//	url: 'http://192.168.10.2:8080',
//	url2: 'http://192.168.10.2:8081',
//	webSocketUrl: 'ws://192.168.10.2:9000',

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
			settings.success(response.data);
		}, function errorCallback(response) {
			layer.closeAll('dialog');
		});
	},

	//网络请求--真铭接口
	ajax2: function(settings) {
		var defaults = {
			method: 'post',
			operate: false,
			url: '',
			data: {},
			success: function(response) {},
			error: function(response) {
				console.log(response);

			}
		};
		settings = $.extend(defaults, settings);

		settings.$http({
			method: settings.method,
			headers: {
				token: localStorage.getItem("token")
			},
			url: common.url2 + settings.url,
			data: settings.data,
			cache: false,
		}).then(function successCallback(response) {
			if (response) {
				var data = response.data;
				if (data.ret == 0) {
					settings.success(response.data);
				} else if(data.ret == 2000) {
					alert(response.msg);
				} else if(data.ret == 4) {
					alert('登录信息失效，请重新登录');
				}else {
					alert(data.msg);
				}
			}
		}, function errorCallback(response) {
			console.log("error");
			settings.error(response);
		});
	},

	addTitleForQuestion: function(settings) {
		$(settings.questionArr).each(function() {
			if (settings.select) {
				this.select = true;
			}
			if (this.examChildren[0].examType == "single") {
				this.title = this.examChildren[0].choiceQstTxt + "（单选）";
			} else if (this.examChildren[0].examType == "multiple") {
				this.title = this.examChildren[0].choiceQstTxt + "（多选）";
			} else if (this.examChildren[0].examType == "trueOrFalse") {
				this.title = this.examChildren[0].trueOrFalseInfo + "（判断）";
			} else if (this.examChildren[0].examType == "design") {
				this.title = this.examChildren[0].designQuestion + "（主观）";
			}
		});
		return settings.questionArr;
	}
}
