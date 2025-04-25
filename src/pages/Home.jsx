import React from "react";
import { Container, Carousel, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./Home.css"; // Optional: custom styles

const carouselItems = [
  {
    image: "https://image.freepik.com/free-vector/inventory_203633-729.jpg?w=2000",
    caption: "Manage your inventory like a pro with StockMart."
  },
  {
    image: "https://joinhorizons.com/wp-content/uploads/2022/07/How-is-PAYE-calculated-2048x1152.jpg",
    caption: "Smart billing and real-time stock tracking."
  },
  {
    image: "https://th.bing.com/th/id/OIP.yLR1zqsJJZz1z-PunRpGQwHaER?rs=1&pid=ImgDetMain",
    caption: "Streamline operations with StockMart's simplicity."
  }
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container fluid className="bg-light py-4">
      <Row className="justify-content-center">
        <Col xs={12} md={10}>
          <Carousel fade className="shadow rounded overflow-hidden">
            {carouselItems.map((item, index) => (
              <Carousel.Item key={index} className="position-relative">
                <img
                  src={item.image}
                  alt={`Slide ${index + 1}`}
                  className="d-block w-100 carousel-image"
                  style={{ height: "500px", objectFit: "cover" }}
                />
                <Carousel.Caption className="bg-dark bg-opacity-50 p-3 rounded">
                  <h3 className="text-white fw-bold">{item.caption}</h3>
                </Carousel.Caption>
              </Carousel.Item>
            ))}
          </Carousel>
        </Col>
      </Row>

      {/* Get Started Button */}
      <Row className="justify-content-center mt-4">
        <Col xs="auto">
          <Button variant="dark" size="lg" onClick={() => navigate("/login")}>
            Get Started
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
