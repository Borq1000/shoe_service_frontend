import { redirect } from "next/navigation";

function fetchOrders() {
  const orders = fetch("http://127.0.0.1:8000/api/orders/");

  if (!orders.ok) {
    console.error("Ошибка загрузки заказов:", orders);
    throw new Error("Не удалось загрузить заказы");
  }

  return orders.json();
}

function Orders() {
  let data = fetchOrders();

  console.log("Заказы: --- " + data);

  if (!data) {
    redirect("/login");
  }

  return (
    <div>
      {data.map((order) => (
        <div
          key={order.id}
          className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {order.service_details.name}
          </h2>
          <p className="text-gray-600 mb-1">
            Адрес: {`${order.street}, ${order.building_num}`}
          </p>
          <p
            className={`mb-1 ${
              statusMapping[order.status]?.color || "text-gray-500"
            }`}
          >
            Статус: {statusMapping[order.status]?.label || "Неизвестен"}
          </p>
          <p className="text-gray-600 mb-1">
            Дата создания: {new Date(order.created_at).toLocaleDateString()}
          </p>
          {order.comment && (
            <p className="text-gray-600 mb-1">Комментарий: {order.comment}</p>
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
  );
}

export default Orders;
