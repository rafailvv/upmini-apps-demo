
interface RatingPickerProps {
  value?: number;
  onChange: (value: number) => void;
}

export function RatingPicker({ value, onChange }: RatingPickerProps) {
  const stars = [1, 2, 3, 4, 5];
  
  return (
    <div className="custdev-rating-container">
      <div className="custdev-rating-labels">
        <span>Плохо</span>
        <span>Отлично</span>
      </div>
      <div className="custdev-rating-stars">
        {stars.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onChange(s)}
            className={`custdev-rating-star ${
              value && value >= s ? "selected" : ""
            }`}
          >
            <span className="custdev-rating-number">{s}</span>
            <span className="custdev-rating-icon">★</span>
          </button>
        ))}
      </div>
      {value && (
        <div className="custdev-rating-value">
          <span className="custdev-rating-value-text">{value}</span>
          <span className="custdev-rating-value-label">из 5</span>
        </div>
      )}
    </div>
  );
}
