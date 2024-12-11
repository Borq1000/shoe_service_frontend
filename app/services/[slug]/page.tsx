"use client";

import React, { useState, useEffect } from "react";
import { handleOrder } from "@/actions";
import CityAutocomplete from "@/components/CityAutocomplete";
import StreetAutocomplete from "@/components/StreetAutocomplete";
import { useSession } from "next-auth/react";
import {
  MapPin,
  Upload,
  Building2,
  Building,
  Stairs,
  Home,
  MessageSquare,
} from "lucide-react";

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
  const [orderError, setOrderError] = useState(false);

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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchService = async () => {
      if (!slug) {
        console.error("Slug is undefined or missing");
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
          console.error(
            `Failed to fetch service data. Status: ${
              response.status
            }, Text: ${await response.text()}`
          );
          throw new Error("Failed to fetch service data.");
        }
        const data = await response.json();
        setService(data);
      } catch (error) {
        console.error("Error loading service:", error);
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
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setOrderError(false);

    const formData = new FormData(event.currentTarget);

    // Добавление недостающих полей
    formData.append("city", city);
    formData.append("street", street);
    formData.append("building_num", buildingNum || "");
    formData.append("building", building || "");
    formData.append("floor", floor || "");
    formData.append("apartment", apartment || "");
    formData.append("latitude", latitude?.toString() || "");
    formData.append("longitude", longitude?.toString() || "");
    formData.append("comment", comment);

    // Добавление изображения, если оно выбрано
    if (image) {
      formData.append("image", image);
    }

    try {
      await handleOrder(formData);
      setOrderSuccess(true);
      setOrderError(false);
    } catch (error) {
      console.error("Failed to create order:", error);
      setOrderError(true);
    }
  };

  if (!service) {
    return (
      <div className="min-h-screen bg-white pt-24 flex items-center justify-center">
        <div className="text-gray-light text-lg">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-[32px] font-semibold text-secondary mb-8">
          {service.name}
        </h1>

        {orderSuccess ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h2 className="text-[22px] font-semibold text-green-800 mb-2">
              Заказ успешно создан!
            </h2>
            <p className="text-green-700">
              Мы свяжемся с вами в ближайшее время для подтверждения заказа.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Адрес */}
            <div className="space-y-4">
              <h2 className="text-[22px] font-semibold text-secondary">
                Адрес
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-light text-sm mb-2">
                    Город
                  </label>
                  <CityAutocomplete value={city} onChange={setCity} />
                </div>

                <div>
                  <label className="block text-gray-light text-sm mb-2">
                    Улица
                  </label>
                  <StreetAutocomplete
                    city={city}
                    value={street}
                    onChange={handleAddressSelection}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-light text-sm mb-2">
                      Номер дома
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-light" />
                      <input
                        type="text"
                        value={buildingNum}
                        onChange={(e) => setBuildingNum(e.target.value)}
                        className="input-primary pl-10"
                        placeholder="12"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-light text-sm mb-2">
                      Корпус
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-light" />
                      <input
                        type="text"
                        value={building}
                        onChange={(e) => setBuilding(e.target.value)}
                        className="input-primary pl-10"
                        placeholder="1"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-light text-sm mb-2">
                      Этаж
                    </label>
                    <div className="relative">
                      <Stairs className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-light" />
                      <input
                        type="text"
                        value={floor}
                        onChange={(e) => setFloor(e.target.value)}
                        className="input-primary pl-10"
                        placeholder="3"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-light text-sm mb-2">
                      Квартира
                    </label>
                    <div className="relative">
                      <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-light" />
                      <input
                        type="text"
                        value={apartment}
                        onChange={(e) => setApartment(e.target.value)}
                        className="input-primary pl-10"
                        placeholder="42"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Комментарий */}
            <div className="space-y-4">
              <h2 className="text-[22px] font-semibold text-secondary">
                Дополнительная информация
              </h2>

              <div>
                <label className="block text-gray-light text-sm mb-2">
                  Комментарий к заказу
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-light" />
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Опишите особенности вашего заказа"
                    className="input-primary pl-10 min-h-[100px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-light text-sm mb-2">
                  Фотография обуви
                </label>
                <div className="relative">
                  {previewUrl ? (
                    <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImage(null);
                          setPreviewUrl(null);
                        }}
                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-50"
                      >
                        <svg
                          className="w-5 h-5 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors"
                      >
                        <div className="space-y-2 text-center">
                          <Upload className="mx-auto w-8 h-8 text-gray-light" />
                          <span className="text-gray-light text-sm">
                            Нажмите или перетащите файл
                          </span>
                        </div>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Кнопка отправки */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full btn-primary text-lg font-medium"
              >
                Создать заказ · {service.price} ₽
              </button>
            </div>

            {orderError && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">
                  Произошла ошибка при создании заказа. Пожалуйста, попробуйте
                  снова.
                </p>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default ServicePage;
