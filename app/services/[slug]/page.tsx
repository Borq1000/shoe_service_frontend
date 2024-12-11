"use client";

import React, { useState, useEffect } from "react";
import CityAutocomplete from "@/components/CityAutocomplete";
import StreetAutocomplete from "@/components/StreetAutocomplete";
import { useSession } from "next-auth/react";

// Тип данных услуги
type Service = {
  id: number;
  name: string;
  description: string;
  price: number;
};

interface ServicePageProps {
  params: {
    slug: string;
  };
}

const ServicePage: React.FC<ServicePageProps> = ({ params }) => {
  const { data: session } = useSession();
  const { slug } = params;

  const [service, setService] = useState<Service | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  // Поля формы заказа
  const [city, setCity] = useState("Москва");
  const [street, setStreet] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [building, setBuilding] = useState("");
  const [buildingNum, setBuildingNum] = useState("");
  const [floor, setFloor] = useState("");
  const [apartment, setApartment] = useState("");
  const [comment, setComment] = useState("");
  const [image, setImage] = useState<File | null>(null);

  // Получение данных услуги
  useEffect(() => {
    const fetchService = async () => {
      if (!slug) {
        setOrderError("Slug is missing.");
        return;
      }

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/services/services/${slug}`,
          {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Failed to fetch service data. Status: ${response.status}. ${errorText}`
          );
        }

        const data = await response.json();
        setService(data);
      } catch (error: any) {
        console.error("Error loading service:", error);
        setOrderError(error.message || "Failed to load service.");
      }
    };

    fetchService();
  }, [slug, session?.accessToken]);

  const handleAddressSelection = (
    selectedStreet: string,
    lat: number | null,
    lon: number | null
  ) => {
    setStreet(selectedStreet);
    setLatitude(lat);
    setLongitude(lon);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      setImage(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setOrderError(null);
    setOrderSuccess(false);

    if (!session?.accessToken) {
      setOrderError("Необходима авторизация для создания заказа.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("service", String(service?.id || ""));
      formData.append("city", city);
      formData.append("street", street);
      formData.append("building_num", buildingNum || "");
      formData.append("building", building || "");
      formData.append("floor", floor || "");
      formData.append("apartment", apartment || "");
      formData.append("latitude", latitude?.toString() || "");
      formData.append("longitude", longitude?.toString() || "");
      formData.append("comment", comment);
      if (image) {
        formData.append("image", image);
      }

      const response = await fetch(
        "http://127.0.0.1:8000/api/orders/client/orders/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: "Failed to create order",
        }));
        throw new Error(errorData.message || "Failed to create order.");
      }

      setOrderSuccess(true);
    } catch (error: any) {
      console.error("Failed to create order:", error);
      setOrderError(error.message || "Не удалось создать заказ.");
    }
  };

  if (orderError) {
    return (
      <div className="text-red-600 text-center mt-4">
        <p>Ошибка: {orderError}</p>
      </div>
    );
  }

  if (!service) {
    return (
      <p className="text-center text-gray-500">
        Загрузка информации об услуге...
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        {service.name}
      </h1>
      {orderSuccess ? (
        <div
          className="bg-green-50 text-green-800 p-6 rounded-lg relative w-full max-w-lg"
          role="alert"
        >
          <strong className="font-bold">Ваш заказ успешно создан!</strong>
        </div>
      ) : (
        <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Город
              </label>
              <CityAutocomplete value={city} onChange={setCity} />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Улица
              </label>
              <StreetAutocomplete
                city={city}
                value={street}
                onChange={handleAddressSelection}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Номер дома
              </label>
              <input
                type="text"
                value={buildingNum}
                onChange={(e) => setBuildingNum(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Корпус
              </label>
              <input
                type="text"
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Этаж
              </label>
              <input
                type="text"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Квартира
              </label>
              <input
                type="text"
                value={apartment}
                onChange={(e) => setApartment(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Комментарий
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Введите комментарий"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Фото обуви
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3 text-lg tracking-wider text-white bg-custom-red rounded-full w-full"
            >
              Подтвердить заказ
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ServicePage;
