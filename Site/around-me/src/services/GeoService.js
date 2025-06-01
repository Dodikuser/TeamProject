class GeoService {
    /**
     * Получить текущие координаты пользователя.
     * @returns {Promise<{ lat: number, lng: number }>}
     */
    static getCurrentPosition(options = { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }) {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Геолокация не поддерживается вашим браузером'));
          return;
        }
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          (error) => {
            switch (error.code) {
              case error.PERMISSION_DENIED:
                reject(new Error('Доступ к геолокации запрещён пользователем'));
                break;
              case error.POSITION_UNAVAILABLE:
                reject(new Error('Информация о местоположении недоступна'));
                break;
              case error.TIMEOUT:
                reject(new Error('Время ожидания геолокации истекло'));
                break;
              default:
                reject(new Error('Ошибка определения местоположения'));
            }
          },
          options
        );
      });
    }
}

export default GeoService;