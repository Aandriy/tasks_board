export default function (data) {
	const keys = Object.keys(data);
	function Dictionary() {
		var self = this;
		keys.forEach((key) => {
			self[key] = data[key];
		});
	}
	keys.forEach((key) =>{
		Dictionary.prototype[data[key]] = key;
	});
	return new Dictionary();
};