import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import StatisticsModal from './StatisticsModal';
import PlaceService from '../services/PlaceService';



const AddPlaceModal = ({ show, onHide, onSave, newPlace, setNewPlace }) => {
const [showStats, setShowStats] = useState(false);
  const { t } = useTranslation();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPlace(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    processImages(files);
  };

  const processImages = (files) => {
    const imageReaders = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imageReaders).then(images => {
      setNewPlace(prev => ({
        ...prev,
        images: [...(prev.images || []), ...images]
      }));
    });
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    processImages(files);
  };

  const handleImageRemove = (indexToRemove) => {
    setNewPlace(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== indexToRemove)
    }));
  };

  const handleSave = async () => {
    // Конвертация newPlace в PlaceDTOFull
    const placeDTO = {
      name: newPlace.title || '',
      description: newPlace.description || '',
      address: newPlace.locationText || '',
      site: newPlace.site || '',
      phoneNumber: newPlace.phone || '',
      email: newPlace.email || '',
      longitude: newPlace.longitude ? Number(newPlace.longitude) : 0,
      latitude: newPlace.latitude ? Number(newPlace.latitude) : 0,
      radius: newPlace.radius ? Number(newPlace.radius) : undefined,
      tokensAvailable: newPlace.tokensAvailable ? Number(newPlace.tokensAvailable) : undefined,
      lastPromotionDateTime: newPlace.lastPromotionDateTime || undefined,
      stars: newPlace.rating ? Number(newPlace.rating) : 0,
      openingHours: newPlace.openingHours || undefined,
      gmapsPlaceId: newPlace.gmapsPlaceId || '',
      userId: newPlace.userId || undefined,
      photos: [] // фото отправляем отдельно
    };
    // Формируем FormData для фото
    let photosFormData = null;
    if (newPlace.images && newPlace.images.length > 0) {
      photosFormData = new FormData();
      (newPlace.images).forEach((img, idx) => {
        // img может быть base64, преобразуем в Blob
        if (typeof img === 'string' && img.startsWith('data:')) {
          const arr = img.split(',');
          const mime = arr[0].match(/:(.*?);/)[1];
          const bstr = atob(arr[1]);
          let n = bstr.length;
          const u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          const file = new File([u8arr], `photo${idx}.jpg`, { type: mime });
          photosFormData.append('photos', file);
        }
      });
    }
    try {
      await PlaceService.updateMyPlace(placeDTO, photosFormData);
      if (onSave) onSave();
      if (onHide) onHide();
    } catch (err) {
      alert('Помилка при збереженні місця');
    }
  };

  return (
    <Modal show={show} onHide={onHide} fullscreen>
      <Modal.Header closeButton>
        <Modal.Title>{t('edit_place')}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: '#f8f9fa' }}>
        <Row>
          <Col md={5}>
            <Form.Label className="fw-bold">{t('place_photo')}</Form.Label>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleImageDrop}
              className="mb-3"
              style={{
                border: '2px dashed #ccc',
                borderRadius: '10px',
                padding: '20px',
                textAlign: 'center',
                backgroundColor: '#fff'
              }}
            >
              <p className="mb-2 text-muted">{t('drag_or_select_photo')}</p>
              <Form.Control type="file" multiple accept="image/*" onChange={handleImageUpload} />
            </div>

            <div className="d-flex flex-wrap gap-2">
              {(newPlace.images || []).map((img, index) => (
                <div key={index} style={{ position: 'relative' }}>
                  <img
                    src={img}
                    alt={`preview-${index}`}
                    className="rounded-3"
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                  />
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleImageRemove(index)}
                    style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      borderRadius: '50%',
                      padding: '2px 6px',
                      fontSize: '12px',
                    }}
                  >
                    &times;
                  </Button>
                </div>
              ))}
            </div>
           <div className="mt-3 text-center">
  <Button
    style={{ backgroundColor: '#626FC2', borderColor: '#626FC2' }}
    onClick={() => setShowStats(true)}
  >
    {t('show_statistics')}
  </Button>
</div>


          </Col>

          <Col md={7}>
            <div className="p-4 bg-white rounded-3 shadow-sm">
              <Form.Group className="mb-3">
                <Form.Label>{t('place_name')}</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={newPlace.title}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>{t('place_address')}</Form.Label>
                <Form.Control
                  type="text"
                  name="locationText"
                  value={newPlace.locationText}
                  onChange={handleChange}
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={newPlace.email || ''}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>{t('phone_number')}</Form.Label>
                    <Form.Control
                      type="text"
                      name="phone"
                      value={newPlace.phone || ''}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Сайт{t('work_schedule')}</Form.Label>
                <Form.Control
                  type="text"
                  name="site"
                  value={newPlace.site || ''}
                  onChange={handleChange}
                  
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Графік роботи</Form.Label>
                <Form.Control
                  type="text"
                  name="schedule"
                  value={newPlace.schedule || ''}
                  onChange={handleChange}
                  placeholder={t('work_schedule')}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>{t('description')}</Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  rows={4}
                  value={newPlace.description || ''}
                  onChange={handleChange}
                />
              </Form.Group>
            </div>
          </Col>
        </Row>

        <hr className="my-4" />

        <Row className="bg-white p-4 mt-3 rounded-3 shadow-sm">
          <Col md={6}>
            <h6 className="fw-bold mb-3">{t('ad_filters')}</h6>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">{t('show_in_categories')}</Form.Label>
              <div className="d-flex flex-column">
                {[t('category_restaurants'), t('category_cafes'), t('category_shops'), t('category_banks'), t('category_tourism')].map((category, idx) => (
                  <Form.Check
                    key={category}
                    type="checkbox"
                    label={category}
                    name="adCategories"
                    value={category}
                    checked={newPlace.adCategories?.includes(category) || false}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      const value = e.target.value;
                      setNewPlace((prev) => {
                        const current = prev.adCategories || [];
                        return {
                          ...prev,
                          adCategories: checked
                            ? [...current, value]
                            : current.filter((cat) => cat !== value),
                        };
                      });
                    }}
                    className="mb-1"
                  />
                ))}
              </div>
            </Form.Group>

            <Form.Group>
              <Form.Label className="fw-semibold">{t('ad_radius')}</Form.Label>
              <div>
                {[t('radius_1km'), t('radius_1_5km'), t('radius_10km_plus')].map((radius) => (
                  <Form.Check
                    key={radius}
                    type="radio"
                    label={radius}
                    name="adRadius"
                    value={radius}
                    checked={newPlace.adRadius === radius}
                    onChange={(e) =>
                      setNewPlace((prev) => ({ ...prev, adRadius: e.target.value }))
                    }
                    className="mb-1"
                  />
                ))}
              </div>
            </Form.Group>
          </Col>

          <Col md={6}>
            <h6 className="fw-bold mb-3">{t('ad_balance')}</h6>

            <Form.Group className="mb-3">
              <Form.Label>{t('current_balance')}</Form.Label>
              <Form.Control type="number" value={newPlace.adBalance || 1000} disabled />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>{t('add_amount')}</Form.Label>
              <Form.Control
                type="number"
                name="adAddAmount"
                value={newPlace.adAddAmount || 0}
                onChange={(e) =>
                  setNewPlace((prev) => ({ ...prev, adAddAmount: e.target.value }))
                }
              />
            </Form.Group>

            <Button variant="success">{t('pay')}</Button>
          </Col>
        </Row>
      </Modal.Body>
     <Modal.Footer className="justify-content-between bg-white">
  <Button
    variant="secondary"
    style={{ backgroundColor: '#ccc', borderColor: '#ccc', color: '#000' }}
    onClick={onHide}
  >
    {t('reject_changes')}
  </Button>
  <Button
    style={{ backgroundColor: '#626FC2', borderColor: '#626FC2' }}
    onClick={handleSave}
  >
    {t('save_changes')}
  </Button>
</Modal.Footer>
<StatisticsModal show={showStats} onHide={() => setShowStats(false)} />

    </Modal>
  );
};

export default AddPlaceModal;
