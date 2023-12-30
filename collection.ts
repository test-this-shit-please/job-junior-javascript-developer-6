/**
 * 
 */

export class Collection {
	data: any;
	constructor(data: any = []) {
		this.data = data;
	}

	async find(query: any = {}, options: any = {}) {
		const filterFn = (entry: any) => {
			return true;
		};
		return this.data.filter(filterFn);
	}
}