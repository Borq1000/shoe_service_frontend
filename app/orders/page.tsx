import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
  MapPin,
  Calendar,
  MessageSquare,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";

interface Order {
  id: number;
  status: string;
  city: string;
  street: string;
  building_num?: string;
  comment?: string;
  image: string | null;
  created_at: string;
  service_details: {
    name: string;
    price: number;
  };
}

async function fetchOrders() {
  const session = await auth();

  if (!session) {
    return null;
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/client/orders/`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          Accept: "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error("Ошибка загрузки заказов:", {
        status: response.status,
        statusText: response.statusText,
      });
      const errorText = await response.text();
      console.error("Текст ошибки:", errorText);
      return []; // Возвращаем пустой массив вместо выброса ошибки
    }

    const data = await response.json();
    return data.results || []; // Возвращаем results или пустой массив, если results нет
  } catch (error) {
    console.error("Ошибка загрузки заказов:", error);
    return []; // Возвращаем пустой массив в случае ошибки
  }
}

const statusMapping = {
  pending: { label: "Ожидает", color: "bg-orange-100 text-orange-800" },
  awaiting_courier: {
    label: "Ожидает назначения курьера",
    color: "bg-blue-100 text-blue-800",
  },
  courier_on_the_way: {
    label: "Курьер в пути",
    color: "bg-green-100 text-green-800",
  },
  at_location: {
    label: "На месте выполнения",
    color: "bg-yellow-100 text-yellow-800",
  },
  in_progress: { label: "В работе", color: "bg-purple-100 text-purple-800" },
  completed: { label: "Завершен", color: "bg-red-100 text-red-800" },
  cancelled: { label: "Отменен", color: "bg-gray-100 text-gray-800" },
  return: { label: "Возврат", color: "bg-pink-100 text-pink-800" },
} as const;

const getStatusInfo = (status: string) => {
  return (
    (statusMapping as Record<string, { label: string; color: string }>)[
      status
    ] || { label: "Неизвестен", color: "bg-gray-100 text-gray-800" }
  );
};

export default async function OrdersPage() {
  const orders = await fetchOrders();

  if (!orders) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-[32px] font-semibold text-secondary mb-8">
          Ваши заказы
        </h1>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-light text-lg">У вас пока нет заказов.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="group"
              >
                <article className="h-full">
                  <div className="relative aspect-[4/3] mb-3 rounded-xl overflow-hidden">
                    {order.image ? (
                      <img
                        src={order.image}
                        alt="Изображение заказа"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-lighter flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-gray-light" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          getStatusInfo(order.status).color
                        }`}
                      >
                        {getStatusInfo(order.status).label}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-[22px] font-medium text-secondary">
                      {order.service_details.name}
                    </h3>

                    <div className="flex items-center text-gray-light">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="text-sm">
                        {`${order.city}, ${order.street}${
                          order.building_num ? `, ${order.building_num}` : ""
                        }`}
                      </span>
                    </div>

                    <div className="flex items-center text-gray-light">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-sm">
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    {order.comment && (
                      <div className="flex items-start text-gray-light">
                        <MessageSquare className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-sm line-clamp-2">
                          {order.comment}
                        </span>
                      </div>
                    )}

                    <div className="pt-2">
                      <span className="text-lg font-semibold text-secondary">
                        {order.service_details.price} ₽
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
