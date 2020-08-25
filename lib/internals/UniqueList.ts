/**
 * Container for generic typed elements. It stores objects with unique key identifier which can be
 * defined during instantiation.
 * @internal
 */
export class UniqueList<T> {
	private list: T[];

	constructor(private uniqeuKey: string) {}

	/**
	 * Retrieves element in list with comparing unique value.
	 * @param uniqueValue value to be searched
	 */
	public get(uniqueValue: any): T {
		return this.find(uniqueValue);
	}

	/**
	 * Retrieves all elements in list.
	 */
	public getAll(): T[] {
		return this.list || [];
	}

	/**
	 * Checks the unique property's value is in list or not.
	 * @param uniqueValue value to be searched
	 */
	public has(uniqueValue: any): boolean {
		return this.findIndex(uniqueValue) >= 0;
	}

	/**
	 * Adds element to the list if it is not already in list,
	 * otherwise updates the properties of existing one.
	 * @param element element to be added
	 */
	public add(element: T): this {
		return this.has(element[this.uniqeuKey]) ? this.update(element) : this.push(element);
	}

	/**
	 * Inserts element to the list.
	 * @param element element to be pushed
	 */
	public push(element: T): this {
		if (!Array.isArray(this.list)) this.list = [];
		this.list.push(element);
		return this;
	}

	/**
	 * Updates element with coping the values if it is already exists.
	 * @param property config
	 */
	public update(element: T): this {
		const foundAt = this.findIndex(element[this.uniqeuKey]);
		if (foundAt >= 0) {
			Object.entries(element)
				.filter(([, value]) => value)
				.filter(([, value]) => !(value instanceof UniqueList))
				.filter(([, value]) => (Array.isArray(value) ? value.length : true))
				.forEach(([key, value]) => (this.list[foundAt][key] = value));
		}
		return this;
	}

	/**
	 * Retrieves element in list with comparing unique value.
	 * @param uniqueValue value to be searched
	 */
	public find(uniqueValue: any): T {
		return (this.list || []).find(e => this.uniqeuKey in e && e[this.uniqeuKey] === uniqueValue);
	}

	/**
	 * Retrieves element index in list with comparing unique value.
	 * @param uniqueValue value to be searched
	 */
	public findIndex(uniqueValue: any): number {
		return (this.list || []).findIndex(e => this.uniqeuKey in e && e[this.uniqeuKey] === uniqueValue);
	}
}
