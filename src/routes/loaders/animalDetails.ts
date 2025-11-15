import type {LoaderFunctionArgs} from "react-router-dom";
import {queryClient} from "@/lib/queryClient";
import {animalsApi} from "@/api/animals";
import axios from "axios";

export async function animalDetailsLoader({params }: LoaderFunctionArgs)  {
    const id = params.animalId;

    if (!id) {
        //Um loader não devolve um Response com return, ele “atira” um Response para ser apanhado pelo errorBoundary da rota.
        throw new Response("Animal ID não fornecido", { status: 400 });
    }

    try{
        return await queryClient.fetchQuery({
            queryKey:["animals", id],
            queryFn:({signal})=>animalsApi.getAnimalDetails({id, signal}),

        })
    }
    catch(error){
        const status = axios.isAxiosError(error) ? error.response?.status ?? 500:500;
        throw new Response(JSON.stringify({ message: "Não foi possível carregar o animal." }), {
            status,
            statusText: "Loader Error",
            headers: { "Content-Type": "application/json" },
        });
    }
}