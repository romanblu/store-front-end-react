import React, { useState , useEffect} from 'react';
import { Redirect, useHistory } from "react-router-dom";
import './ProductListing.scss';
import {getImage} from '../../api';

export default function ProductListing(props) {
    
    // const isDiscounted = props.productDetails.min_price === props.productDetails.max_price;
    const [productImage, setProductImage] = useState("");
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        getImage(props.productDetails.images[0].url).then(res => {
            setProductImage(res.request.responseURL);
        });  
       
    }, [])

    let history = useHistory();

    function redirectToProductPage(){
        setRedirect(true);
    }

    return (
        <div className="product-listing">
            

            <div className="product-image">
                {props.specialOffer ? <div className="special-offer"><p>Special Offer</p></div> : ""}
                
                <img src={productImage} alt="Product image" onClick={redirectToProductPage} />
            </div>
            {
                redirect ? <Redirect to={`product/${props.productDetails.id}`}  ></Redirect> : ""
            }

            <p className="product-title">{props.productDetails.title}</p>
            <div className="product-price">
                <p className={`regular-price ${props.productDetails.min_price !== props.productDetails.max_price ? "crossed light-gray" : ""}`} >${props.productDetails.max_price}</p>

                {props.productDetails.min_price !== props.productDetails.max_price ? <p className="discount-price">${props.productDetails.min_price}</p> : ""}
            </div>

        </div>
    )
}
