"use server";

import { auth } from "@/auth";

export async function getProfile() {
  const session = await auth();

  if (!session) throw new Error("Authentication required");

  const response = await fetch(
    "http://127.0.0.1:8000/authentication/profile/",
    {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    }
  );

  if (!response.ok) throw new Error("Failed to fetch profile");

  return response.json();
}
