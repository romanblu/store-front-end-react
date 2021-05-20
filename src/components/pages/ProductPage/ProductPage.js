import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router';
import './ProductPage.scss';
import Dropdown from '../../Dropdown/Dropdown';
import Gallery from '../../Gallery/Gallery';
import '../../../utils.scss';
import {getProduct, getImage, getProductImages, addToCart} from '../../../api';

export default function ProductPage() {
    const [product, setProduct] = useState(null);
    const [images, setImages] = useState([])
    const [isFetching, setIsFetching] = useState(false);
    const [dropdowns, setDropdowns] = useState([]);
    const [variants, setVariants] = useState({ allVariants:[], refinedVariants:[], quantity: 1 });
    const [quantity, setQuantity] = useState(1);
    const [chosenVariant, setChosenVariant] = useState(null);

    let {id } = useParams();

    useEffect(() => {
        setIsFetching(true);
        getProduct(id).then(prod => {
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

            if((attributeForLabel[0].labelId !== label.label_id) ){
                if(attributeForLabel[0].labelId){
                    fit = false;
                }
            }
        })

        return fit;
    }

    function refineVariants(){
        let refine = variants.allVariants.filter(variant => fitAttributes(variant));
        setVariants({allVariants:variants.allVariants ,refinedVariants:refine});
        setDropdownsAttributes(product);
        if(refine.length == 1){
            setVariantAsProduct(refine[0]);
        }

    }

    function setVariantAsProduct(variant){
        getImage(variant.image.url).then(res => {
            setChosenVariant({
                image: res,
                title: variant.title,
                price: variant.price
            })
            
        })
    }

    function setDropdownsAttributes(prod){

        let attributesLabels = [];
        variants.refinedVariants.map(variant => {
            variant.labels.map(label => {
                attributesLabels.push(label);
            });
        });
        
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

    function getRefinedLabelsForAttribute(attribute){
        let labels = []
        variants.refinedVariants.map(variant => {
            variant.labels.map(label => {
                labels.push({attId: label.attribute_id, labelId: label.label_id});
            })
        })
        return labels.filter(label => label.attId == attribute.id)                
    }


    function getAvailableLabels(attribute){
        let labels = []
        let refinedLabels = getRefinedLabelsForAttribute(attribute);
        
        
        attribute.labels.map(label => {
            let ab = refinedLabels.filter(refinedLabel => refinedLabel.labelId === label.id );
            if(ab.length != 0){
                labels.push(label)
            }
        });
        return labels;
    }

    const generateDropdownMenus = () => {
        getAvailableLabels(product.attributes[0])
        return product.attributes.map((att) => (
             <Dropdown value={att.title} onChange={changeDropdownValue}  id={`${att.id}`} title={att.title} labels={getAvailableLabels(att)} ></Dropdown> 
        ))
    }
    
    let galleryView, productView, attributesView;
    
    if(chosenVariant){
        
        galleryView = <Gallery images={chosenVariant.image} ></Gallery>;
    } else if(images.length !== 0 ){
        galleryView = <Gallery images={images} ></Gallery>;
    }

    if(product != null ){
        let title, price, description;
        title = product.title;
        price = getProductPrice();
        description = product.description;

        if(chosenVariant){
            title = chosenVariant.title
            description = "";
            price = `$${chosenVariant.price * quantity}`;
        }
        productView = (
            <div className="product-content">
                <h1 className="product-title">{title}</h1>
                <p className="product-price">{price}</p>
                <p className="product-description">{description}</p>
            </div>
        );

        attributesView = generateDropdownMenus();
    }

    function addItemToCart(){
        if(variants.refinedVariants.length === 1){
            const variant = variants.refinedVariants[0];
            addToCart(variant.id, quantity);
            const productAddedMessage = quantity === 1 ? `${variant.title} Added To Cart For Total of $${variant.price}` 
            : `${variant.title} x ${quantity} Added To Cart For Total of $${variant.price * quantity}` ;
            alert(productAddedMessage );
        }
    }

    function addItem(){
        setQuantity(quantity + 1)

    }

    function subItem(){
        if(quantity > 0){
            setQuantity(quantity - 1) 

        }
    }

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
                    <button onClick={addItemToCart} className="submit-button">Add To Cart</button>
                </div>
            </div>
        </div>
            
    )
}
