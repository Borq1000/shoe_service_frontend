"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Sparkles,
  Brush,
  Scissors,
  PaintBucket,
  Hammer,
  RefreshCw,
} from "lucide-react";

// Определяем тип данных для услуги
type Service = {
  id: number;
  slug: string;
  name: string;
  description: string;
  image: string;
  price: number;
};

const serviceIcons = {
  "chistka-obuvi": Sparkles,
  "pokraska-obuvi": PaintBucket,
  "remont-podoshvy": Hammer,
  "zamena-molnii": Scissors,
  "remont-nakonechnikov": RefreshCw,
  "vosstanovlenie-formy": Brush,
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
    <section className="py-24 bg-white" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-semibold text-secondary mb-4">
            Наши услуги
          </h2>
          <p className="text-xl text-gray-light">
            Профессиональный уход за вашей обувью
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const IconComponent =
              serviceIcons[service.slug as keyof typeof serviceIcons] ||
              Sparkles;

            return (
              <Link
                key={service.id}
                href={`/services/${service.slug}`}
                className="group relative bg-white rounded-xl p-6 transition-all duration-200 hover:shadow-card border border-border-color"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-semibold text-secondary mb-2 group-hover:text-primary transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-gray-light mb-4 line-clamp-2">
                      {service.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-semibold text-secondary">
                        {service.price} ₽
                      </span>
                      <span className="inline-flex items-center text-primary font-medium group-hover:translate-x-1 transition-transform">
                        Заказать
                        <svg
                          className="w-4 h-4 ml-1"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
