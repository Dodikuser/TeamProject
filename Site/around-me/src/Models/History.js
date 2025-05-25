class History {
  constructor({
    id,
    placeId,
    userId,
    visitDateTime = new Date().toISOString(),
    searchText,
    searchDateTime
  }) {
    this.id = id;
    this.placeId = placeId;
    this.userId = userId;
    this.visitDateTime = visitDateTime;
    this.searchText = searchText;
    this.searchDateTime = searchDateTime;
  }
}

export { History }; 