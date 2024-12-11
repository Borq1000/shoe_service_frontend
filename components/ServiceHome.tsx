"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

// Определяем тип данных для услуги
type Service = {
  id: number;
  slug: string;
  name: string;
  description: string;
  image: string;
};

export default function ServiceHome() {
  const { data: session } = useSession();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchServices() {
      try {
        if (!session?.accessToken) return;

        const response = await fetch(
          "http://127.0.0.1:8000/api/services/services/",
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Не удалось загрузить услуги");
        }

        const data = await response.json();
        setServices(
          Array.isArray(data.results)
            ? data.results.sort((a: Service, b: Service) => a.id - b.id)
            : []
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Произошла ошибка");
      } finally {
        setIsLoading(false);
      }
    }

    fetchServices();
  }, [session?.accessToken]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 text-center">
        <div className="text-gray-600">Загрузка услуг...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 text-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <div
            key={service.id}
            className="relative p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex flex-col items-center">
              {service.image && (
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-24 h-24 object-cover mb-4 rounded-full"
                />
              )}
              <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                {service.name}
              </h3>
              <p className="text-gray-600 text-center mb-4">
                {service.description}
              </p>
              {service.slug && (
                <Link href={`/services/${service.slug}`}>
                  <button className="border-2 border-custom-red text-custom-red bg-white py-2 px-4 rounded-full transition duration-300 hover:bg-custom-red hover:text-white">
                    Заказать услугу
                  </button>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
