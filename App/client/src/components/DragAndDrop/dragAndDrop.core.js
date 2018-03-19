export default class DragAndDrop {
	constructor() {
		this.subscribers = [];
	}
	subscribe(func){
		if (typeof(func)==='function') {
			this.subscribers.push(func);
		}
	};
	set(data) {
		this.subscribers.forEach((func)=>{
			func(data);
		})
	}
}

