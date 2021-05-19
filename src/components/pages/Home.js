import React, {useState, useEffect} from 'react'
import './Home.scss';
import './../../utils.scss';

import ProductListing from '../ProductListing/ProductListing';
import PageTitle from '../PageTitle/PageTitle';

import {getAll} from '../../api';

export default function Home(props) {
    const [allProducts, setAllProducts] = useState([]);
    let ProductsListings = [];

    useEffect(() => {
         getAll().then(res => setAllProducts(res.data.data)).catch(err => console.error(err));
    }, []);


    if(allProducts.length != 0){
        ProductsListings = allProducts.map((product,index) => (    
            <ProductListing key={index} productDetails={product} ></ProductListing>
        ));
    }
    
    return (
        <div className="container">
            <div className="page-header">
                <PageTitle title="PRODUCTS"></PageTitle>
            </div>

            <div className="listings-container">
               
                {ProductsListings}

            </div>
            <div className="page-navigation">
                <a href="#" className="navigation-prev">&#60; Prev</a>
                <div className="page-values">
                    <a href="#" className="page-number current-page">1</a>
                    <a href="#" className="page-number light-gray" >2</a>
                    <a href="#" className="page-number light-gray" >3</a>
                    <a href="#" className="page-number light-gray">4</a>
                    <a href="#" className="page-number light-gray">5</a>
                </div>
                <a href="#" className="navigation-next">Next &#62;</a>
            </div>


        </div>
    )
}
