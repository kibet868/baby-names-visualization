 import React, { useEffect, useState } from "react";
import "./FavoritesPage.css"; // Optional styling

function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You must be logged in to view favorites.");
      setLoading(false);
      return;
    }

    fetch(`${process.env.REACT_APP_API_URL}/api/favorites`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch favorites.");
        return res.json();
      })
      .then((data) => {
        setFavorites(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading favorites:", err.message);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>🔄 Loading favorites...</p>;
  if (error) return <p style={{ color: "red" }}>❌ {error}</p>;

  return (
    <div className="favorites-page">
      <h2>💖 Saved Favorite Names</h2>
      {favorites.length === 0 ? (
        <p>No favorites saved yet.</p>
      ) : (
        <ul className="favorites-list">
          {favorites.map((fav) => (
            <li key={fav.id}>
              <strong>{fav.name}</strong> — {fav.gender} — {fav.year}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FavoritesPage;
