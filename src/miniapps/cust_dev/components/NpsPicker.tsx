
interface NpsPickerProps {
  value?: number;
  onChange: (value: number) => void;
}

export function NpsPicker({ value, onChange }: NpsPickerProps) {
  const nums = Array.from({ length: 11 }, (_, i) => i);
  
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-11 gap-1">
        {nums.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`custdev-nps-button px-2 py-2 rounded-lg border text-sm ${
              value === n ? "selected" : ""
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs opacity-70">
        <span>не порекомендую</span>
        <span>вполне вероятно</span>
      </div>
    </div>
  );
}
