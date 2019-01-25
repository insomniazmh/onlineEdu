function sesWebSocket(wsurl) {
	this.connectURL = wsurl || "";
	this.time = 5000; //心跳时间
	this.heartMsg = ""; //心跳发送内容
	this.timeoutObj = null;
	this.serverTimeoutObj = null;
	this.reconnectTime = null;
	this.isDestroy = false;
	this.onopen = function(event) {
		// 自定义WSC连接事件：服务端与前端连接成功后触发
		console.log(event)
	};
	this.onmessage = function(event) {
		// 自定义WSC消息接收事件：服务端向前端发送消息时触发
		console.log(event)
	};
	this.onerror = function(event) {
		// 自定义WSC异常事件：WSC报错后触发
		console.log(event)
	};
	this.onclose = function(event) {
		// 自定义WSC关闭事件：WSC关闭后触发
		console.log(event)
	};
	this.webSocketObj = new WebSocket(wsurl);
}
sesWebSocket.fn = sesWebSocket.prototype = {
	create: function(obj) {
		if(obj) {
			$.extend(true, this, obj);
		}
		var websocket = this.webSocketObj;
		var currentThis = this;
		websocket.onopen = function(evnt) {

			currentThis.onopen(evnt);
		};
		websocket.onmessage = function(evnt) {

			currentThis.onmessage(evnt);
		};
		websocket.onerror = function(evnt) {

			currentThis.onerror(evnt);
		};
		websocket.onclose = function(evnt) {

			currentThis.onclose(evnt);
			currentThis.aaa();
		};
		this.reconnectTime = currentThis.reconnectTime;
	},
	aaa: function() {
		if(!this.isDestroy) {
			this.isDestroy = true;
			this.webSocketObj.close();
			var c = this;
			this.reconnectTime = setTimeout(function() {
				c.reconnect();
			}, c.time)
		}
	},
	destroy: function() {
		clearTimeout(this.timeoutObj);
		clearTimeout(this.serverTimeoutObj);
		clearTimeout(this.reconnectTime);
		this.isDestroy = true;
		this.webSocketObj.close();
	},
	heartStart: function(time, msg) {
		if(this.webSocketObj.readyState != 1) {
			return false;
		}
		if(time) {
			this.time = time;
		}
		if(msg) {
			this.heartMsg = msg;
		}
		var self = this;
		this.timeoutObj = setTimeout(function() {
			self.webSocketObj.send(msg);
			self.serverTimeoutObj = setTimeout(function() {
				self.reconnect();
			}, self.time)
		}, this.time);
		this.serverTimeoutObj = self.serverTimeoutObj;
	},
	heartReset: function() {
		clearTimeout(this.timeoutObj);
		clearTimeout(this.serverTimeoutObj);
		var time = this.time;
		var msg = this.heartMsg;　　　　
		this.heartStart(time, msg);
	},
	reconnect: function() {
		if(this.timeoutObj) {
			clearTimeout(this.timeoutObj);
			clearTimeout(this.serverTimeoutObj);
		}
		var wsurl = this.connectURL;
		this.webSocketObj = new WebSocket(wsurl);
		this.isDestroy = false;
		this.create();
	},
}
var $sesWebSocket = function(wsurl) {
	return new sesWebSocket(wsurl);
}

sesWebSocket.export = function(fn) {
	jQuery.extend(sesWebSocket.prototype, fn);
}