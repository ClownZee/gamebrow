import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import { Container, Row, Col, Card, Button, ListGroup, Alert, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

export default function GameDetail() {
  const { slug } = useParams();
  const [gameDetails, setGameDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    if (slug) {
      fetchGameDetails();
    }
  }, [slug]);

  const fetchGameDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get(`http://localhost:3000/download?slug=${slug}`);
      setGameDetails(data);
    } catch (error) {
      setError("Failed to fetch game details. Please try again later.");
      console.error("Failed to fetch game details", error);
    }
    setLoading(false);
  };

  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-dark text-light">
        <Spinner animation="border" variant="light" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-dark text-light">
        <Alert variant="danger" className="text-center">{error}</Alert>
      </div>
    );
  }

  if (!gameDetails) {
    return <p className="text-center text-light">Game details not found.</p>;
  }

  return (
    <div className="bg-dark text-light min-vh-100 py-4">
      <Container className="bg-dark text-light p-3 rounded" style={{ maxWidth: "900px" }}>
        <Card className="shadow-lg bg-dark text-light border-0">
          <Card.Body>
            <Row>
              <Col md={6} className="text-center">
                <Card.Img
                  variant="top"
                  src={gameDetails.image}
                  alt={gameDetails.title}
                  className="mb-3 img-fluid rounded"
                  style={{ objectFit: "cover", maxHeight: "300px" }}
                />
              </Col>
              <Col md={6}>
                <Card.Title>{gameDetails.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Release Date: {gameDetails.releaseDate}</Card.Subtitle>
                <Card.Text>
                  <strong>Developer:</strong> {gameDetails.developer}
                  <br />
                  <strong>Publisher:</strong> {gameDetails.publisher}
                  <br />
                  <strong>Genre:</strong> {gameDetails.genre}
                  <br />
                  <strong>Reviews:</strong> {gameDetails.reviews}
                  <br />
                  <strong>Description:</strong> {gameDetails.description}
                  <br />
                  <strong>Installation Guide:</strong>
                  <br />
                  {gameDetails.installationGuide && Array.isArray(gameDetails.installationGuide) ? (
                    gameDetails.installationGuide[0].split('\n').map((line, index) => (
                      <div key={index}>{line}</div>
                    ))
                  ) : (
                    "No installation guide available"
                  )}
                </Card.Text>
                <Button href={gameDetails.downloadLink} target="_blank" variant="success" size="lg" className="mt-3 w-100">
                  Download Now
                </Button>
              </Col>
            </Row>

            {gameDetails.systemRequirements && gameDetails.systemRequirements.length > 0 && (
              <div className="mt-4">
                <h5>System Requirements:</h5>
                <ListGroup>
                  {gameDetails.systemRequirements.map((req, index) => (
                    <ListGroup.Item key={index} className="bg-dark text-light border-light">{req}</ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            )}

            {gameDetails.screenshots && gameDetails.screenshots.length > 0 && (
              <div className="mt-4">
                <h5>Screenshots:</h5>
                <Row>
                  {gameDetails.screenshots.map((src, index) => (
                    <Col key={index} xs={12} sm={6} md={4} className="mb-3">
                      <Card.Img src={src} alt={`Screenshot ${index + 1}`} className="img-fluid rounded" />
                    </Col>
                  ))}
                </Row>
              </div>
            )}

            {gameDetails.generalNote && (
              <div className="mt-4">
                <h5>General Note:</h5>
                <Card.Text dangerouslySetInnerHTML={{ __html: gameDetails.generalNote.replace(/\n/g, "<br />") }} />
              </div>
            )}

            {gameDetails.howToInstall && (
              <div className="mt-4">
                <h5>How to Install:</h5>
                <Card.Text dangerouslySetInnerHTML={{ __html: gameDetails.howToInstall.replace(/\n/g, "<br />") }} />
              </div>
            )}

            {gameDetails.howToPlayOnline && (
              <div className="mt-4">
                <h5>How to Play Online:</h5>
                <Card.Text dangerouslySetInnerHTML={{ __html: gameDetails.howToPlayOnline.replace(/\n/g, "<br />") }} />
              </div>
            )}

            {gameDetails.trailer && (
              <div className="mt-4">
                <h5>Trailer:</h5>
                <video controls className="w-100 rounded">
                  <source src={gameDetails.trailer} type="video/webm" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}

          </Card.Body>
        </Card>
      </Container>

      {/* Back Button */}
      <Button 
        variant="outline-light" 
        className="position-fixed bottom-0 end-0 m-3" 
        onClick={handleBack}
      >
        Back
      </Button>
    </div>
  );
}
