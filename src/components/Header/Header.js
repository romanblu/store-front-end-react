import React from 'react'
import './Header.scss';

export default function Header() {
    return (
        <div>
            <div className="header head-bar-copy">
                <div className="header-top ">
                    <div  className="spectrum">
                        <a href="/"> SPECTR<span className="text-style-1">U</span>M</a>
                    </div>
                    
                </div>
                <div className="header-bottom container">
                     <a href="/" className="header-page">HOME</a>
                </div>
            </div>
            
        </div>
    )
}
