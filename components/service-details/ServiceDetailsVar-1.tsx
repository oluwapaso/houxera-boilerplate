"use client"

import { Helpers } from '@/_lib/helper';
import { showPageLoader } from '@/app/GlobalRedux/app/appSlice';
import ImageWithFallback from '@/components/ImageWithFallback';
import Modal from '@/components/modals/Modal';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { BiCalendar, BiRefresh, BiTrashAlt } from 'react-icons/bi';
import { BsEyeFill, BsGear } from 'react-icons/bs';
import { FaArrowLeftLong, FaComments, FaFacebook, FaLinkedin, FaWhatsapp } from 'react-icons/fa6';

import { BsTwitterX } from 'react-icons/bs';
import {
    EmailShareButton,
    FacebookShareButton,
    LinkedinShareButton,
    TwitterShareButton,
    WhatsappShareButton,
} from "react-share";
import SideAds from '@/components/ads/SideAds';
import { useNeighborhoodDetails } from '@/_hooks/useNeighborhoodDetails';

const helpers = new Helpers();
const ServiceDetailsVar1 = ({ is_theme = false, size = 20, raw_data = {} }: { is_theme?: boolean, size?: number, raw_data?: any }) => {

    var {
        slug,
        company_unique_id,
        channel_uid,
        neighInfo,
        neighInsight,
        neighProperties,
        neighInfoLoaded,
        neighInfoError,
        neighInfoComm,
        neighInfoCommLoaded,
        neighInfoCommError,
        skip,
        has_more,
        curr_no_comms,
        page_url,
        first_comp_pt,
        sectionHover,
        themeSett,
        menuRef,
        is_menu_shown,
        all_comments,
        share_title,
        router,

        // handlers
        dispatch,
        handleSettingsClick,
        handleCompPickerClick,
        handleHover,
        handleMouseExist,
        fetchMoreComments,
        BuildSearchLink,
        setIsMenuShown,
        setRepToAppend,
        setNoComms
    } = useNeighborhoodDetails({ is_theme, raw_data, component: "NeighborhoodDetailsVar1" });

    const [showModal, setShowModal] = useState(false);
    const [modal_children, setModalChildren] = useState({} as React.ReactNode);

    const closeModal = () => {
        setShowModal(false);

        const body = document.querySelector("body");
        if (body) {
            body.style.overflow = "auto";
        }
    }

    const crumb = <div className='font-play-fair-display text-4xl !text-white'>
        {
            neighInfoLoaded ? (
                neighInfo ? (
                    neighInfo.title
                ) : ""
            ) : ""
        }
    </div>;

    if (themeSett && themeSett != null) {
        return (
            <div className="flex flex-col min-h-screen relative" >

                {/**  ======================= Header Area Starts ====================== **/}
                <header className="w-full h-[85dvh] sm:h-[55dvh] bg-gray-100 relative">

                    <div data-has-bg="yes" className=" h-full flex flex-col justify-end pb-6 relative"
                        style={{
                            backgroundSize: `cover`,
                            backgroundPosition: `center`,
                            backgroundRepeat: `none`,
                            backgroundImage: `url(${(neighInfo.header_image_large && neighInfo.header_image_large != "")
                                ? `${neighInfo?.header_image_large}` : "../no-blog-image-added.png"})`, //Remove ../../, the  ../../ is added for testing
                        }}>

                        <div className={`container mx-auto max-w-[1200px] px-3 xl:px-0 text-left z-20 flex flex-col`}>
                            <div className={`w-full font-medium *:text-white xl:text-shadow-primary`}>{crumb}</div>
                            <div className={`w-full text-white line-clamp-2 `}>{neighInfo?.excerpt}</div>

                            <div className=' mt-8 flex flex-col md:flex-row space-y-2 justify-between'>
                                <div className=' flex flex-col sm:flex-row space-x-3.5 text-white *:flex *:items-center *:space-x-1.5 
                                *:shrink-0 flex--wrap'>
                                    <div className=''>
                                        <span className='font-semibold flex items-center space-x-2'>
                                            <BiCalendar size={18} />
                                            <span>Posted On:</span>
                                        </span>
                                        <time>{moment(neighInfo.date_added).format("MMMM DD, YYYY")}</time>
                                    </div>

                                    <div className=''>
                                        <span className='font-semibold flex items-center space-x-2'>
                                            <BsEyeFill size={18} />
                                            <span>Views:</span>
                                        </span>
                                        <span>{neighInfo.views || "0"}</span>
                                    </div>

                                    <div className=''>
                                        <span className='font-semibold flex items-center space-x-2'>
                                            <FaComments size={18} />
                                            <span>Comments:</span>
                                        </span>
                                        <span>{curr_no_comms || "0"}</span>
                                    </div>
                                </div>

                                <div className='justify-self-end ml-auto'>
                                    <div className={`bg-${themeSett?.primary_color} text-${themeSett.primary_button_text} w-fit px-5 
                                    py-2 flex items-center space-x-2 rounded cursor-pointer`}
                                        onClick={() => { dispatch(showPageLoader()); router.back(); }}>
                                        <FaArrowLeftLong size={18} />
                                        <span>Go Back</span>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="absolute w-full h-full bottom-0 z-10 bg-gradient-to-b from-transparent to-black from-20%"></div>
                    </div>

                    <div className="absolute top-0 w-full h-full z-10 bg-gradient-to-b from-transparent to-black/80 from-10%"></div>
                </header>
                {/**  ======================= Header Area Ends ====================== **/}

                <main className="w-full flex flex-col min-h-[55dvh]">
                    {/**  ======================= Content Area Starts ====================== **/}
                    <div className="w-full relative py-8 xl:py-16 px-4">
                        <div className="container mx-auto max-w-[1200px]">

                            {!neighInfoLoaded && <div className='col-span-full h-[250px] bg-white flex items-center justify-center'>
                                <AiOutlineLoading3Quarters size={30} className='animate animate-spin' />
                            </div>}

                            {(neighInfoLoaded && neighInfo) &&
                                <div className='w-full grid grid-cols-1 lg:grid-cols-6 gap-6 mt-0'>
                                    <div className='lg:col-span-4'>
                                        {neighInfoError == "" &&
                                            <div className='w-full'>

                                                <div className='w-full'>
                                                    <ImageWithFallback key={neighInfo.post_id} width={1250} height={400}
                                                        src={`${(neighInfo.header_image_large && neighInfo.header_image_large != "")
                                                            ? `${neighInfo?.header_image_large}` : "../no-blog-image-added.png"}`}
                                                        fallbackSrc={`../no-blog-image-added.png`} alt={neighInfo.post_title} />
                                                </div>

                                                <div className='w-full font-normal mt-3 overflow-x-hidden'>
                                                    <div className='w-full ck-content' dangerouslySetInnerHTML={{ __html: neighInfo.descriptions }} />
                                                </div>

                                                <div className='w-full my-1 py-2 border-b border-gray-200 text-gray-600 font-normal'>
                                                    Posted On <time>{moment(neighInfo.date_added).format("MMMM DD, YYYY")}</time>
                                                </div>

                                                <div className='mt-4 w-full font-medium'>Share This Page:</div>
                                                <div className={`w-full flex items-center *:flex *:items-center *:justify-center 
                                                space-x-2 flex-wrap *:mb-2`}>

                                                    <FacebookShareButton url={page_url} title={share_title} className='*:p-4 *:rounded-md *:cursor-pointer'>
                                                        <div className={`bg-${themeSett.primary_color}-100 text-${themeSett.primary_color}-600`}>
                                                            <FaFacebook size={30} />
                                                        </div>
                                                    </FacebookShareButton>

                                                    <TwitterShareButton url={page_url} title={share_title} className='*:p-4 *:rounded-md *:cursor-pointer'>
                                                        <div className={`bg-${themeSett.primary_color}-100 text-${themeSett.primary_color}-600`}>
                                                            <BsTwitterX size={30} />
                                                        </div>
                                                    </TwitterShareButton>

                                                    <LinkedinShareButton url={page_url} title={share_title} className='*:p-4 *:rounded-md *:cursor-pointer'>
                                                        <div className={`bg-${themeSett.primary_color}-100 text-${themeSett.primary_color}-600`}>
                                                            <FaLinkedin size={30} />
                                                        </div>
                                                    </LinkedinShareButton>

                                                    <WhatsappShareButton url={page_url} title={share_title} className='*:p-4 *:rounded-md *:cursor-pointer'>
                                                        <div className={`bg-${themeSett.primary_color}-100 text-${themeSett.primary_color}-600`}>
                                                            <FaWhatsapp size={30} />
                                                        </div>
                                                    </WhatsappShareButton>

                                                </div>

                                            </div>
                                        }

                                        {neighInfoError != "" &&
                                            <div className='col-span-full h-[150px] bg-white text-red-600 flex items-center justify-center'>
                                                {neighInfoError}
                                            </div>
                                        }
                                    </div>

                                    <div className='hidden-lg:block lg:col-span-2'>

                                        <div className='w-full flex flex-col space-y-8 *:border *:border-gray-100 *:shadow-lg'>
                                            <SideAds no_ads={4} />
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </main>

                <Modal show={showModal} children={modal_children} width={700} closeModal={closeModal} title=<div>Reply To Comment</div> />

                {is_theme && (
                    <div className=' absolute z-[1000] right-1.5 top-20 space-x-2 flex items-center justify-end *:bg-gray-800 
                    *:text-white *:flex *:items-center *:justify-center *:p-2 *:rounded *:cursor-pointer'>

                        <div id='editor_settings' className='hover:shadow-2xl relative group'
                            onClick={handleSettingsClick} onMouseOver={handleHover} onMouseOut={handleMouseExist}>
                            <BsGear size={17} />

                            <span className='absolute hidden whitespace-nowrap group-hover:block bottom-full px-2 py-2 w-fit rounded bg-gray-800 
                            text-white text-xs'>
                                Section settings
                            </span>
                        </div>

                        <div id='editor_settings' className='hover:shadow-2xl relative group'
                            onClick={() => handleCompPickerClick("CHANGE_LAYOUT")} onMouseOver={handleHover} onMouseOut={handleMouseExist}>
                            <BiRefresh size={17} />

                            <span className='absolute hidden whitespace-nowrap group-hover:block bottom-full px-2 py-2 w-fit rounded bg-gray-800 
                            text-white text-xs'>
                                Change Layout
                            </span>
                        </div>

                        <div id='editor_settings' className='hover:shadow-2xl relative group'
                            onClick={() => handleCompPickerClick("REMOVE_SECTION")} onMouseOver={handleHover} onMouseOut={handleMouseExist}>
                            <BiTrashAlt size={17} />

                            <span className='absolute hidden right-0 whitespace-nowrap group-hover:block bottom-full px-2 py-2 w-fit rounded bg-gray-800 
                            text-white text-xs'>
                                Remove Section Down
                            </span>
                        </div>

                    </div>
                )}
            </div>
        )
    }
}

export default ServiceDetailsVar1
