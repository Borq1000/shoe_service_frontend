import { FC } from "react";
import { FiTruck, FiCheckCircle, FiUser, FiShoppingCart } from "react-icons/fi";

const Features: FC = () => {
  const features = [
    {
      title: "Высокое качество ремонта",
      description:
        "Наши мастера гарантируют высокое качество ремонта с использованием современных материалов.",
      icon: FiCheckCircle, // Иконка для качества
    },
    {
      title: "Удобная доставка",
      description:
        "Мы организуем быструю и удобную доставку вашей обуви на ремонт и обратно.",
      icon: FiTruck, // Иконка для доставки
    },
    {
      title: "Опытные специалисты",
      description:
        "Наша команда состоит из опытных профессионалов с многолетним опытом работы.",
      icon: FiUser, // Иконка для специалистов
    },
    {
      title: "Простота заказа",
      description:
        "Легко оформляйте заказы через наше приложение или веб-сайт за несколько кликов.",
      icon: FiShoppingCart, // Иконка для заказа
    },
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto text-center p-6">
        <h2 className="text-3xl font-semibold text-gray-800">
          Наши преимущества
        </h2>
        <p className="mt-4 text-gray-600">
          Мы предлагаем уникальные услуги для вашего удобства и комфорта
        </p>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex flex-col items-center mb-4">
                <feature.icon className="text-[#EF0000] h-12 w-12 mb-4" />{" "}
                {/* Иконка увеличена и размещена сверху */}
                <h3 className="text-xl font-semibold text-gray-800">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
