"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Как происходит процесс заказа услуги?",
    answer:
      "Процесс заказа очень прост: выберите нужную услугу, укажите адрес и удобное время для визита курьера. Наш специалист заберет обувь, а после выполнения работ доставит её обратно. Вы можете отслеживать статус заказа в личном кабинете.",
  },
  {
    question: "Какой гарантийный срок на ремонт?",
    answer:
      "Мы предоставляем гарантию 30 дней на все виды ремонтных работ. Если в течение этого срока возникнут проблемы с качеством ремонта, мы бесплатно устраним все недостатки.",
  },
  {
    question: "Сколько времени занимает ремонт?",
    answer:
      "Стандартное время выполнения заказа составляет 2-5 рабочих дней. Срочный ремонт может быть выполнен за 24 часа с дополнительной платой. Точные сроки зависят от сложности работ и загруженности мастеров.",
  },
  {
    question: "Какие материалы используются при ремонте?",
    answer:
      "Мы работаем только с проверенными поставщиками и используем высококачественные материалы ведущих производителей. Это гарантирует долговечность ремонта и сохранение внешнего вида обуви.",
  },
  {
    question: "Есть ли доставка за пределы города?",
    answer:
      "Да, мы осуществляем доставку в пригород и ближайшие населенные пункты. Стоимость доставки зависит от удаленности. Точную цену вы можете узнать при оформлении заказа.",
  },
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold text-secondary">
            Часто задаваемые вопросы
          </h2>
          <p className="mt-4 text-xl text-gray-light">
            Всё, что нужно знать о нашем сервисе
          </p>
        </div>

        <div className="mt-12 space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-border-color rounded-xl overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-lighter transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="text-lg font-medium text-secondary">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-light transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-200 ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="px-6 pb-4 text-gray-light">{faq.answer}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Дополнительная секция поддержки */}
        <div className="mt-12 text-center">
          <p className="text-gray-light">Не нашли ответ на свой вопрос?</p>
          <a
            href="#contact"
            className="mt-4 inline-flex items-center text-primary hover:text-primary-dark font-medium"
          >
            Свяжитесь с нами
            <ChevronDown className="w-4 h-4 ml-1 rotate-[-90deg]" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Faq;
