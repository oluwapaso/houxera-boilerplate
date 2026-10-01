"use client";

import { MdChevronLeft, MdChevronRight, MdClose } from "react-icons/md";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// ===== Custom Arrow Components =====
function NextArrow(props: any) {
    const { onClick } = props;
    return (
        <button onClick={onClick}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 text-white 
            rounded-full p-2 md:p-3  transition-all duration-300 hover:scale-110" aria-label="Next image">
            <MdChevronRight size={28} />
        </button>
    );
}

function PrevArrow(props: any) {
    const { onClick } = props;
    return (
        <button onClick={onClick} className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50  
        hover:bg-black/80 text-white rounded-full p-2 md:p-3   transition-all duration-300 hover:scale-110"  aria-label="Previous image" >
            <MdChevronLeft size={28} />
        </button>
    );
}

function Gallery({ photos, show, closeGallery, initialSlide }: { photos: any[], show: boolean, closeGallery: () => void, initialSlide: number }) {

    let infinite = false;
    if (Array.isArray(photos) && photos.length > 1) {
        infinite = true;
    }

    const settings = {
        dots: true,
        arrows: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: false,
        focusOnSelect: true,
        infinite: infinite,
        initialSlide: initialSlide,
        nextArrow: <NextArrow />,   // ← custom next
        prevArrow: <PrevArrow />,   // ← custom prev
    };

    let slides: React.JSX.Element[] = [];
    if (Array.isArray(photos) && photos.length) {
        slides = photos.map((image, index) => (
            <div key={index} className='relative flex items-center justify-center'>
                <img src={`${(image && image != "") ? image : "/no-blog-image-added.png"}`} alt={`Alt here`}
                    onError={(e: any) => { e.target.onerror = null; e.target.src = `/no-blog-image-added.png`; }}
                    className={`w-auto h-[40vh] md:h-[60vh] lg:h-[70vh] m-auto`}
                />
            </div>
        ));
    } else {
        slides.push(<div className='relative'>
            <img src="../../loading-photos-from-mls-1.png" alt={`Alt here`} onError={(e: any) => {
                e.target.onerror = null;
                e.target.src = `../../loading-photos-from-mls-1.png`;
            }} className={`w-full h-full object-cover z-10 relative`} />
        </div>)
    }

    return (
        show && (
            <dialog className="gallery fixed left-0 top-0 w-full h-full bg-black/60 bg-opacity-50 z-50 overflow-y-auto overflow-x-hidden
            backdrop-blur flex justify-center items-center">
                <div className={`bg-transparent m-auto relative rounded w-full h-full flex items-center justify-center`}>
                    <div className="flex justify-center items-center cursor-pointer self-start absolute top-2 right-2 hover:scale-125
                      z-20 duration-300" onClick={closeGallery}>
                        <MdClose size={35} className="font-bold text-white" />
                    </div>
                    <div className="z-10 flex items-center w-full h-[40vh] md:h-[60vh] lg:h-[70vh] mt-2 mb-2 relative overflow--hidden">
                        <div className="absolute w-full h-full">
                            <Slider {...settings} lazyLoad="ondemand" className="w-full">
                                {slides}
                            </Slider>
                        </div>
                    </div>
                </div>
            </dialog>
        )
    );
}

export default Gallery;