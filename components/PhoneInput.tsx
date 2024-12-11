"use client";

import InputMask from "react-input-mask";

interface PhoneInputProps {
  name: string;
  id: string;
}

const PhoneInput: React.FC<PhoneInputProps> = ({ name, id }) => {
  return (
    <InputMask
      mask="+7 (999) 999-99-99"
      maskChar={null}
      name={name}
      id={id}
      placeholder="+7 (___) ___-__-__"
      className="w-full px-3 py-2 border rounded"
    />
  );
};

export default PhoneInput;
