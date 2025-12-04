import MainNavigation from "../../components/layout/MainNavigation.tsx";
import {isRouteErrorResponse, useRouteError} from "react-router-dom";
import type {JSX} from "react";

/**
 * Error page component that handles and displays routing errors.
 * 
 * @component
 * @returns {JSX.Element} The rendered error page with navigation and error message
 * 
 * @description
 * This component:
 * - Catches routing errors using React Router's error boundary
 * - Displays user-friendly error messages based on HTTP status codes
 * - Handles custom error messages from route error responses
 * - Provides consistent error handling across the application
 * 
 * Supported HTTP status codes:
 * - 400: Invalid request
 * - 401: Unauthorized
 * - 403: Forbidden access
 * - 404: Page not found
 * - 500: Internal server error
 * - Others: Displays status code and status text
 * 
 * @example
 * // Route error boundary configuration
 * <Route
 *   path="/"
 *   element={<Root />}
 *   errorElement={<Error />}
 * />
 * 
 * @example
 * // Custom error with message
 * throw new Response("Custom error message", {
 *   status: 404,
 *   statusText: "Not Found"
 * });
 */
function Error() {
    const error = useRouteError();

    let content : JSX.Element = <p>Ocorreu um erro inesperado</p>;

    if (isRouteErrorResponse(error)) {
        let customMessage: string | null = null;

        if (error.data && typeof error.data === "object" && "message" in error.data) {
            customMessage = error.data.message;
        }

        if (customMessage) {
            content = <p>{customMessage}</p>;
        } else {
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
