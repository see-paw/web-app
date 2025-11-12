import {type LoaderFunctionArgs, redirect} from "react-router-dom";
import axios from "axios";
import {animalsApi} from "../../api/animals.ts";

export async function animalsLoader({ request }: LoaderFunctionArgs)  {
    const url = new URL(request.url);
    const page = url.searchParams.get("page");

    if (!page) {
        url.searchParams.set("page", "1");
        throw redirect(url.pathname + "?" + url.searchParams.toString());
    }

    try {
        return await animalsApi.getAnimals(page);
    } catch (err) {
        const status = axios.isAxiosError(err) ? err.response?.status ?? 500 : 500;

        throw new Response(JSON.stringify({ message: "Não foi possível carregar os animais." }), {
            status: status,
            headers: { "Content-Type": "application/json" },
        });
    }
}