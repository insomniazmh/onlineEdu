var common = {
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

	fileUpload: function(settings) {
		// 初始化Web Uploader
		var uploader = WebUploader.create({
			// 选完文件后，是否自动上传。
			auto: true,
			// swf文件路径
			swf: '/js/Uploader.swf',
			// 文件接收服务端。
			server: 'http://132.232.124.203:8612/upload',
			// 选择文件的按钮。可选。
			// 内部根据当前运行是创建，可能是input元素，也可能是flash.
			pick: '#' + settings.id
		});

		uploader.on('uploadSuccess', function(file, response) {
			common.toast({
				title: "上传成功",
			});
			settings.success(file, response, uploader);
		});

		uploader.on('uploadError', function(file) {
			console.log(12354);
			common.toast({
				title: "上传失败",
				type: 2
			});
		});
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