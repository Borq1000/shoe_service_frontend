import { auth } from "@/auth";
import { redirect } from "next/navigation";

async function fetchOrders() {
  const session = await auth();

  if (!session) {
    return null;
  }

  const response = await fetch(
    "http://127.0.0.1:8000/api/orders/client/orders/",
    {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    }
  );

  if (!response.ok) {
    console.error("Ошибка загрузки заказов:", response);
    throw new Error("Не удалось загрузить заказы");
  }

  // Возвращаем только массив заказов
  const data = await response.json();
  return data.results;
}

// Сопоставление статусов на русском языке и их цвета
const statusMapping = {
  pending: { label: "Ожидает", color: "text-orange-500" },
  awaiting_courier: {
    label: "Ожидает назначения курьера",
    color: "text-blue-500",
  },
  courier_on_the_way: { label: "Курьер в пути", color: "text-green-500" },
  at_location: { label: "На месте выполнения", color: "text-yellow-500" },
  in_progress: { label: "В работе", color: "text-purple-500" },
  completed: { label: "Завершен", color: "text-red-500" },
  cancelled: { label: "Отменен", color: "text-gray-500" },
  return: { label: "Возврат", color: "text-pink-500" },
};

export default async function OrdersPage() {
  const orders = await fetchOrders();

  if (!orders) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Ваши заказы</h1>
      {orders.length === 0 ? (
        <p className="text-center text-gray-500">У вас пока нет заказов.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {order.service_details.name}
              </h2>
              <p className="text-gray-600 mb-1">
                {`${order.city}, ${order.street}, ${order.building_num || ""}`}
              </p>
              <p
                className={`mb-1 ${
                  statusMapping[order.status]?.color || "text-gray-500"
                }`}
              >
                Статус: {statusMapping[order.status]?.label || "Неизвестен"}
              </p>
              <p className="text-gray-600 mb-1">
                {new Date(order.created_at).toLocaleDateString()}
              </p>
              {order.comment && (
                <p className="text-gray-600 mb-1">
                  Комментарий: {order.comment}
                </p>
              )}
              {order.image && (
                <img
                  src={order.image}
                  alt="Изображение заказа"
                  className="w-full h-32 object-cover rounded-lg my-4"
                />
              )}
              <p className="text-gray-700 font-bold mb-4">
                Цена: {order.service_details.price} руб.
              </p>
              <a href={`/orders/${order.id}`} className="block w-full">
                <button className="w-full py-2 px-4 text-white bg-custom-red rounded-full hover:bg-red-600 transition duration-300">
                  Подробнее
                </button>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
