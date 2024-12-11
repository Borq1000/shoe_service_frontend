import { getProfile } from "@/actions/getProfile";

export default async function ProfilePage() {
  const profile = await getProfile();

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Профиль</h1>
      <p className="text-lg mb-4">Имя: {profile.first_name}</p>
      <p className="text-lg mb-4">Фамилия: {profile.last_name}</p>
      <p className="text-lg mb-4">Телефон: {profile.phone}</p>
      <p className="text-lg mb-4">Email: {profile.email}</p>
      <a href="#" className="text-blue-600 underline mt-4">
        Поменять пароль
      </a>
    </div>
  );
}
