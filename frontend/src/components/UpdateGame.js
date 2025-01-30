import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, Button, Container, Row, Col, Spinner, Pagination } from "react-bootstrap";
import GameSearch from "./GameSearch";

export default function OnlineGameList() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchGames();
  }, [page]);

  const fetchGames = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`http://localhost:3000/updategame?page=${page}`);
      setGames(data);
    } catch (error) {
      console.error("Failed to fetch online games", error);
    }
    setLoading(false);
  };

  const extractSlug = (url) => {
    const parts = url.split("/");
    return parts[parts.length - 2];
  };

  return (
    <div className="min-vh-100 bg-dark text-white d-flex flex-column">
      <Container className="text-center mt-5">
        <img 
          src="https://mystickermania.com/cdn/stickers/cute-cats/cute-black-cat-pixel-512x512.png" 
          alt="Online Games Icon" 
          className="img-fluid mb-4" 
          width="256" 
          height="256" 
        />
      
        <GameSearch search={search} setSearch={setSearch} />
      </Container>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center flex-grow-1">
          <Spinner animation="border" variant="info" />
          <span className="ml-2 text-white">Loading...</span>
        </div>
      ) : (
        <Container className="mt-4 flex-grow-1">
          <Row className="g-4">
            {games.filter((game) => game.title.toLowerCase().includes(search.toLowerCase())).map((game, index) => (
              <Col xs={12} sm={6} md={4} key={index} className="d-flex">
                <Card className="bg-dark text-white shadow-lg border-0 flex-grow-1">
                  <Card.Img 
                    variant="top" 
                    src={game.image} 
                    alt={game.title} 
                    className="rounded" 
                    style={{ height: "200px", objectFit: "cover" }} 
                  />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="fs-5">{game.title}</Card.Title>
                    <Card.Text>{game.releaseDate || "Release Date Unavailable"}</Card.Text>
                    <Button
                      variant="outline-light"
                      onClick={() => navigate(`/game/${extractSlug(game.link)}`)}
                      className="mt-auto w-100"
                    >
                      View Details
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      )}

      {/* Pagination */}
      <Container className="d-flex justify-content-center mt-4 pb-4">
        <Pagination>
          <Pagination.Prev onClick={() => setPage(page - 1)} disabled={page === 1} />
          <Pagination.Item>{page}</Pagination.Item>
          <Pagination.Next onClick={() => setPage(page + 1)} />
        </Pagination>
      </Container>
    </div>
  );
}
