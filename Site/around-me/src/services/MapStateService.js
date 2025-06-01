class MapStateService {
  constructor() {
    this._center = null;
    this._markers = [];
    this._listeners = [];
  }

  // Установить центр карты
  setCenter(center) {
    this._center = center;
    this._notify();
  }

  // Получить текущий центр карты
  getCenter() {
    return this._center;
  }

  // Установить массив маркеров
  setMarkers(markers) {
    this._markers = markers;
    this._notify();
  }

  // Добавить маркер
  addMarker(marker) {
    this._markers.push(marker);
    this._notify();
  }

  // Получить все маркеры
  getMarkers() {
    return this._markers;
  }

  // Подписка на изменения (для реактивности)
  subscribe(listener) {
    this._listeners.push(listener);
    return () => {
      this._listeners = this._listeners.filter(l => l !== listener);
    };
  }

  _notify() {
    this._listeners.forEach(listener => listener({
      center: this._center,
      markers: this._markers
    }));
  }
}

export default new MapStateService();