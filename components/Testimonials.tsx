import React from "react";

const Testimonials = () => {
  return (
    <div className="min-w-screen min-h-screen bg-gray-50 flex items-center justify-center py-5">
      <div className="w-full bg-white border-t border-b border-gray-200 px-5 py-16 md:py-24 text-gray-800">
        <div className="w-full max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-5 text-gray-600">
              Что говорят о нас
            </h1>
            <h3 className="text-xl mb-5 font-light">
              Узнайте мнение наших клиентов о наших услугах
            </h3>
            <div className="text-center mb-10">
              <span className="inline-block w-1 h-1 rounded-full bg-indigo-500 ml-1"></span>
              <span className="inline-block w-3 h-1 rounded-full bg-indigo-500 ml-1"></span>
              <span className="inline-block w-40 h-1 rounded-full bg-indigo-500"></span>
              <span className="inline-block w-3 h-1 rounded-full bg-indigo-500 ml-1"></span>
              <span className="inline-block w-1 h-1 rounded-full bg-indigo-500 ml-1"></span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Анна Иванова",
                review:
                  "Отличное качество работы, обувь стала как новая! Буду пользоваться услугами сервиса снова.",
                img: "https://i.pravatar.cc/100?img=1",
              },
              {
                name: "Дмитрий Петров",
                review:
                  "Очень удобный сервис! Приехал курьер, забрал обувь, а через пару дней вернул в идеальном состоянии!",
                img: "https://i.pravatar.cc/100?img=2",
              },
              {
                name: "Марина Сидорова",
                review:
                  "Обувь починили быстро и качественно. Никаких претензий, только благодарности!",
                img: "https://i.pravatar.cc/100?img=3",
              },
              {
                name: "Алексей Кузнецов",
                review:
                  "Давно искал подобный сервис. Все четко и удобно! Рекомендую всем.",
                img: "https://i.pravatar.cc/100?img=4",
              },
              {
                name: "Ольга Смирнова",
                review:
                  "Обувь была в ужасном состоянии, но после чистки выглядит как новая. Очень довольна результатом.",
                img: "https://i.pravatar.cc/100?img=5",
              },
              {
                name: "Екатерина Захарова",
                review:
                  "Ремонт был выполнен быстро и качественно. Большое спасибо!",
                img: "https://i.pravatar.cc/100?img=6",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="w-full mx-auto rounded-lg bg-white border border-gray-200 p-5 text-gray-800 font-light mb-6"
              >
                <div className="w-full flex mb-4 items-center">
                  <div className="overflow-hidden rounded-full w-10 h-10 bg-gray-50 border border-gray-200">
                    <img src={testimonial.img} alt={testimonial.name} />
                  </div>
                  <div className="flex-grow pl-3">
                    <h6 className="font-bold text-sm uppercase text-gray-600">
                      {testimonial.name}
                    </h6>
                  </div>
                </div>
                <div className="w-full">
                  <p className="text-sm leading-tight">
                    <span className="text-lg leading-none italic font-bold text-gray-400 mr-1">
                      "
                    </span>
                    {testimonial.review}
                    <span className="text-lg leading-none italic font-bold text-gray-400 ml-1">
                      "
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
