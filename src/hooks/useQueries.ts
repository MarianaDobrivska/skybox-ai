import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import CustomNotification from "@/components/CustomNotification";

export async function fetchData(endpoint: string) {
  const response = await fetch(`/api/${endpoint}`);
  if (!response.ok) {
    toast(CustomNotification, {
      data: {
        title: "Sorry! Something went wrong",
        content: response.statusText ?? "Please try again later",
      },
      ariaLabel: "Something went wrong",
      autoClose: 5000,
    });
    throw new Error(response.statusText ?? "Something went wrong");
  }
  return response.json();
}

export function useImagesList() {
  return useQuery({
    queryKey: ["images"],
    queryFn: () => fetchData("images"),
  });
}

export function useImage(id: string) {
  return useQuery({
    queryKey: ["image", id],
    queryFn: () => fetchData(`image/${id}`),
    enabled: !!id,
  });
}
