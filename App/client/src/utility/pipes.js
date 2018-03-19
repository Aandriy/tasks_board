import moment from 'moment';
class Pipes {
	dateTime(str) {
		const temp = moment(str);
		if (temp.isValid()) {
			return temp.format('YYYY/MM/DD HH:mm:ss');
		}
		return '';
	};
	date(str) {
		const temp = moment(str);
		if (temp.isValid()) {
			return temp.format('YYYY/MM/DD');
		}
		return '';
	};
	time(str) {
		const temp = moment(str);
		if (temp.isValid()) {
			return temp.format('HH:mm:ss');
		}
		return '';
	};
	unCaseString(str) {
		str = String(str).trim();
		if (str) {
			return str.replace(/([a-z](?=[A-Z]))/g, '$1 ');
		}
		return str;
	};
}

export default new Pipes();