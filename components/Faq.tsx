"use client";
import React, { useState } from "react";

const faqs = [
  {
    question: "Как происходит процесс заказа услуги?",
    answer:
      "Процесс заказа очень прост: выберите нужную услугу, добавьте необходимую информацию и подтвердите заказ. Наш курьер приедет в удобное время, чтобы забрать обувь, и доставит её обратно после выполнения работ.",
  },
  {
    question: "Какой гарантийный срок предоставляется на выполненные работы?",
    answer:
      "Мы предоставляем гарантию на все выполненные работы в течение 30 дней. Если у вас возникнут вопросы, свяжитесь с нами, и мы оперативно решим вашу проблему.",
  },
  {
    question: "Как быстро я получу свою обувь обратно?",
    answer:
      "Стандартное время выполнения заказа составляет от 2 до 5 рабочих дней, в зависимости от типа работы и загруженности. О срочных заказах мы информируем дополнительно.",
  },
  {
    question: "Какие материалы вы используете для ремонта?",
    answer:
      "Мы используем только высококачественные материалы, которые помогают продлить срок службы вашей обуви и сохранить её внешний вид.",
  },
];

const Faq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-manrope font-bold text-gray-900 leading-[3.25rem]">
            Часто задаваемые вопросы
          </h2>
        </div>

        <div className="accordion-group">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`accordion py-8 px-6 border-b border-solid border-gray-200 transition-all duration-500 rounded-2xl hover:bg-indigo-50 ${
                openIndex === index ? "bg-indigo-50" : ""
              }`}
              onClick={() => toggleAccordion(index)}
            >
              <button
                className="accordion-toggle group inline-flex items-center justify-between leading-8 text-gray-900 w-full transition duration-500 text-left hover:text-indigo-600"
                aria-controls={`faq-${index}`}
              >
                <h5 className="font-medium text-lg">{faq.question}</h5>
                <svg
                  className={`w-6 h-6 text-gray-500 transition-transform duration-500 ${
                    openIndex === index ? "rotate-180 text-indigo-600" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div
                id={`faq-${index}`}
                className={`accordion-content w-full px-0 overflow-hidden transition-max-height duration-500 ${
                  openIndex === index ? "max-h-screen" : "max-h-0"
                }`}
              >
                <p className="text-base text-gray-900 leading-6 mt-4">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
