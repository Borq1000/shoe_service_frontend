"use client";

import { Service } from "@/types/services";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface ServiceFormProps {
  service: Service;
}

export function ServiceForm({ service }: ServiceFormProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    city: "",
    street: "",
    house: "",
    apartment: "",
    entrance: "",
    floor: "",
    comment: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!session?.accessToken) {
        toast.error("Необходима авторизация");
        return;
      }

      const response = await fetch(
        "http://127.0.0.1:8000/api/orders/client/orders/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            service: service.id,
            ...formData,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Ошибка при создании заказа");
      }

      const order = await response.json();
      toast.success("Заказ успешно создан!");
      router.push(`/orders/${order.id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Произошла ошибка");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md"
    >
      <div className="mb-6">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="city"
        >
          Город
        </label>
        <input
          type="text"
          id="city"
          name="city"
          value={formData.city}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>

      <div className="mb-6">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="street"
        >
          Улица
        </label>
        <input
          type="text"
          id="street"
          name="street"
          value={formData.street}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="house"
          >
            Дом
          </label>
          <input
            type="text"
            id="house"
            name="house"
            value={formData.house}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div>
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="apartment"
          >
            Квартира
          </label>
          <input
            type="text"
            id="apartment"
            name="apartment"
            value={formData.apartment}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="entrance"
          >
            Подъезд
          </label>
          <input
            type="text"
            id="entrance"
            name="entrance"
            value={formData.entrance}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div>
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="floor"
          >
            Этаж
          </label>
          <input
            type="text"
            id="floor"
            name="floor"
            value={formData.floor}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
      </div>

      <div className="mb-6">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="comment"
        >
          Комментарий
        </label>
        <textarea
          id="comment"
          name="comment"
          value={formData.comment}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          rows={4}
        />
      </div>

      <div className="flex items-center justify-center">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-custom-red hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 disabled:opacity-50"
        >
          {isLoading ? "Создание заказа..." : "Создать заказ"}
        </button>
      </div>
    </form>
  );
}
