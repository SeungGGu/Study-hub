import React from 'react';
import {Link, useParams} from "react-router-dom";

export const StudySideBar = () => {
    return (
        <div style={{height: '100vh', overflowY: 'auto', backgroundColor: '#DADADA'}}>
            <ul className="nav flex-column">
                <li className="nav-item">
                    <Link to="/" className="nav-link">Home</Link>
                </li>
                <li className="nav-item">
                    <Link to="/about" className="nav-link">About</Link>
                </li>
                <li className="nav-item">
                    <Link to="/contact" className="nav-link">Contact</Link>
                </li>
            </ul>
        </div>
    );
}
