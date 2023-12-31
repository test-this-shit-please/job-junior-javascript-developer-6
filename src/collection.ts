/**
 * This class helping to use regular javascript array same way as mongo collection
 */
export class Collection {
	data: any

	constructor(data: any = []) {
		this.data = data
	}

	async find(query: any = {}, options: any = {}): Promise<any[]> {
		const filterFn = (entry: any): boolean => {
			return true
		}
		return this.data.filter(filterFn)
	}
}
