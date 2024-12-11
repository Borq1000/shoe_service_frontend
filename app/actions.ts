"use server";

export async function handleOrder(formData: FormData) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const token = formData.get("token");

  if (!token) {
    throw new Error("No authorization token provided");
  }

  try {
    const response = await fetch(`${baseUrl}/api/orders/client/orders/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Failed to create order" }));

      if (errorData.image) {
        throw new Error(
          Array.isArray(errorData.image) ? errorData.image[0] : errorData.image
        );
      }

      console.error("Order creation error:", errorData);
      throw new Error(errorData.message || "Failed to create order");
    }

    const data = await response.json();
    console.log("Order created successfully:", data);
    return data;
  } catch (error) {
    console.error("Error in handleOrder:", error);
    throw error;
  }
}
