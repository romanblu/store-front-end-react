import React from 'react'
import './PageTitle.scss';

export default function PageTitle(props) {
    return (
            <div className="page-title">
                    <div className="rectangle"></div>
                    <h1>{props.title}</h1>
            </div>
                
    )
}
