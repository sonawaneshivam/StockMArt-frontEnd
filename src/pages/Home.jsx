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
              <Carousel.Item key={index}>
                <Row className="g-0 align-items-center">
                  {/* Left Side: Fixed Image */}
                  <Col xs={12} md={6} className="carousel-image-container">
                    <img
                      src={item.image}
                      alt={`Slide ${index + 1}`}
                      className="w-100 h-100 carousel-image"
                    />
                  </Col>

                  {/* Right Side: Quote with consistent background */}
                  <Col
                    xs={12} md={6}
                    className="d-flex justify-content-center align-items-center bg-white text-center px-4 py-4 fixed-bg"
                    style={{
                      height: "100%", // Full height of the column
                      borderTopRightRadius: "0.5rem",
                      borderBottomRightRadius: "0.5rem",
                    }}
                  >
                    <div>
                      <h3 className="text-dark fw-bold">{item.caption}</h3>
                    </div>
                  </Col>
                </Row>
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
