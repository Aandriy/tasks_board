import $ from "jquery";
const deferred = () => {
	const promise = $.Deferred();
	return promise;
};

export default deferred;