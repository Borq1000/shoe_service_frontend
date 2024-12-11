"use client";

import { useSession } from "next-auth/react";
import { updateProfile } from "@/actions/updateProfile";
import { useState, useEffect } from "react";
import InputMask from "react-input-mask";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Инициализируем состояние формы с пустыми полями
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
  });

  // Загружаем данные из сессии
  useEffect(() => {
    if (session?.user) {
      setFormData({
        first_name: session.user.first_name || "",
        last_name: session.user.last_name || "",
        phone: session.user.phone || "",
      });
    }
  }, [session]);

  // Функция для обработки изменений в полях формы
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Функция для отправки данных формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      setSuccessMessage("Профиль успешно обновлен");
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage("Не удалось обновить профиль. Попробуйте снова.");
      setSuccessMessage(null);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Настройки профиля</h1>

      {successMessage && (
        <div className="bg-green-50 text-green-800 p-4 rounded-lg mb-4">
          {successMessage}{" "}
          <a href="/account/profile" className="text-blue-600 underline">
            Перейти к профилю
          </a>
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-50 text-red-800 p-4 rounded-lg mb-4">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="first_name" className="block text-lg">
            Имя
          </label>
          <input
            type="text"
            name="first_name"
            id="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="last_name" className="block text-lg">
            Фамилия
          </label>
          <input
            type="text"
            name="last_name"
            id="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-lg">
            Телефон
          </label>
          <InputMask
            mask="+7(999) 999-99-99"
            type="tel"
            name="phone"
            id="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="px-5 py-3 bg-custom-red text-white rounded-full hover:bg-red-600"
        >
          Сохранить изменения
        </button>
      </form>
    </div>
  );
}
