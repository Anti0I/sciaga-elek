import React, { useState, useEffect } from "react";
import "./App.css"

const App = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:2317/notes")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setNotes(data);
        setError("");
      })
      .catch((error) => {
        console.error("Error fetching notes:", error);
        setError("Nie udało się załadować listy notatek.");
      });
  }, []);

  const fetchNoteContent = (filename) => {
    fetch(`http://localhost:2317/notes/${filename}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setSelectedNote(data.content);
        setError("");
      })
      .catch((error) => {
        console.error("Error fetching note content:", error);
        setError("Nie udało się załadować notatki.");
      });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Notatki z lekcji</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div style={{ display: "flex" }}>
        <ul style={{ marginRight: "20px", listStyleType: "none", padding: 0 }}>
          {notes.map((note) => (
            <li
              key={note}
              onClick={() => fetchNoteContent(note)}
              style={{
                cursor: "pointer",
                padding: "5px 10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                marginBottom: "5px",
              }}
            >
              {note}
            </li>
          ))}
        </ul>
        <div style={{ flex: 1, border: "1px solid #ccc", padding: "10px" }}>
          {selectedNote ? (
            <div
              dangerouslySetInnerHTML={{
                __html: selectedNote,
              }}
            />
          ) : (
            <p>Wybierz notatkę z listy.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
