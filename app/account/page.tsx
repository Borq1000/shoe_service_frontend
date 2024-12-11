import Link from "next/link";

export default function AccountPage() {
  return (
    <div className="container mx-auto py-12 px-4 text-center">
      <h1 className="text-3xl font-bold mb-6">Личный кабинет</h1>
      <Link href="/orders">
        <a className="px-4 py-2 text-white bg-custom-red rounded-full hover:bg-red-600">
          Посмотреть мои заказы
        </a>
      </Link>
    </div>
  );
}
