import { FC } from "react";
import {
  RiShieldStarLine,
  RiTruckLine,
  RiTeamLine,
  RiSmartphoneLine,
} from "react-icons/ri";

const Features: FC = () => {
  const features = [
    {
      title: "Высокое качество",
      description:
        "Профессиональный ремонт с использованием премиальных материалов и современных технологий",
      icon: RiShieldStarLine,
    },
    {
      title: "Удобная доставка",
      description:
        "Бесплатный вызов курьера в удобное для вас время. Доставка в обе стороны",
      icon: RiTruckLine,
    },
    {
      title: "Опытные мастера",
      description:
        "Команда профессионалов с многолетним опытом работы и любовью к своему делу",
      icon: RiTeamLine,
    },
    {
      title: "Простой заказ",
      description:
        "Оформление заказа за пару кликов через приложение или сайт. Отслеживание статуса",
      icon: RiSmartphoneLine,
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-semibold text-secondary">
            Почему выбирают нас
          </h2>
          <p className="mt-4 text-xl text-gray-light">
            Мы создали сервис, в котором учли все потребности наших клиентов
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-y-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-0">
            {features.map((feature, index) => (
              <div key={index} className="relative group">
                {/* Декоративная линия между элементами */}
                {index < features.length - 1 && (
                  <div className="hidden lg:block absolute right-0 top-1/2 w-full border-t border-border-color -translate-y-1/2" />
                )}

                <div className="relative flex flex-col items-center">
                  {/* Иконка */}
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>

                  {/* Номер шага */}
                  <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/3 flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-primary text-primary font-semibold text-sm">
                    {index + 1}
                  </div>

                  {/* Текст */}
                  <div className="mt-6 text-center">
                    <h3 className="text-xl font-semibold text-secondary">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-gray-light">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Дополнительная информация */}
        <div className="mt-20 text-center">
          <a
            href="#services"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary hover:bg-primary-dark transition-colors"
          >
            Попробовать сейчас
          </a>
        </div>
      </div>
    </section>
  );
};

export default Features;
