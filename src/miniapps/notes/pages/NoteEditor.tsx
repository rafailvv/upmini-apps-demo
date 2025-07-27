import React, { useState } from 'react';
import '../styles.css';

export const NoteEditor: React.FC = () => {
  const [note, setNote] = useState({
    title: '',
    content: '',
    isFavorite: false,
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    if (note.title.trim() || note.content.trim()) {
      // В реальном приложении здесь будет сохранение в базу данных
      console.log('Сохранение заметки:', note);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setNote({ title: '', content: '', isFavorite: false });
    setIsEditing(false);
  };

  const toggleFavorite = () => {
    setNote(prev => ({ ...prev, isFavorite: !prev.isFavorite }));
  };

  return (
    <div className="note-editor">
      <div className="editor-header">
        <h2>Редактор заметок</h2>
        <div className="editor-actions">
          <button
            onClick={toggleFavorite}
            className={`favorite-btn ${note.isFavorite ? 'active' : ''}`}
          >
            ⭐
          </button>
          {isEditing ? (
            <>
              <button onClick={handleSave} className="save-btn">
                Сохранить
              </button>
              <button onClick={handleCancel} className="cancel-btn">
                Отмена
              </button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className="edit-btn">
              Создать заметку
            </button>
          )}
        </div>
      </div>

      <div className="editor-content">
        <div className="input-group">
          <label htmlFor="note-title">Заголовок</label>
          <input
            id="note-title"
            type="text"
            placeholder="Введите заголовок заметки..."
            value={note.title}
            onChange={(e) => setNote(prev => ({ ...prev, title: e.target.value }))}
            disabled={!isEditing}
            className="title-input"
          />
        </div>

        <div className="input-group">
          <label htmlFor="note-content">Содержание</label>
          <textarea
            id="note-content"
            placeholder="Введите содержание заметки..."
            value={note.content}
            onChange={(e) => setNote(prev => ({ ...prev, content: e.target.value }))}
            disabled={!isEditing}
            className="content-textarea"
            rows={10}
          />
        </div>
      </div>

      {isEditing && (
        <div className="editor-tools">
          <div className="toolbar">
            <button className="tool-btn" title="Жирный">B</button>
            <button className="tool-btn" title="Курсив">I</button>
            <button className="tool-btn" title="Подчеркнутый">U</button>
            <button className="tool-btn" title="Список">•</button>
            <button className="tool-btn" title="Нумерованный список">1.</button>
          </div>
          
          <div className="word-count">
            Символов: {note.content.length}
            {note.content.length > 0 && (
              <span> | Слов: {note.content.split(/\s+/).filter(word => word.length > 0).length}</span>
            )}
          </div>
        </div>
      )}

      <div className="editor-preview">
        <h3>Предварительный просмотр</h3>
        <div className="preview-content">
          {note.title && <h4>{note.title}</h4>}
          {note.content ? (
            <div className="preview-text">
              {note.content.split('\n').map((line, index) => (
                <p key={index}>{line || '\u00A0'}</p>
              ))}
            </div>
          ) : (
            <p className="preview-placeholder">
              Начните писать, чтобы увидеть предварительный просмотр...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}; 