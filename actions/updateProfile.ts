"use server";

import { auth } from "@/auth";

export async function updateProfile(formData: { [key: string]: any }) {
  const session = await auth();

  if (!session) {
    throw new Error("Authentication required");
  }

  const response = await fetch(
    "http://127.0.0.1:8000/authentication/profile/",
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    }
  );

  // Отладочные сообщения для проверки ответа сервера
  console.log("Response status:", response.status);
  const responseText = await response.text();
  console.log("Response text:", responseText);

  if (!response.ok) {
    throw new Error(`Failed to update profile: ${responseText}`);
  }

  return JSON.parse(responseText);
}
