"use client";

import { FC, useState, useEffect, useRef } from "react";
import { FiShoppingCart, FiBell, FiUser, FiMenu, FiX } from "react-icons/fi";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavBar: FC = () => {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Получаем количество непрочитанных уведомлений
  useEffect(() => {
    if (session?.accessToken) {
      fetch("http://127.0.0.1:8000/api/notifications/unread-count/", {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setUnreadCount(data.count))
        .catch(console.error);
    }
  }, [session]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  // Закрытие меню при клике вне меню
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Закрытие меню при изменении маршрута
  useEffect(() => {
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <nav className="bg-gray-100 py-5 px-5">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <img src="/logo2.png" alt="ShoeMaster Logo" className="h-10 mr-2" />
          </Link>
        </div>

        {/* Ссылки для десктопа */}
        <ul className="hidden md:flex space-x-6 text-gray-600">
          <li>
            <Link href="/orders" className="hover:text-gray-900">
              Мои заказы
            </Link>
          </li>
          <li>
            <Link href="/sales" className="hover:text-gray-900">
              Акции
            </Link>
          </li>
          <li>
            <Link href="/aboutus" className="hover:text-gray-900">
              О нас
            </Link>
          </li>
          <li>
            <Link href="/contacts" className="hover:text-gray-900">
              Контакты
            </Link>
          </li>
        </ul>

        {/* Иконки */}
        <div className="hidden md:flex space-x-4 text-gray-600">
          <Link href="#" className="hover:text-gray-900">
            <FiShoppingCart className="h-6 w-6" />
          </Link>
          <Link href="/notifications" className="hover:text-gray-900 relative">
            <FiBell className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Link>
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={toggleUserMenu}
              className="hover:text-gray-900 focus:outline-none"
            >
              <FiUser className="h-6 w-6" />
            </button>
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2">
                <Link href="/account/profile">
                  <span className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Мой профиль
                  </span>
                </Link>
                <Link href="/account/settings">
                  <span className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Настройки
                  </span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="w-full text-left block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Выйти
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Кнопка мобильного меню */}
        <div className="md:hidden flex items-center">
          <button
            className="text-gray-700 focus:outline-none"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? (
              <FiX className="h-6 w-6" />
            ) : (
              <FiMenu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Мобильное меню */}
      {isMobileMenuOpen && (
        <div className="md:hidden flex flex-col mt-4 space-y-2 text-gray-600">
          <Link href="/sales" className="hover:text-gray-900">
            Акции
          </Link>
          <Link href="/aboutus" className="hover:text-gray-900">
            О нас
          </Link>
          <Link href="/contacts" className="hover:text-gray-900">
            Контакты
          </Link>
          <div className="flex space-x-4 mt-4">
            <Link href="#" className="hover:text-gray-900">
              <FiShoppingCart className="h-6 w-6" />
            </Link>
            <Link
              href="/notifications"
              className="hover:text-gray-900 relative"
            >
              <FiBell className="h-6 w-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Link>
            <button
              onClick={toggleUserMenu}
              className="hover:text-gray-900 focus:outline-none"
            >
              <FiUser className="h-6 w-6" />
            </button>
            {isUserMenuOpen && (
              <div className="mt-2 w-full bg-white rounded-md shadow-lg py-2">
                <Link href="/account/profile">
                  <span className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Мой профиль
                  </span>
                </Link>
                <Link href="/account/settings">
                  <span className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Настройки
                  </span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="w-full text-left block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Выйти
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
