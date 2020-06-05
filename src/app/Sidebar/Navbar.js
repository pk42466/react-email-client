import React from 'react';
import Footer from '../footer/Footer';
import './navbar.css';

export default function SideNavbar(props) {
    const links = [];
    const currentRoute = '/sent';
    if (props.items) {
        for (const i in props.items) {
            const item = props.items[i];
            links.push(
                <li key={i}>
                    <a href={item.url} className={currentRoute === item.url ? "active" : ""}>
                        {item.category}
                        <span className="count">{item.count}</span>
                    </a>
                </li>
            );
        }
    }
    return <React.Fragment>
        <nav className="nav-bar">
            <ul>
                {links}
            </ul>
            <Footer />
        </nav>
    </React.Fragment>
}