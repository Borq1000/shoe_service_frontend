"use client";

import axios from "axios";
import { useState, useEffect } from "react";

// Обновленный тип для услуги, включающий изображение
type Service = {
  id: number;
  name: string;
  description: string;
  image: string; // Путь к изображению услуги
  price: number; // Добавляем цену услуги
};

interface Params {
  params: {
    slug: string; // Используем slug вместо id
  };
}

const ServicePage = ({ params }) => {
  const [service, setService] = useState<Service>({
    id: 0,
    name: "",
    description: "",
    image: "",
    price: 0,
  });
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [address, setAddress] = useState("");
  const [comment, setComment] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const { slug } = params;

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/services/services/${slug}`
        );
        setService(response.data);
      } catch (error) {
        console.error("Failed to load service details:", error);
      }
    };

    fetchService();
  }, [slug]);

  const handleOrder = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("service", String(service.id));
    formData.append("address", address);
    formData.append("comment", comment);
    if (image) {
      formData.append("image", image);
    }

    try {
      const token = localStorage.getItem("accessToken"); // Получаем токен из localStorage
      const response = await axios.post(
        `http://127.0.0.1:8000/api/orders/orders/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Включение токена в заголовок
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Order successfully created");
      setShowOrderForm(false); // Скрываем форму после отправки
    } catch (error) {
      console.error(
        "Failed to create order:",
        error.response?.data || error.message
      );
      alert("Failed to create order");
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Service Details</h1>
      <div className="bg-white p-6 shadow-md rounded text-center">
        <h2 className="text-xl mb-2">{service.name}</h2>
        {service.image && (
          <img
            src={service.image}
            alt={service.name}
            className="max-w-full h-auto mb-4"
          />
        )}
        <p className="mb-4">
          {service.description || "No additional information available."}
        </p>
        <button
          onClick={() => setShowOrderForm(true)}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Заказать услугу
        </button>
        {showOrderForm && (
          <form onSubmit={handleOrder} className="mt-4">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Адрес"
              className="block w-full p-2 mb-2 border"
              required
            />
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Комментарий (необязательно)"
              className="block w-full p-2 mb-2 border"
            />
            <input
              type="file"
              onChange={handleImageChange}
              className="block w-full mb-2"
            />
            <button
              type="submit"
              className="bg-green-500 text-white p-2 rounded"
            >
              Подтвердить заказ
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ServicePage;
