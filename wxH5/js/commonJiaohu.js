var common = {
	
	url: 'https://e.hnfts.cn/education',//永永服务
	//url: 'http://192.168.13.230:8090',//永永本机
	url2: 'https://e.hnfts.cn/quiz',//真铭服务
	//url2: 'http://192.168.13.15:8080',//真铭本机
	

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
			    url: common.url2 + settings.url,
			    data: settings.data,
			}).then(function successCallback(response) {
//					console.log("请求："+JSON.stringify(settings.data)+"返回"+JSON.stringify(response));
					var data = response.data;
			        if(data.ret == 0) {
			        	
						settings.success(response.data);
			        }else {
			        	
			        }
			    }, function errorCallback(response) {
			    	console.log("error");
			    	settings.error(response);
			});
	},
	
	addTitleForQuestion: function(settings) {
		$(settings.questionArr).each(function() {
			if(settings.select) {
				this.select = true;
			}
			if(this.examChildren[0].examType == "single") {
				this.title = this.examChildren[0].choiceQstTxt+"（单选）";
			}else if(this.examChildren[0].examType == "multiple") {
				this.title = this.examChildren[0].choiceQstTxt+"（多选）";
			}else if(this.examChildren[0].examType == "trueOrFalse") {
				this.title = this.examChildren[0].trueOrFalseInfo+"（判断）";
			}else if(this.examChildren[0].examType == "design") {
				this.title = this.examChildren[0].designQuestion+"（主观）";
			}
		});
		return settings.questionArr;
	}
}