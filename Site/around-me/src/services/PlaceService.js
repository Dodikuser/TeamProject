import BaseService from './BaseService';

class PlaceService extends BaseService {
   

    /**
     * Преобразует данные места в формат для LocationCard и LocationModal
     * @param {Object} placeData - Данные места с API
     * @returns {Object} Трансформированные данные
     */
    transformPlaceData(placeData) {
        const photoValues = placeData.photos?.$values || [];
        console.error("!!!PHOTO VALUES!!!", photoValues);
        // Получаем src для фото: если есть photoId, используем /api/place/photo/{photoId}, иначе path
        const getPhotoSrc = (photo) => {
            if (photo?.id) {
                return `https://localhost:7103/api/place/photo/${photo.id}`;
            }
            return photo?.path || 'https://via.placeholder.com/300x180?text=No+Image';
        };
        let schedule = [];
        let openingHoursArr = [];
        try {
            if (Array.isArray(placeData.openingHours)) {
                openingHoursArr = placeData.openingHours;
            } else if (placeData.openingHours && Array.isArray(placeData.openingHours.$values)) {
                openingHoursArr = placeData.openingHours.$values;
            } else {
                openingHoursArr = [];
            }
            if (Array.isArray(placeData.openingHours) && placeData.openingHours.length > 0) {
                schedule = placeData.openingHours.map(hours => ({
                    day: hours.dayOfWeek,
                    hours: hours.isOpen ? `${hours.openTime} - ${hours.closeTime}` : 'Зачинено'
                }));
            } else {
                schedule = [];
            }
        } catch (err) {
            console.error('Ошибка сериализации расписания (openingHours):', err);
            schedule = [];
            openingHoursArr = [];
        }
        return {
            id: placeData.gmapsPlaceId,
            image: getPhotoSrc(photoValues[0]),
            images: photoValues.length > 0 ? photoValues.map(getPhotoSrc) : ['https://via.placeholder.com/300x180?text=No+Image'],
            title: placeData.name,
            location: placeData.address,
            locationText: placeData.address,
            rating: placeData.stars || 0,
            description: placeData.description || '',
            phone: placeData.phoneNumber,
            email: placeData.email,
            website: placeData.site,
            coordinates: {
                lat: placeData.latitude,
                lng: placeData.longitude
            },
            isOpen: placeData.isOpen,
            hours: placeData.isOpen ? 'Відчинено' : 'Зачинено',
            schedule,
            openingHours: openingHoursArr,
        };
    }

    /**
     * @param {string} placeId
     * @returns {Promise<Object>}
     */
    async getPlaceById(placeId) {
        try {
            const data = await this.makeRequest(`/Place/get/${placeId}`);
            return this.transformPlaceData(data);
        } catch (error) {
            console.error('Error fetching place details:', error);
            throw error;
        }
    }

    /**
     * @param {import('../Models/Place').NewPlaceRequest} placeData
     * @returns {Promise<import('../Models/Place').Place>}
     */
    async createPlace(placeData) {
        try {
            return await this.makeRequest('/Places/create', {
                method: 'POST',
                body: JSON.stringify(placeData)
            });
        } catch (error) {
            console.error('Error creating place:', error);
            throw error;
        }
    }

    /**
     * @param {string} placeId
     * @param {Partial<import('../Models/Place').Place>} updateData
     * @returns {Promise<import('../Models/Place').Place>}
     */
    async updatePlace(placeId, updateData) {
        try {
            return await this.makeRequest(`/Places/update/${placeId}`, {
                method: 'PUT',
                body: JSON.stringify(updateData)
            });
        } catch (error) {
            console.error('Error updating place:', error);
            throw error;
        }
    }

    /**
     * @param {string} placeId
     * @returns {Promise<import('../Models/Place').PlaceStatistics>}
     */
    async getPlaceStatistics(placeId) {
        try {
            return await this.makeRequest(`/Places/statistics/${placeId}`);
        } catch (error) {
            console.error('Error fetching place statistics:', error);
            throw error;
        }
    }

    /**
     * @param {string} placeId
     * @returns {Promise<void>}
     */
    async deletePlace(placeId) {
        try {
            await this.makeRequest(`/Places/delete/${placeId}`, {
                method: 'DELETE'
            });
        } catch (error) {
            console.error('Error deleting place:', error);
            throw error;
        }
    }

    /**
     * Обновить место пользователя (my) по полной DTO (PlaceDTOFull) и фото
     * @param {Object} placeDTOFull - объект PlaceDTOFull
     * @param {FormData} [photosFormData] - FormData с фото (опционально)
     * @returns {Promise<any>}
     */
    async updateMyPlace(placeDTOFull, photosFormData) {
        // Сначала отправляем основную DTO
        const dtoResponse = await this.makeRequest('/Place/my/update', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(placeDTOFull)
        });
        // Если есть фото, отправляем их отдельно (если API поддерживает)
        let photosResponse = null;
        if (photosFormData) {
            // Если API поддерживает загрузку фото отдельно, укажите нужный endpoint
            // const photosUrl = '/Place/my/upload-photos';
            // photosResponse = await this.makeRequest(photosUrl, {
            //     method: 'POST',
            //     body: photosFormData
            // });
        }
        return { dtoResponse, photosResponse };
    }

    /**
     * Обновить место по полной DTO (PlaceDTOFull) и фото (устаревший метод)
     * @deprecated Используйте updateMyPlace
     */
    async updatePlaceFull(placeId, placeDTOFull, photosFormData) {
        // Для обратной совместимости вызываем updateMyPlace
        return this.updateMyPlace(placeDTOFull, photosFormData);
    }
}

export default new PlaceService(); 