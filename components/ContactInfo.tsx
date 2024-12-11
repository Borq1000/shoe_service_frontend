import { FC } from "react";
import { FiMapPin, FiPhone, FiMail } from "react-icons/fi";
import { FaTelegramPlane, FaWhatsapp } from "react-icons/fa";

const ContactInfo: FC = () => {
  return (
    <section className="bg-white" id="contact">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mb-4">
          <div className="mb-6 max-w-3xl text-center sm:text-center md:mx-auto md:mb-12">
            <p className="text-base font-semibold uppercase tracking-wide text-white">
              Контакты
            </p>
            <h2 className="font-heading mb-4 font-bold tracking-tight text-black text-3xl sm:text-5xl">
              Свяжитесь с нами
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-xl text-gray-500">
              Мы всегда готовы помочь вам!
            </p>
          </div>
        </div>
        <div className="flex items-stretch justify-center">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="h-full pr-6">
              <ul className="mb-6 md:mb-0">
                <li className="flex">
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-custom-red text-white">
                    <FiMapPin className="h-6 w-6" />
                  </div>
                  <div className="ml-4 mb-4">
                    <h3 className="mb-2 text-lg font-medium leading-6 text-black">
                      Наш Адрес
                    </h3>
                    <p className="text-gray-600">г. Одинцово, Село Юдино 35</p>
                  </div>
                </li>
                <li className="flex">
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-custom-red text-white">
                    <FiPhone className="h-6 w-6" />
                  </div>
                  <div className="ml-4 mb-4">
                    <h3 className="mb-2 text-lg font-medium leading-6 text-black">
                      Контакты
                    </h3>
                    <p className="text-gray-600">Телефон: +7 (931) 998 09-09</p>
                    <p className="text-gray-600">
                      E-mail: newlife-peretyajka@mail.ru
                    </p>
                  </div>
                </li>
                <li className="flex">
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-custom-red text-white">
                    <FiMail className="h-6 w-6" />
                  </div>
                  <div className="ml-4 mb-4">
                    <h3 className="mb-2 text-lg font-medium leading-6 text-black">
                      Рабочие часы
                    </h3>
                    <p className="text-gray-600">Пн-Пт: 08:00 - 17:00</p>
                    <p className="text-gray-600">Сб-Вс: 08:00 - 12:00</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="card h-fit max-w-6xl p-5 md:p-12" id="form">
              <h2 className="mb-4 text-2xl font-bold text-black">
                Готовы начать?
              </h2>
              <form id="contactForm">
                <div className="mb-6">
                  <div className="mx-0 mb-4">
                    <input
                      type="text"
                      id="name"
                      placeholder="Ваше имя"
                      className="mb-2 w-full rounded-md border border-gray-400 py-2 pl-2 pr-4 shadow-md text-gray-900"
                      name="name"
                    />
                  </div>
                  <div className="mx-0 mb-4">
                    <input
                      type="email"
                      id="email"
                      placeholder="Ваш email"
                      className="mb-2 w-full rounded-md border border-gray-400 py-2 pl-2 pr-4 shadow-md text-gray-900"
                      name="email"
                    />
                  </div>
                  <div className="mx-0 mb-4">
                    <textarea
                      id="textarea"
                      name="textarea"
                      cols={30}
                      rows={5}
                      placeholder="Ваше сообщение"
                      className="mb-2 w-full rounded-md border border-gray-400 py-2 pl-2 pr-4 shadow-md text-gray-900"
                    />
                  </div>
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="w-full bg-custom-red text-white px-6 py-3 font-xl rounded-md"
                  >
                    Отправить сообщение
                  </button>
                </div>
              </form>
              <div className="flex justify-center mt-8 space-x-4">
                <a
                  href="https://t.me/yourtelegram"
                  className="text-blue-500 hover:text-blue-700"
                >
                  <FaTelegramPlane className="h-8 w-8" />
                </a>
                <a
                  href="https://wa.me/yourwhatsapp"
                  className="text-green-500 hover:text-green-700"
                >
                  <FaWhatsapp className="h-8 w-8" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;
