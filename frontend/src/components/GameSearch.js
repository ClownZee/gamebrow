import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Form, Button, Card, Row, Col, Spinner, InputGroup, Navbar, Nav } from "react-bootstrap";

export default function GameSearch() {
  const [query, setQuery] = useState("");
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:3000/search?q=${query}`);
      setGames(response.data);
    } catch (err) {
      setError("Failed to fetch search results");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-dark text-white">
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand href="/">Game Search</Navbar.Brand>
          <Nav className="ml-auto">
            <Button variant="outline-light" onClick={() => navigate("/onlinegames")}>
              Online Games
            </Button>
          </Nav>
        </Container>
      </Navbar>

      <Container className="text-center mt-5">
        <Form onSubmit={handleSearch} className="mb-4">
          <InputGroup className="justify-content-center">
            <Form.Control
              type="search"
              placeholder="Search for games..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-50 text-center"
            />
            <Button variant="outline-light" type="submit">
              Search
            </Button>
          </InputGroup>
        </Form>
      </Container>

      {loading && (
        <div className="text-center">
          <Spinner animation="border" variant="info" />
        </div>
      )}
      {error && <p className="text-center text-danger">{error}</p>}

      <Row>
        {games.map((game, index) => (
          <Col sm={12} md={6} lg={4} key={index} className="mb-4">
            <Card className="bg-dark text-light rounded-lg shadow-lg border-0">
              <Card.Img
                variant="top"
                src={game.image}
                alt={game.title}
                className="rounded-top"
                style={{ height: "200px", objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title>{game.title}</Card.Title>
                <Card.Text>{game.releaseDate || "Release Date Unavailable"}</Card.Text>
                <Button
                  variant="outline-light"
                  onClick={() => navigate(`/game/${game.slug}`)}
                  className="w-100 mt-2"
                >
                  View Details
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
