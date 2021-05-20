import React, {useState, useEffect} from 'react'
import './Gallery.scss';
export default function Gallery(props) {

    const [galleryImages, setGalleryImages] = useState({mainImage: null , secondaryImages:[]})

    const {images} = props;

    useEffect(() => {
       setGalleryImages({
           mainImage: images[0],
           secondaryImages:images.slice(1)
       })

    }, [])

    function swapImages(e){
        const clickedImage = e.target.src ;

        let tempImages = galleryImages.secondaryImages;
        let clickedImageTemp ;
        tempImages.map((image, index) => {
            if(image.request.responseURL === clickedImage){
                clickedImageTemp = image;
                tempImages[index] = galleryImages.mainImage;
            }
        })
        setGalleryImages({
            mainImage: clickedImageTemp,
            secondaryImages: tempImages
        })

    }


    if(galleryImages.mainImage != null){
        return (
            <div className="product-gallery"> 
                <img  src={ galleryImages.mainImage.request.responseURL } alt={"main image"} className="gallery-image main-image" />

                <div className="gallery">
                    {
                        galleryImages.secondaryImages.map((image, index) => {
                            
                            return (<img key={index} onClick={swapImages} src={image.request.responseURL} alt={"secondary image"} className="gallery-image" />);
                        })
                    }

                </div>
            </div>
        )
    }else {
        return (
            <div className="product-gallery"> 
            
                <h1>Waiting for images</h1>
            </div>
        )
    }
}
