"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import type { Service } from "@/types/services";
import { handleOrder } from "@/app/actions/orders";
import CityAutocomplete from "@/components/CityAutocomplete";
import StreetAutocomplete from "@/components/StreetAutocomplete";

interface ServiceFormProps {
  service: Service;
}

export function ServiceForm({ service }: ServiceFormProps) {
  const { data: session } = useSession();
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState(false);
  const [street, setStreet] = useState("");
  const [buildingNum, setBuildingNum] = useState("");
  const [city, setCity] = useState("Москва");
  const [comment, setComment] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleAddressSelection = async (selectedStreet: string) => {
    setStreet(selectedStreet);

    // Используем DaData API для получения координат
    const API_KEY = "07aa32baff66a4622cc081f9f4b887e2fe7e433a";
    try {
      const response = await fetch(
        "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${API_KEY}`,
          },
          body: JSON.stringify({
            query: `${selectedStreet}, ${city}`,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.suggestions.length > 0) {
          const location = data.suggestions[0].data;
          setLatitude(parseFloat(location.geo_lat));
          setLongitude(parseFloat(location.geo_lon));
        }
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors: string[] = [];

    if (!session?.accessToken) {
      errors.push("Необходима авторизация");
    }
    if (!street.trim()) {
      errors.push("Укажите улицу");
    }
    if (!buildingNum.trim()) {
      errors.push("Укажите номер дома");
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      setOrderError(true);
      return;
    }

    setValidationErrors([]);
    setOrderError(false);

    const formData = new FormData();

    // Добавляем основные поля
    formData.append("token", session!.accessToken!);
    formData.append("service", service.id.toString());
    formData.append("city", city);
    formData.append("street", street);
    formData.append("building_num", buildingNum);

    // Добавляем опциональные поля
    const buildingInput = event.currentTarget.querySelector<HTMLInputElement>(
      'input[name="building"]'
    );
    const floorInput = event.currentTarget.querySelector<HTMLInputElement>(
      'input[name="floor"]'
    );
    const apartmentInput = event.currentTarget.querySelector<HTMLInputElement>(
      'input[name="apartment"]'
    );

    if (buildingInput?.value) formData.append("building", buildingInput.value);
    if (floorInput?.value) formData.append("floor", floorInput.value);
    if (apartmentInput?.value)
      formData.append("apartment", apartmentInput.value);

    // Добавляем координаты
    if (latitude && longitude) {
      formData.append("latitude", latitude.toString());
      formData.append("longitude", longitude.toString());
    }

    // Добавляем комментарий
    if (comment.trim()) {
      formData.append("comment", comment);
    }

    // Проверяем и добавляем файл
    const imageInput = event.currentTarget.querySelector<HTMLInputElement>(
      'input[name="image"]'
    );
    const file = imageInput?.files?.[0];

    if (file) {
      // Проверяем размер файла (не более 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setValidationErrors(["Размер файла не должен превышать 5MB"]);
        setOrderError(true);
        return;
      }

      // Проверяем тип файла
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        setValidationErrors([
          "Поддерживаются только форматы: JPEG, JPG, PNG, GIF, WebP",
        ]);
        setOrderError(true);
        return;
      }

      formData.append("image", file);
    }

    try {
      console.log(
        "Sending order data:",
        Object.fromEntries(formData.entries())
      );
      await handleOrder(formData);
      setOrderSuccess(true);
      setOrderError(false);
    } catch (error) {
      console.error("Failed to create order:", error);
      if (error instanceof Error) {
        setValidationErrors([error.message]);
      }
      setOrderError(true);
    }
  };

  if (orderSuccess) {
    return (
      <div
        className="bg-green-50 text-green-800 p-6 rounded-lg relative w-full max-w-lg"
        role="alert"
      >
        <strong className="font-bold">Ваш заказ успешно создан!</strong>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Город
          </label>
          <CityAutocomplete
            value={city}
            onChange={(newCity) => {
              setCity(newCity);
              setStreet("");
            }}
          />
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
            placeholder="Введите номер дома"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Корпус (необязательно)
          </label>
          <input
            type="text"
            name="building"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Этаж (необязательно)
          </label>
          <input
            type="text"
            name="floor"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Квартира (необязательно)
          </label>
          <input
            type="text"
            name="apartment"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Загрузите фото обуви (необязательно)
          </label>
          <input
            type="file"
            name="image"
            accept="image/*"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
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

        {orderError && (
          <div className="mb-4 text-red-600">
            {validationErrors.length > 0 ? (
              <ul>
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            ) : (
              "Произошла ошибка при создании заказа. Пожалуйста, попробу��те снова."
            )}
          </div>
        )}

        <button
          type="submit"
          className="px-5 py-3 text-lg tracking-wider text-white bg-custom-red rounded-full w-full hover:bg-red-600 transition-colors"
        >
          Подтвердить заказ
        </button>
      </form>
    </div>
  );
}
