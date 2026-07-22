class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  search() {
    if (this.queryString.search) {
      this.query = this.query.find({
        $text: { $search: this.queryString.search }
      });
    }
    return this;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['search', 'page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Handle minPrice and maxPrice specifically
    if (queryObj.minPrice || queryObj.maxPrice) {
      queryObj.price = {};
      if (queryObj.minPrice) queryObj.price.$gte = queryObj.minPrice;
      if (queryObj.maxPrice) queryObj.price.$lte = queryObj.maxPrice;
      delete queryObj.minPrice;
      delete queryObj.maxPrice;
    }

    // Convert standard filtering formats (if needed for category etc)
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
