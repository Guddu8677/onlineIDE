// components/FileExplorer.js
import React, { useState } from 'react';

const FileExplorer = ({ files, activeFile, onFileSelect, onFileCreate, onFileDelete }) => {
  const [newFileName, setNewFileName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateClick = () => {
    setIsCreating(true);
  };

  const handleFileNameChange = (e) => {
    setNewFileName(e.target.value);
  };

  const handleFileNameSubmit = (e) => {
    e.preventDefault();
    if (newFileName.trim()) {
      onFileCreate(newFileName);
      setNewFileName('');
      setIsCreating(false);
    }
  };

  const handleCancelCreate = () => {
    setIsCreating(false);
    setNewFileName('');
  };

  const handleDeleteClick = (filename) => {
    if (window.confirm(`Are you sure you want to delete ${filename}?`)) {
      onFileDelete(filename);
    }
  };

  return (
    <div className="file-explorer">
      <h3>Files</h3>
      <ul className="file-list">
        {Object.keys(files).map((filename) => (
          <li
            key={filename}
            className={filename === activeFile ? 'active' : ''}
            onClick={() => onFileSelect(filename)}
          >
            {filename}
            <button onClick={(e) => {
              e.stopPropagation(); // Prevent file selection when deleting
              handleDeleteClick(filename);
            }}>Delete</button>
          </li>
        ))}
      </ul>

      {!isCreating ? (
        <button onClick={handleCreateClick}>Create New File</button>
      ) : (
        <form onSubmit={handleFileNameSubmit}>
          <input
            type="text"
            value={newFileName}
            onChange={handleFileNameChange}
            placeholder="Enter file name"
          />
          <button type="submit">Create</button>
          <button type="button" onClick={handleCancelCreate}>Cancel</button>
        </form>
      )}
    </div>
  );
};

export default FileExplorer;