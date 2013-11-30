exports.Request = function request(paramValue){
	this.contenttype = "";
	this.body = "";
	this.params = {
		value:paramValue
	};
	this.get = function(ct){
		if (ct === 'Content-Type') {
			return this.contenttype;
		}
	};
	this.set = function(field, value){
		if (field === 'Content-Type'){
			this.contenttype = value;
		}
	};
};

exports.Response = function(done){
	this.statusCode = 0;
	this.body = "";
	this.send = function(status, data){
		this.statusCode = status;
		this.body = data;
		done();
	};
};