import { useEffect, useState } from "react";
import api from "../../api/api"; // backend Axios instance
import "./BookmarksPage.css"; // Custom styling

export default function BookmarksPage() { // defining a react functional component and exporting it
  const [bookmarks, setBookmarks] = useState([]); // bookmarks holds the array of saved crimes from the backend
  const [editingNoteId, setEditingNoteId] = useState(null); // Which bookmark we're editing
  const [noteText, setNoteText] = useState(""); // The live text for editing

  useEffect(() => {
    // When the component loads, we fetch all the bookmarked crimes from the backend API
    api
      .get("/bookmarks")
      .then((res) => setBookmarks(res.data))
      .catch((err) =>
        console.error("There was an error fetching the bookmarks:", err)
      );
  }, []);

  const handleDelete = (id) => {
    // When a user clicks ‘Delete,’ we call the backend to delete that specific bookmark by its _id
    api
      .delete(`/bookmarks/${id}`)
      .then(() => {
        // After deleting, update the UI by removing the deleted item from state
        setBookmarks((prev) => prev.filter((b) => b._id !== id));
      })
      .catch((err) =>
        console.error("There was an error deleting the bookmark:", err)
      );
  };

  const handleSaveNote = (id) => {
    // Sends the PUT request to update just the note field
    api
      .put(`/bookmarks/${id}`, { notes: noteText })
      .then((res) => {
        // Update local state with the edited bookmark
        setBookmarks((prev) =>
          prev.map((b) => (b._id === id ? res.data : b))
        );
        setEditingNoteId(null);
        setNoteText("");
      })
      .catch((err) =>
        console.error("Error updating note:", err)
      );
  };

 return (
  // Main container for the saved bookmarks page
  <div className="bookmarks-container">
    <h1> 🔖 Saved Bookmarks</h1>

    {/* If there are no bookmarks yet, show a message */}
    {bookmarks.length === 0 ? (
      <p>No bookmarks yet.</p>
    ) : (
      // Otherwise, display the grid of bookmark cards
      <div className="bookmark-grid">
        {bookmarks.map((b) => (
          // Render a card for each bookmark
          <div key={b._id} className="bookmark-card">
            <h3>{b.ofnsDesc || "Unknown Offense"}</h3>
            <p><strong>Category:</strong> {b.lawCatCd || "N/A"}</p>
            <p><strong>Status:</strong> {b.crmAtptCptdCd || "N/A"}</p>
            <p>
              <strong>Location:</strong> {b.premTypDesc || "Unknown"} —{" "}
              {b.locOfOccurDesc || "N/A"}
            </p>
            <p><strong>Borough:</strong> {b.boroNm || "Unknown"}</p>
            <p><strong>Reported:</strong> {b.rptDt?.slice(0, 10) || "Unknown"}</p>

            {/* Optional fields shown only if present */}
            {b.stationName && (
              <p><strong>Nearby Station:</strong> {b.stationName}</p>
            )}
            {b.hadevelopt && (
              <p><strong>Housing Development:</strong> {b.hadevelopt}</p>
            )}

            {/* Victim and suspect demographics */}
            <p><strong>Victim:</strong> {b.vicSex || "Unknown"}, {b.vicAgeGroup || "N/A"}, {b.vicRace || "N/A"}</p>
            <p><strong>Suspect:</strong> {b.suspSex || "Unknown"}, {b.suspAgeGroup || "N/A"}, {b.suspRace || "N/A"}</p>

            {/* If this bookmark is in edit mode, show the textarea and Save/Cancel buttons */}
            {editingNoteId === b._id ? (
              <>
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  rows={3}
                  style={{ width: "100%", marginTop: "0.5rem" }}
                />
                <div className="edit-buttons">
                  {/* Save the updated note (calls PUT to backend) */}
                  <button onClick={() => handleSaveNote(b._id)}>💾 Save</button>

                  {/* Cancel editing */}
                  <button onClick={() => setEditingNoteId(null)}>❌ Cancel</button>
                </div>
              </>
            ) : (
              <>
                {/* Show existing note if not in edit mode */}
                <p><strong>Notes:</strong> {b.notes || "None"}</p>

                {/* Enter edit mode for this bookmark */}
                <button onClick={() => {
                  setEditingNoteId(b._id);
                  setNoteText(b.notes || "");
                }}>
                  ✏️ Edit Note
                </button>
              </>
            )}

            {/* Delete the bookmark (calls DELETE to backend) */}
            <button onClick={() => handleDelete(b._id)} style={{ marginTop: "0.5rem" }}>
              🗑️ Delete
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
);

}
