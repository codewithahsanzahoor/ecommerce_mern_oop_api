class ApiFeatures {
	constructor(public query: any, public queryString: any) {
		this.query = query;
		this.queryString = queryString;
	}

	// implementing search functionality
	search() {
		const keyword = this.queryString.keyword
			? {
					name: {
						$regex: this.queryString.keyword,
						$options: "i",
					},
			  }
			: {};

		// console.log(keyword);

		this.query = this.query.find({ ...keyword });
		return this;
	}

	// implementing filter
	filter() {
		const queryCopy = { ...this.queryString };
		const removeFields = ["keyword", "page", "limit"];
		removeFields.forEach((el) => delete queryCopy[el]);

		// filter for price and rating
		let queryStr = JSON.stringify(queryCopy);
		queryStr = queryStr.replace(
			/\b(gt|gte|lt|lte|in)\b/g,
			(match) => `$${match}`
		);

		// console.log(queryStr);

		this.query = this.query.find(JSON.parse(queryStr));
		return this;
	}

	// implementing pagination
	pagination(limit: number) {
		const currentPage = Number(this.queryString.page) || 1;
		const skip = limit * (currentPage - 1);
		this.query = this.query.limit(limit).skip(skip);
		return this;
	}
}

export default ApiFeatures;
