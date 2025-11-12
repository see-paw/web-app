import MainNavigation from "../../components/layout/MainNavigation.tsx";
import {isRouteErrorResponse, useRouteError} from "react-router-dom";
import type {JSX} from "react";

function Error() {
    const error = useRouteError();

    let content : JSX.Element = <p>Unknown Error</p>;

    if (isRouteErrorResponse(error)) {
        switch (error.status) {
            case 400:
                content = <p>Pedido inválido</p>;
                break;
            case 401:
                content = <p>Não autorizado</p>;
                break;
            case 403:
                content = <p>Acesso proibido</p>;
                break;
            case 404:
                content = <p>Página não encontrada</p>;
                break;
            case 500:
                content = <p>Erro interno do servidor</p>;
                break;
            default:
                content = (
                    <p>
                        Erro inesperado ({error.status}) — {error.statusText || "Sem descrição"}
                    </p>
                );
                break;
        }
    } else if (error instanceof Error) {
        const typedError = error as Error;
        content = <p>{typedError.message || "Erro inesperado."}</p>;
    }

    return (
        <>
            <MainNavigation/>
            <main>
                <h1>Ocorreu um erro!</h1>
                {content}
            </main>
        </>
    );
}

export default Error;