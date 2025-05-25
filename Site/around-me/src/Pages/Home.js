import React, {useEffect, useState} from 'react';
import { Container, Form, FormControl, Row, Col } from 'react-bootstrap';
import FilterOffcanvas from '../Components/FilterOffcanvas';
import SortOffcanvas from '../Components/SortOffcanvas';
import LocationModal from '../Components/LocationModal';
import PlaceService from '../services/PlaceService';

function Home() {
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to load place details from API
  const loadPlaceDetails = async (placeId) => {
    try {
      setLoading(true);
      setError(null);

      const data = await PlaceService.getPlaceById(placeId);
      setSelectedPlace(data);
      setShowModal(true);
    } catch (err) {
      console.error('Error loading place details:', err);
      setError(err.message);
    } finally {
      setLoading(false);
      // Clear the openPlace from localStorage after attempting to load
      localStorage.removeItem('openPlace');
    }
  };

  useEffect(() => {
    const placeId = localStorage.getItem("openPlace");
    if (placeId) {
      loadPlaceDetails(placeId);
    }
  }, []);

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (searchQuery.trim()) {
        alert(`Пошук по запиту: "${searchQuery}"`);
      } else {
        alert('Введіть запит');
      }
    }
  };

  return (
    <div className="bg-white py-3 px-4 mt-2">
      <Container fluid>
        <Form className="d-flex justify-content-start w-100 px-2">
          <div
            className="position-relative w-100"
            style={{ maxWidth: '20%' }}
          >
            <FormControl
             
              placeholder="Запит"
              className="bg-light border-0 rounded px-3 py-3"
              style={{ height: '80px', paddingRight: '45px' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
            <span
              className="material-symbols-outlined position-absolute"
              style={{
                bottom: '10px',
                right: '15px',
                color: '#6c757d',
                cursor: 'pointer',
              }}
              title="Мікрофон (не активний)"
            >
              mic
            </span>
          </div>
        </Form>

        <Row className="mt-3">
          <Col xs="auto">
            <button
              type="button"
              className="btn btn-outline-secondary d-flex align-items-center gap-2"
              onClick={() => setShowFilters(true)}
            >
              <span className="material-symbols-outlined">filter_list</span>
              Фільтри
            </button>
          </Col>
          <Col xs="auto">
            <button
              type="button"
              className="btn btn-outline-secondary d-flex align-items-center gap-2"
              onClick={() => setShowSort(true)}
            >
              <span className="material-symbols-outlined">sort</span>
              Сортувати
            </button>
          </Col>
        </Row>
      </Container>

      <FilterOffcanvas show={showFilters} onClose={() => setShowFilters(false)} />
      <SortOffcanvas show={showSort} onClose={() => setShowSort(false)} />
    </div>
  );
}

export default Home;
