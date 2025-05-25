
class Place {
  constructor({
    id,
    title,
    locationText,
    description,
    rating = 0,
    distance,
    images = [],
    email,
    phone,
    schedule,
    coordinates = { latitude: 0, longitude: 0 },
    reviews = [],
    website,
    priceLevel
  }) {
    this.id = id;
    this.title = title;
    this.locationText = locationText;
    this.description = description;
    this.rating = rating;
    this.distance = distance;
    this.images = images;
    this.email = email;
    this.phone = phone;
    this.schedule = schedule;
    this.coordinates = coordinates;
    this.reviews = reviews;
    this.website = website;
    this.priceLevel = priceLevel;
  }
}

export { Place }; 