import {NavLink} from "react-router-dom";

type LinkType = { title: string; path: string; end?: boolean };

function NavBar({ links }: { links : LinkType[] }) {
    return (
        <nav>
            <ul>
                {links.map(({title, path, end = false}, index) => (
                    <li key={index}>
                        <NavLink to={`/${path}`} end={end}>{title}</NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export type { LinkType };

export default NavBar;