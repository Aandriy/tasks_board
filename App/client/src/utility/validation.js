import $ from "jquery";
class Validation {
	constructor() {
		this.rules = {};
	}
	observable(val = "") {
		var value = val,
			isModified = false;

		const errors = [];
		const validators = [];
		const stor = (val) => {
			if (typeof (val) === 'undefined') {
				return value;
			}
			value = val;
			stor.isModified = true;
			stor.check();
			return value;
		}
		stor.isRequired = false;

		Object.defineProperty(stor, 'name', { value: 'observable', enumerable: false, configurable: false, writable: false });
		Object.defineProperty(stor, 'isInvalid', { get: function () { return !!errors.length; }, enumerable: false, configurable: false });
		Object.defineProperty(stor, 'isValid', { get: function () { return !errors.length; }, enumerable: false, configurable: false });
		Object.defineProperty(stor, 'isModifiedAndInvalid', { get: function () { return stor.isModified && stor.isInvalid }, enumerable: false, configurable: false });

		Object.defineProperty(stor, 'toString', { value: function () { return JSON.stringify(value); }, enumerable: false, writable: false, configurable: false });
		Object.defineProperty(stor, 'push', {
			value: (...data) => {
				var args = Array.prototype.slice.call(data, 0);
				if (args.length) {
					Array.prototype.push.apply(validators, args);
				}
				stor.check();
			}, enumerable: false, writable: false, configurable: false
		});
		Object.defineProperty(stor, 'check', {
			value: () => {
				errors.splice();
				if (validators.length) {
					stor.errors = this.check(value, validators, stor);
				}
			}, enumerable: false, writable: false, configurable: false
		});
		Object.defineProperty(stor, 'isModified', {
			get: function () { return isModified; },
			set: function (val) { isModified = !!val },
			enumerable: false, configurable: false
		});
		Object.defineProperty(stor, 'errors', {
			get: function () { return errors.slice(0); },
			set: function (val) {
				errors.splice(0);

				if (Array.isArray(val)) {
					Array.prototype.push.apply(errors, val);
				} else if (val && typeof (val) === 'string') {
					errors.push(val);
				}
			},
			enumerable: false, configurable: false
		});
		Object.defineProperty(stor, 'validators', {
			get: function () { return validators; },
			set: function (val) {
				if (val === null) {
					validators.splice(0);
				} else if (Array.isArray(val)) {
					Array.prototype.push.apply(validators, val);
				} else if (val) {
					validators.push(val);
				}
			},
			enumerable: false, configurable: false
		});
		return stor;
	}
	check(value, rules, field) {
		if (!Array.isArray(rules)) {
			rules = [rules];
		}
		const errors = [];
		rules.forEach(rule => {
			let error = this.process(value, rule, field);

			if (error) {
				errors.push(error);
			}
		});
		return errors;
	}
	process(value, rule, field) {
		let name;
		let message = '';
		const settings = {};
		if (typeof (rule) === 'string') {
			name = rule;
		} else if (typeof (rule) === 'object' && rule.name) {
			name = rule.name;
			Object.assign(settings, rule);
		} else if (typeof (rule) === 'function') {
			message = rule(value, settings);
			return message;
		} else {
			return message;
		}

		if (!name) {
			return message;
		}

		const validator = this.rules[name];
		if (!validator) {
			return message;
		}
		if (name === 'required') {
			field.isRequired = false;
		}

		if (typeof (validator.onlyIf) === 'function') {
			if (!validator.onlyIf(value, settings)) {
				return message;
			}
		}
		if (name === 'required') {
			field.isRequired = true;
		}

		if (validator.isError(value, settings)) {
			if (typeof (validator.message) === 'function') {
				return validator.message(settings)
			} else if (typeof (validator.message) === 'string') {
				return validator.message;
			} else {
				return 'error';
			}
		}
		return '';
	}
}

const validation = new Validation();

/**
* required
* @param trim (bool)
* @param message (string)
*/
validation.rules['required'] = {
	isError: function (val) {
		let isValid = false;
		const settings = {
			trim: true,
			regexp: null,
			isHtml: false
		};
		Object.assign(settings, arguments[1] || {})
		if (Array.isArray(val)) {
			val = val.join();
		} else if (settings.isHtml && val) {
			val = $('<div></div>').html(val).text();
		}
		if (settings.trim && val) {
			val = String(val).trim()
		}
		isValid = !!val;
		return !isValid;
	},
	message: function (settings = {}) {
		const message = settings.message || 'Required.';
		return message;
	}
};


/**
* eail
* @param prop (int)
* @param message (string)
*/
validation.rules['email'] = {
	isError: function (val, data = {}) {
		var reg = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
		if (!val) {
			return false;
		}
		if (data.regex) {
			reg = data.regex;
		}
		if (typeof (reg) === 'string') {
			reg = new RegExp(reg);
		}
		return !reg.test(val);
	},
	message: function (settings = {}) {
		const message = settings.message || 'Should be defined in the format: someone@example.com.';
		return message;
	}
};


/**
* characterLimit
* @param min (int)
* @param max (int)
* @param trim (bool)
* @param regexp (RegExp)
* @param message (string)
*/
validation.rules['characterLimit'] = {
	isError: function (val, data = {
		min: 0,
		max: 0,
		trim: false,
		regexp: null
	}) {
		var count,
			reg;

		if (!val) {
			return false;
		}
		if (data.regexp) {
			reg = data.regexp;
			if (!(reg instanceof RegExp)) {
				reg = new RegExp(reg);
			}
			return !reg.test(val);
		}
		if (data.trim) {
			val = String(val).trim()
		}

		count = val.length;
		if (data.min && data.max) {
			return !(count >= data.min && count <= data.max);
		}
		if (data.min) {
			return !(count >= data.min);
		}
		if (data.max) {
			return !(count <= data.min);
		}
		return !count;
	},
	message: function (settings = {}) {
		var message;
		if (settings.message) {
			message = settings.message;
		} else {
			if (settings.min && settings.max) {
				message = 'Should contain {min} - {max} characters';
			} else if (settings.min) {
				message = 'Should contain {min} characters';
			} else if (settings.max) {
				message = 'Should contain {max} characters';
			} else {
				message = 'Should contain characters';
			}
		}
		message = message.replace('{min}', settings.min || '');
		message = message.replace('{max}', settings.max || '');
		return message;
	}
};

/**
* onlyAlphanumeric
* @param regex (string[RegExp])
* @param message (string)
* @param inversion (bool)
*/
validation.rules['onlyAlphanumeric'] = {
	isError: function (val, data = {}) {
		var reg = '^[a-z0-9]+$',
			result;

		if (!val) {
			return false;
		}
		if (data.regex) {
			reg = data.regex;
		}
		if (!(reg instanceof RegExp)) {
			reg = new RegExp(reg, 'i');
		}
		result = reg.test(val);
		if (data.inversion) {
			return result;
		}
		return !result;
	},
	message: function (settings) {
		var data = settings.params || {},
			message = data.message ? data.message : 'Letters and digits are only allowed.';
		return message;
	}
};

export default validation;