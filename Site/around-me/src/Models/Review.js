class Review {
  constructor({
    id,
    placeId,
    userId,
    rating,
    text,
    dateCreated = new Date().toISOString(),
    dateModified = new Date().toISOString(),
    images = []
  }) {
    this.id = id;
    this.placeId = placeId;
    this.userId = userId;
    this.rating = rating;
    this.text = text;
    this.dateCreated = dateCreated;
    this.dateModified = dateModified;
    this.images = images;
  }
}

export { Review }; 