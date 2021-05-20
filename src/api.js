import axios from 'axios';

const url = "https://fedtest.monolith.co.il/api/";

function getAll() {
     return axios.get(url + '/catalog/getAll');
   
}

function getProduct(id) {
    return axios.get(url + 'catalog/get/?id='+id);
}

function getImage(imageUrl){
    return axios.get(`https://cors-anywhere.herokuapp.com/https://fedtest.monolith.co.il/api/imager.php?url=${imageUrl}&type=fit&width=1000&height=1000&quality=70`);
}

function getProductImages(product){
    
    let promises = [];
    product.data.data.images.map(image => (
        promises.push(getImage(image.url) ))
    )
    return promises;
}

function addToCart(variant_id, quantity){
    return axios.get(`https://fedtest.monolith.co.il/api/cart/add?variant_id=${variant_id}&quantity=${quantity}`);
}

export {getAll, getProduct, getImage, getProductImages, addToCart};