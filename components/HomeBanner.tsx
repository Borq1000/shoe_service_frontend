import { GiRunningShoe } from "react-icons/gi";

function HomeBanner() {
  return (
    <div className="relative bg-white overflow-hidden">
      {/* Декоративный фоновый элемент */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Левая колонка с текстом */}
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-semibold text-secondary tracking-tight">
              <span className="block">Новый уровень заботы</span>
              <span className="block text-primary mt-2">о вашей обуви</span>
            </h1>

            <p className="mt-6 text-xl text-gray-light max-w-lg">
              Доверьте нам свою обувь, и мы вернем ей первоначальный вид.
              Профессиональный ремонт и чистка с доставкой до двери.
            </p>

            <div className="mt-10 flex gap-4">
              <a
                href="#services"
                className="btn-primary inline-flex items-center group"
              >
                Заказать услугу
                <GiRunningShoe className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#how-it-works"
                className="btn-secondary inline-flex items-center"
              >
                Как это работает
              </a>
            </div>

            {/* Статистика */}
            <div className="mt-12 grid grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-semibold text-secondary">
                  1000+
                </div>
                <div className="mt-1 text-gray-light">Довольных клиентов</div>
              </div>
              <div>
                <div className="text-3xl font-semibold text-secondary">
                  24/7
                </div>
                <div className="mt-1 text-gray-light">Онлайн поддержка</div>
              </div>
              <div>
                <div className="text-3xl font-semibold text-secondary">4.9</div>
                <div className="mt-1 text-gray-light">Средняя оценка</div>
              </div>
            </div>
          </div>

          {/* Правая колонка с изображением */}
          <div className="relative lg:ml-10">
            <div className="relative">
              <img
                src="/images/nosorog4.png"
                alt="Ремонт обуви"
                className="w-full h-auto rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
              />
              {/* Декоративные элементы */}
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-primary/10 rounded-full blur-xl" />
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-secondary/10 rounded-full blur-xl" />
            </div>

            {/* Плавающая карточка с отзывом */}
            <div className="absolute bottom-8 -left-8 bg-white p-4 rounded-xl shadow-lg max-w-xs animate-float">
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-light">5.0</span>
              </div>
              <p className="text-sm text-secondary">
                "Отличный сервис! Быстро, качественно и удобно. Рекомендую
                всем!"
              </p>
              <div className="mt-2 text-xs text-gray-light">
                Анна К., 2 дня назад
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeBanner;

// Добавьте в globals.css:
/*
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}
*/
