import LoginForm from "@/components/LoginForm";
import Link from "next/link";
import { GiRunningShoe } from "react-icons/gi";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gray-lighter flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-[400px] space-y-8">
        {/* Логотип и заголовок */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <GiRunningShoe className="w-10 h-10 text-primary" />
            <div className="flex flex-col items-start">
              <span className="text-2xl font-semibold text-secondary tracking-tight">
                Shoe Master
              </span>
              <span className="text-sm text-gray-light -mt-1">
                Сервис ремонта обуви
              </span>
            </div>
          </div>
          <h2 className="text-3xl font-semibold text-secondary">
            Добро пожаловать
          </h2>
          <p className="mt-2 text-gray-light">
            Войдите в свой аккаунт, чтобы продолжить
          </p>
        </div>

        {/* Форма */}
        <div className="bg-white p-8 rounded-xl shadow-card">
          <LoginForm />

          <div className="mt-6 text-center">
            <Link
              href="/reset-password"
              className="text-primary hover:text-primary-dark transition-colors text-sm"
            >
              Забыли пароль?
            </Link>
          </div>
        </div>

        {/* Регистрация */}
        <div className="text-center text-sm">
          <span className="text-gray-light">Еще нет аккаунта? </span>
          <Link
            href="/register"
            className="text-primary hover:text-primary-dark transition-colors font-medium"
          >
            Зарегистрироваться
          </Link>
        </div>
      </div>
    </main>
  );
}
