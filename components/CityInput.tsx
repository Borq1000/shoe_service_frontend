import React from "react";

interface CityInputProps {
  value: string;
  onChange: (value: string) => void;
}

const CityInput: React.FC<CityInputProps> = ({ value, onChange }) => {
  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Введите город"
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
      />
    </div>
  );
};

export default CityInput;
