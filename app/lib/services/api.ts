import { Service } from "./types";

export const getService = async (slug: string): Promise<Service> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const url = `${baseUrl}/api/services/services/${slug}`;

  console.log("Fetching service from:", url);

  try {
    const response = await fetch(url);
    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log("Error response:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Service data:", data);
    return data;
  } catch (error) {
    console.error("Error in getService:", error);
    throw error;
  }
};

export const getServices = async (): Promise<Service[]> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const response = await fetch(`${baseUrl}/api/services/services/`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};
