import MainNavigation from "./MainNavigation.tsx";
import {Outlet} from "react-router-dom";
import styles from './MainLayout.module.css';


/**
 * MainLayout component that provides the main application layout structure.
 *
 * @component
 * @returns {JSX.Element} The main layout with navigation and outlet for child routes
 *
 * @description
 * This component serves as the root layout for the application, providing:
 * - Main navigation bar at the top (MainNavigation component)
 * - Main content area that renders child routes via React Router's Outlet
 *
 * Features:
 * - Consistent layout across all pages
 * - Integration with React Router for nested routing
 * - Semantic HTML structure with main element
 *
 * @example
 * // Route configuration
 * <Route element={<MainLayout />}>
 *   <Route path="/" element={<Home />} />
 *   <Route path="/animals" element={<Animals />} />
 *   <Route path="/animals/:animalId" element={<AnimalDetail />} />
 * </Route>
 *
 * @example
 * // In router setup
 * const router = createBrowserRouter([
 *   {
 *     element: <MainLayout />,
 *     errorElement: <Error />,
 *     children: [
 *       { path: "/", element: <Home /> },
 *       { path: "/animals", element: <Animals /> }
 *     ]
 *   }
 * ]);
 */
function MainLayout() {
    return (
        <div className={styles.layout}>
            {/* Background fixo que fica atrás de tudo */}
            <div className={styles.backgroundWrapper} />

            {/* Conteúdo que flutua sobre o fundo */}
            <div className={styles.contentWrapper}>
                <MainNavigation />
                <main className={styles.mainContent}>
                    <Outlet/>
                </main>
            </div>
        </div>
    );
}

export default MainLayout;
