import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

const AddPlaceModal = ({ show, onHide, onSave, newPlace, setNewPlace }) => {
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

  return (
    <Modal show={show} onHide={onHide} fullscreen>
      <Modal.Header closeButton>
        <Modal.Title>Редагувати заклад</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: '#f8f9fa' }}>
        <Row>
          <Col md={5}>
            <Form.Label className="fw-bold">Фото закладу</Form.Label>

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
              <p className="mb-2 text-muted">Перетягніть фото сюди або виберіть файли вручну</p>
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
    onClick={() => alert('Тут буде статистика :)')}
  >
    Показати статистику
  </Button>
</div>


          </Col>

          <Col md={7}>
            <div className="p-4 bg-white rounded-3 shadow-sm">
              <Form.Group className="mb-3">
                <Form.Label>Назва</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={newPlace.title}
                  onChange={handleChange}
                  placeholder="Назва"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Адреса</Form.Label>
                <Form.Control
                  type="text"
                  name="locationText"
                  value={newPlace.locationText}
                  onChange={handleChange}
                  placeholder="Адреса"
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
                      placeholder="example@gmail.com"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Номер телефону</Form.Label>
                    <Form.Control
                      type="text"
                      name="phone"
                      value={newPlace.phone || ''}
                      onChange={handleChange}
                      placeholder=" "
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Графік роботи</Form.Label>
                <Form.Control
                  type="text"
                  name="schedule"
                  value={newPlace.schedule || ''}
                  onChange={handleChange}
                  placeholder="Графік роботи"
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Опис</Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  rows={4}
                  value={newPlace.description || ''}
                  onChange={handleChange}
                  placeholder="Ресторан французької кухні, витончені деталі, класичні страви..."
                />
              </Form.Group>
            </div>
          </Col>
        </Row>

        <hr className="my-4" />

        <Row className="bg-white p-4 mt-3 rounded-3 shadow-sm">
          <Col md={6}>
            <h6 className="fw-bold mb-3">Фільтри для показу реклами</h6>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Відображати у таких категоріях</Form.Label>
              <div className="d-flex flex-column">
                {['Ресторани', 'Кафе', 'Магазини', 'Банки', 'Туризм'].map((category) => (
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
              <Form.Label className="fw-semibold">Радіус</Form.Label>
              <div>
                {['1 км', '1-5 км', '10 км або більше'].map((radius) => (
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
            <h6 className="fw-bold mb-3">Баланс реклами</h6>

            <Form.Group className="mb-3">
              <Form.Label>Зараз на рахунку</Form.Label>
              <Form.Control type="number" value={newPlace.adBalance || 1000} disabled />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Додати</Form.Label>
              <Form.Control
                type="number"
                name="adAddAmount"
                value={newPlace.adAddAmount || 0}
                onChange={(e) =>
                  setNewPlace((prev) => ({ ...prev, adAddAmount: e.target.value }))
                }
              />
            </Form.Group>

            <Button variant="success">Сплатити</Button>
          </Col>
        </Row>
      </Modal.Body>
     <Modal.Footer className="justify-content-between bg-white">
  <Button
    variant="secondary"
    style={{ backgroundColor: '#ccc', borderColor: '#ccc', color: '#000' }}
    onClick={onHide}
  >
    Відхилити зміни
  </Button>
  <Button
    style={{ backgroundColor: '#626FC2', borderColor: '#626FC2' }}
    onClick={onSave}
  >
    Зберегти зміни
  </Button>
</Modal.Footer>

    </Modal>
  );
};

export default AddPlaceModal;
