import React, { useState, useEffect } from "react";
import "./Homepage.css";

const Homepage = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [notes, setNotes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupColor, setNewGroupColor] = useState("#000000");
  const [newNote, setNewNote] = useState("");

  // Load groups and notes from localStorage on component mount
  useEffect(() => {
    const storedGroups = JSON.parse(localStorage.getItem("groups")) || [];
    const storedNotes = JSON.parse(localStorage.getItem("notes")) || [];

    console.log("Loaded from localStorage - Groups:", storedGroups);
    console.log("Loaded from localStorage - Notes:", storedNotes);

    setGroups(storedGroups);
    setNotes(storedNotes);
  }, []);

  // Save groups and notes to localStorage whenever they change
  useEffect(() => {
    console.log("Saving to localStorage - Groups:", groups);
    console.log("Saving to localStorage - Notes:", notes);

    localStorage.setItem("groups", JSON.stringify(groups));
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [groups, notes]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleAddGroup = () => {
    if (newGroupName.trim() === "") return; // Prevent empty group names

    const newGroup = {
      id: Date.now(),
      name: newGroupName,
      color: newGroupColor,
    };

    setGroups((prevGroups) => {
      const updatedGroups = [...prevGroups, newGroup];
      console.log("Updated groups:", updatedGroups); // Log the updated groups
      return updatedGroups;
    });

    setNewGroupName("");
    setNewGroupColor("#000000");
    closeModal();
  };

  const handleSelectGroup = (groupId) => {
    setSelectedGroup(groupId);
  };

  const handleAddNote = () => {
    if (selectedGroup && newNote.trim()) {
      const note = {
        id: Date.now(),
        groupId: selectedGroup,
        text: newNote,
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString(),
      };

      setNotes((prevNotes) => {
        const updatedNotes = [...prevNotes, note];
        console.log("Updated notes:", updatedNotes); // Log the updated notes
        return updatedNotes;
      });

      setNewNote("");
    }
  };

  const filteredNotes = notes.filter((note) => note.groupId === selectedGroup);

  return (
    <div className="main-box">
      {/* Left Box - Group List */}
      <div className="left-box">
        <p className="heading-notes">Pocket Notes</p>
        <div className="add-icon" onClick={openModal}>
          <img src="/add_icon.png" alt="Add Group Icon" />
        </div>
        <div className="group-list">
          {groups.map((group) => (
            <div
              key={group.id}
              className={`group-item ${
                selectedGroup === group.id ? "active" : ""
              }`}
              onClick={() => handleSelectGroup(group.id)}
            >
              <span
                className="group-logo"
                style={{ backgroundColor: group.color }}
              >
                {group.name
                  .split(" ")
                  .map((word) => word[0].toUpperCase())
                  .join("")}
              </span>
              <span className="group-name">{group.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Box - Notes Display */}
      <div className="right-box">
        {!selectedGroup ? (
          <div className="right-box-content">
            <div className="wall">
              <img src="./wall.png" alt="" />
            </div>

            <p className="heading-notes">Pocket Notes</p>
            <p className="heading-message">
              Send and receive messages without keeping your phone online.
            </p>
            <br />
            <p className="heading-message">
              Use Pocket Notes on up to 4 linked devices and 1 mobile phone.
            </p>
            <div className="end-box">
              <div className="end-to-end">
                <img src="./Vector (1).png" alt="" />
                <p>end-to-end encrypted</p>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="group-heading">
              {/* Group Logo */}
              <div
                className="group-logo"
                style={{
                  backgroundColor: groups.find((g) => g.id === selectedGroup)
                    ?.color,
                }}
              >
                {groups.find((g) => g.id === selectedGroup)?.name.charAt(0)}
              </div>
              {/* Group Name */}
              <div>{groups.find((g) => g.id === selectedGroup)?.name}</div>
            </div>

            {/* Notes Container */}
            <div className="notes-container">
              {filteredNotes.map((note) => (
                <div key={note.id} className="note-item">
                  <p>{note.text}</p>
                  <small>Created: {note.createdAt}</small>
                  <small>Updated: {note.updatedAt}</small>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="note-input">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
                placeholder="Type your note here..."
              />
              <img
                src="./Vector (2).png"
                alt="Send Button"
                className="send-btn"
                onClick={handleAddNote}
              />
            </div>
          </div>
        )}
      </div>

      {/* Modal for Adding a New Group */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-heading">Create New Group</h2>
            <div className="input-group">
              <label htmlFor="groupName">Group Name</label>
              <input
                type="text"
                id="groupName"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Group Name"
                className="modal-input"
              />
            </div>
            <div className="input-group">
              <label>Choose Colour:</label>
              <div className="color-options">
                {[
                  "#B38BFA",
                  "#FF79F2",
                  "#43E6FC",
                  "#F19576",
                  "#0047FF",
                  "#6691FF",
                ].map((color) => (
                  <div
                    key={color}
                    className={`color-swatch ${
                      newGroupColor === color ? "selected" : ""
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setNewGroupColor(color)}
                  ></div>
                ))}
              </div>
            </div>
            <div className="btn-box">
              <button onClick={handleAddGroup} className="btn-group">
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Homepage;
