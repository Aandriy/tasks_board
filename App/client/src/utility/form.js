import { validation, deferred } from '../utility';
class form {
	mount(model, states, scope) {
		const validationModel = {};
		states.validationSummary = [];
		scope.rewriteField = function (fieldName, val) {
			const state = this.state;
			const newState = {
				validationSummary: []
			};
			state[fieldName](val);
			newState[fieldName] = state[fieldName];
			this.setState(state);
		};

		scope.resetForm = function () {
			Object.keys(validationModel).forEach((key) => {
				validationModel[key](model[key]);
				validationModel[key].isModified = false;
			});
			this.setState({validationModel});
		};

	
		scope.isValid = function () {
			let result = true;
			Object.keys(validationModel).forEach((key) => {
				const field = validationModel[key];
				if (typeof(field === 'function')) {
					if (field.name === 'observable') {
						if (field.isInvalid) {
							field.isModified = true;
							result = false;
						}
					}
				}
			});
			if (!result){
				scope.setState({validationModel});
			}
			return result;
		};

		scope.response = function (response) {
			const defer = deferred();
			if (response) {
				if (Array.isArray(response.validation)) {
					const validationSummary = [];
					
					const errors = {};

					Object.keys(model).forEach((key) => {
						errors[key] = [];
					});

					response.validation.forEach((error) => {
						if (errors[error['field']]) {
							errors[error['field']].push(error['message']);
						} else {
							validationSummary.push(error['message']);
						}
					});

					Object.keys(errors).forEach((fieldName) => {
						if (errors[fieldName].length) {
							validationModel[fieldName].errors = errors[fieldName];
							validationModel[fieldName].isModified = true;
						}
					});
					scope.setState({
						validationSummary,
						validationModel
					});

					defer.reject();
				}
			}
			defer.resolve();
			return defer;
		};
		
		scope.getQuery = function () {
			const query = {};
			Object.keys(validationModel).forEach((key) => {
				let val;
				if (typeof(validationModel[key]) === 'function') {
					val = validationModel[key]();
				} else {
					val = validationModel[key];
				}
				if (typeof (val) === 'string') {
					val = val.trim();
				}
				query[key] = val;
			});
			return query;
		}
		states.model = validationModel;
		Object.keys(model).forEach((key) => {
			const observableField = validation.observable(model[key]);
			
			observableField.set = (val)=>{
				const newState = {
					validationSummary: [],
					validationModel
				};
				observableField(val);
				scope.setState(newState);
			}
			validationModel[key] = observableField;
		});
	}
};

export default new form();