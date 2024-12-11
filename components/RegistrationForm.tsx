// app/components/RegistrationForm.tsx
"use client";

import { useState } from "react";

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    first_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      alert("Passwords do not match!");
      return;
    }

    // Запрос на регистрацию пользователя
    const registrationResponse = await fetch(
      "http://127.0.0.1:8000/authentication/register/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: formData.first_name,
          email: formData.email,
          password: formData.password,
          confirm_password: formData.confirm_password, // Добавление confirm_password в данные запроса
          user_type: "client", // Установка типа пользователя напрямую
        }),
      }
    );

    if (registrationResponse.ok) {
      alert("Registration successful!");
      setFormData({
        first_name: "",
        email: "",
        password: "",
        confirm_password: "",
      });
      window.location.href = "/login";
    } else {
      const errorResponse = await registrationResponse.json(); // Получение и вывод сообщения об ошибке
      alert(`Failed to register. ${errorResponse}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <input
        type="text"
        name="first_name"
        placeholder="First Name"
        value={formData.first_name}
        onChange={handleChange}
        required
        className="mb-4 border border-gray-300 rounded-md p-2"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
        className="mb-4 border border-gray-300 rounded-md p-2"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
        className="mb-4 border border-gray-300 rounded-md p-2"
      />
      <input
        type="password"
        name="confirm_password"
        placeholder="Confirm Password"
        value={formData.confirm_password}
        onChange={handleChange}
        required
        className="mb-4 border border-gray-300 rounded-md p-2"
      />
      <button
        className="bg-blue-400 text-white rounded-sm py-2 px-6"
        type="submit"
      >
        Sign Up
      </button>
    </form>
  );
}
