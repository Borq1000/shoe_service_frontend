"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Define the data type for a service
type Service = {
  id: number;
  slug: string;
  name: string;
  image: string; // Assuming there is an image field returned
};

const ServicePage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/services/services/`
        );
        setServices(response.data);
      } catch (error) {
        console.error("Failed to load services:", error);
      }
    };

    fetchServices();
  }, []);

  return (
    <>
      <div className="flex justify-center items-center bg-gray-200 p-4">
        <h1 className="text-2xl font-bold mb-4">Наши услуги</h1>
      </div>
      <div className="flex justify-center items-center p-4">
        <div className="flex flex-wrap justify-center gap-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="w-1/4 shadow-lg p-4 text-center bg-white hover:bg-gray-50 transition-colors"
            >
              {service.image && (
                <img
                  src={service.image}
                  alt={service.name}
                  className="mx-auto h-24 w-auto"
                />
              )}
              <Link href={`/services/${service.slug}`}>{service.name}</Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ServicePage;
