
import type { LoaderFunctionArgs } from "react-router-dom";
import { queryClient } from "@/lib/queryClient";
import { animalsApi } from "@/api/animals";
import { ensureAuthHydrated } from "@/utils/authHelpers";
import { useAuthStore } from "@/stores/auth.store";
import axios from "axios";
import { redirect } from "react-router-dom";

/**
 * Loader for the Select Foster Value page.
 *
 * Requirements:
 * - User MUST be authenticated
 * - User MUST have role "User"
 * - Fetch the animal details using React Query
 */
export async function newFosteringLoader({ params }: LoaderFunctionArgs) {
  const animalId = params.animalId;

  if (!animalId) {
    throw new Response("Animal ID is required", { status: 400 });
  }

  // Ensure Zustand auth is hydrated
  await ensureAuthHydrated();

  const { user } = useAuthStore.getState();

  // If not authenticated → send to login
  if (!user) {
    throw redirect("/login");
  }

  // If authenticated but wrong role → send to animals
  if (user.role !== "User") {
    throw redirect("/animals");
  }

  try {
    return await queryClient.fetchQuery({
      queryKey: ["animals", animalId],
      queryFn: ({ signal }) =>
        animalsApi.getAnimalDetails({ id: animalId, signal }),
    });
  } catch (error) {
    const status = axios.isAxiosError(error)
      ? error.response?.status ?? 500
      : 500;

    throw new Response(
      JSON.stringify({ message: "Unable to load animal details." }),
      {
        status,
        statusText: "Loader Error",
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
