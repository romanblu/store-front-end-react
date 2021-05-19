import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router';
import './ProductPage.scss';
import Dropdown from '../../Dropdown/Dropdown';
import Gallery from '../../Gallery/Gallery';
import '../../../utils.scss';
import {getProduct, getImage, getProductImages} from '../../../api';

export default function ProductPage() {
    const [product, setProduct] = useState(null);
    const [images, setImages] = useState([])
    const [isFetching, setIsFetching] = useState(false);
    const [dropdowns, setDropdowns] = useState([]);
    const [variants, setVariants] = useState({ allVariants:[], refinedVariants:[], quantity: 1 });
    const [quantity, setQuantity] = useState(1);

    let {id } = useParams();

    useEffect(() => {
        setIsFetching(true);
        getProduct(id).then(prod => {
            console.log(prod.data.data)
            setProduct(prod.data.data);
            setDropdownsAttributes(prod.data.data);
            setVariants({allVariants: prod.data.data.variants, refinedVariants: prod.data.data.variants});

            Promise.all(getProductImages(prod)).then(imgs => {
                setImages(imgs);
                setIsFetching(false);

            }).catch(err => {
                const notFoundImage = {request:{responseURL: "https://www.kunena.org/docs/user/pages/10.troubleshooting/01.page-not-found/error-404.png"}}
                setImages([notFoundImage])
                setIsFetching(false);
                console.error(" Could not get images ",err)
            })
            
            
        }).catch(err => console.error("Could not get product ",err))
        
        
    }, []);

    const getProductPrice = () => {
        if(product.min_price === product.max_price){
            return `$${product.max_price}`;
        } else {
            return `$${product.min_price} - $${product.max_price}`;
        }
    }

    function fitAttributes(variant){
        let fit = true;
        variant.labels.forEach((label, i) =>{    
            const attributeForLabel = dropdowns.filter(attribute => attribute.id === label.attribute_id)
            console.log(attributeForLabel[0], attributeForLabel[0].labelId, label.label_id);

            if((attributeForLabel[0].labelId !== label.label_id) ){
                if(attributeForLabel[0].labelId){
                    console.log(false);
                    fit = false;
                }
            }
        })

        return fit;
    }

    function refineVariants(){
        let refine = variants.allVariants.filter(variant => fitAttributes(variant));
        setVariants({allVariants:variants.allVariants ,refineVariants:refine});
    }

    function setDropdownsAttributes(prod){
        

        // loop over all refined variants and add label_id to the array where key is att_id 
        // for every att_id set its dropdown 
        // if refined_variants.length == 1, set it to the product  

        setDropdowns(prod.attributes.map(att => (
            {
                id:att.id,
                title: att.title,
                value: "",
                labelId: null
            }
        )))
    }

    function changeDropdownValue(id, value, labelId){
        let dropdownValues = dropdowns;
        
        dropdownValues.map(drop => {
            if(drop.id === id){
                drop.value = value;
                drop.labelId = labelId;
            }
        })  

        setDropdowns(dropdownValues);
        refineVariants();
    }

    const generateDropdownMenus = () => {
        return product.attributes.map(att => (
             <Dropdown value={att.title} onChange={changeDropdownValue}  id={`${att.id}`} title={att.title} labels={att.labels} ></Dropdown>
        ))
    }
    
    let galleryView, productView, attributesView;
    if(images.length != 0 ){
        galleryView = <Gallery images={images} product={product}></Gallery>;
    }

    if(product != null ){
        productView = (
            <div className="product-content">
                <h1 className="product-title">{product.title}</h1>
                <p className="product-price">{getProductPrice()}</p>
                <p className="product-description">{product.description}</p>
            </div>
        );

        attributesView = generateDropdownMenus();
    }

    function addToCart(){
        console.log(product);

    }

    function addItem(){
        setQuantity(quantity + 1)

    }

    function subItem(){
        if(quantity > 0){
            setQuantity(quantity - 1)

        }
    }

    console.log("Quantity ",quantity);
    return (
        <div className="container">
            <div className="product-page">

                {galleryView}
                
                {productView}
                
                <div className="product-variants">
                    <div className="variants-dropdowns">
                        {attributesView}
                    </div>
                    <div className="product-quantity">
                        <p className="quantity-label">Quantity: </p>
                        <div className="quantity-picker">
                            <button onClick={subItem} className="quantity-button">-</button>
                            <input type="text" value={quantity}  className="quantity-input"/>
                            <button onClick={addItem} className="quantity-button">+</button>
                        </div>
                    </div>
                    <button onClick={addToCart} className="submit-button">Add To Cart</button>
                </div>
            </div>
        </div>
            
    )
}
