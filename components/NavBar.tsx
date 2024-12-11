"use client";

import { FC, useState, useEffect, useRef } from "react";
import { FiShoppingCart, FiBell, FiUser, FiMenu, FiX } from "react-icons/fi";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Bell } from "lucide-react";
import { useNotification } from "@/providers/notification-provider";
import { GiRunningShoe } from "react-icons/gi";

const NavBar: FC = () => {
  const { data: session } = useSession();
  const { unreadCount } = useNotification();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Получаем данные профиля
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (session?.accessToken) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/authentication/profile/`,
            {
              headers: {
                Authorization: `Bearer ${session.accessToken}`,
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            setUserProfile(data);
            console.log("User profile data:", data);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };

    fetchUserProfile();
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border-color">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Логотип */}
          <Link href="/" className="flex items-center space-x-2 group">
            <GiRunningShoe className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-200" />
            <div className="flex flex-col">
              <span className="text-xl font-semibold text-secondary tracking-tight">
                Shoe Master
              </span>
              <span className="text-xs text-gray-light -mt-1">
                Сервис ремонта обуви
              </span>
            </div>
          </Link>

          {/* Правая часть навбара */}
          <div className="flex items-center gap-6">
            {session ? (
              <>
                {/* Уведомления */}
                <Link
                  href="/notifications"
                  className="relative p-2 rounded-full hover:bg-gray-lighter transition-colors"
                >
                  <Bell className="w-6 h-6 text-secondary" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                {/* Заказы */}
                <Link
                  href="/orders"
                  className="text-secondary hover:text-primary transition-colors font-medium"
                >
                  Заказы
                </Link>

                {/* Профиль */}
                <div className="relative group">
                  <button className="flex items-center gap-2 p-1.5 rounded-full hover:ring-2 hover:ring-border-color transition-all">
                    <div className="w-9 h-9 rounded-full overflow-hidden shadow-[0_3px_10px_rgb(0,0,0,0.12)] hover:shadow-[0_3px_12px_rgb(0,0,0,0.2)] transition-shadow">
                      {userProfile?.image ? (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${userProfile.image}`}
                          alt="Фото профиля"
                          width={36}
                          height={36}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-lighter flex items-center justify-center">
                          <span className="text-secondary font-medium">
                            {session?.user?.email?.[0].toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                  </button>

                  {/* Выпадающее меню */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-card border border-border-color opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <div className="py-2">
                      <button
                        onClick={() => signOut()}
                        className="w-full px-4 py-2 text-left text-secondary hover:bg-gray-lighter transition-colors"
                      >
                        Выйти
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <Link href="/login" className="btn-primary">
                Войти
              </Link>
            )}
          </div>
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
