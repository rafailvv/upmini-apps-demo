
interface RatingPickerProps {
  value?: number;
  onChange: (value: number) => void;
}

export function RatingPicker({ value, onChange }: RatingPickerProps) {
  const stars = [1, 2, 3, 4, 5];
  
  return (
    <div className="flex items-center gap-2">
      {stars.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          className={`custdev-rating-star p-2 rounded-xl border ${
            value && value >= s ? "selected" : ""
          }`}
        >
          {s}★
        </button>
      ))}
    </div>
  );
}
