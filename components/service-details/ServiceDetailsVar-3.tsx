"use client"

import { Helpers } from '@/_lib/helper';
import CommentBox from '@/components/blog-cards/CommentBox';
import CommentCardVar2 from '@/components/blog-cards/CommentCardVar-2';
import moment from 'moment';
import React, { useState } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { BiRefresh, BiTrashAlt } from 'react-icons/bi';

import { BsGear, BsTwitterX } from 'react-icons/bs';
import {
    EmailShareButton,
    FacebookShareButton,
    LinkedinShareButton,
    TwitterShareButton,
    WhatsappShareButton,
} from "react-share";
import ReplyComment from '@/components/modals/ReplyComment';
import SideAds from '@/components/ads/SideAds';
import { CiShare2 } from 'react-icons/ci';
import { FaFacebook, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import { GiFlame } from 'react-icons/gi';
import Modal from '../modals/Modal';
import RecommendedNeighborhood from '../neighborhood-cards/RecommendedNeighborhood';
import { useNeighborhoodDetails } from '@/_hooks/useNeighborhoodDetails';
import { useServiceDetails } from '@/_hooks/useServiceDetails';

const helpers = new Helpers();
const ServiceDetailsVar3 = ({ is_theme = false, size = 20, raw_data = {} }: { is_theme?: boolean, size?: number, raw_data?: any }) => {

    var {
        serviceInfo,
        serviceInfoLoaded,
        serviceInfoError,
        themeSett,
        first_comp_pt,

        // handlers 
        dispatch,
        handleSettingsClick,
        handleCompPickerClick,
        handleHover,
        handleMouseExist,
    } = useServiceDetails({ is_theme, raw_data, component: "ServiceDetailsVar3" });


    if (themeSett && themeSett != null) {
        return (
            <div className={`min-h-screen bg-gray-100 relative ${first_comp_pt} pb-20 px-3`}>

                <div className='py-4 flex flex-col items-center justify-center'>
                    <h1 className=" w-full max-w-[650px] text-center text-3xl font-bold leading-snug text-gray-900 sm:text-3xl">
                        {serviceInfo.title}
                    </h1>
                </div>

                {/* Hero image */}
                <header className="w-full h-[45dvh] sm:h-[65dvh] relative z-1 overflow-hidden">
                    <div className=" w-full max-w-[1280px] rounded-2xl mx-auto h-full flex flex-col justify-end object-cover"
                        style={{
                            backgroundSize: `cover`,
                            backgroundPosition: `center`,
                            backgroundRepeat: `none`,
                            backgroundImage: `url(${(serviceInfo.header_image_large && serviceInfo.header_image_large != "")
                                ? `${serviceInfo?.header_image_large}` : "../no-blog-image-added.png"})`, //Remove ../../, the  ../../ is added for testing
                        }}>
                    </div>
                </header>

                {/* Content wrapper with overlapping card */}
                <div className={`container mx-auto max-w-[1280px] mt-8 `}>
                    {/* Main article card */}
                    {serviceInfoError == "" &&
                        <div className="rounded-2xl bg-white px-3 2xs:px-5 py-5 shadow-xl ring-1 ring-gray-100 sm:p-8">
                            <div className="w-full font-normal space-y-4 text-sm leading-relaxed text-gray-600 sm:text-base overflow-x-hidden">
                                <div className='w-full ck-content' dangerouslySetInnerHTML={{ __html: serviceInfo.descriptions }} />
                            </div>
                        </div>
                    }

                    {serviceInfoError != "" &&
                        <div className='col-span-full h-[150px] bg-white text-red-600 flex items-center justify-center'>
                            {serviceInfoError}
                        </div>
                    }

                    <div className='w-full mt-15'>
                        <div className='col-span-full text-xl flex items-center space-x-2.5'>
                            <GiFlame size={20} /> <span>Hot Properties</span>
                        </div>

                        <div className='w-full mt-1 grid grid-cols-3 gap-5 *:border *:border-gray-100 *:shadow-lg'>
                            <SideAds no_ads={4} />
                        </div>
                    </div>
                </div>


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

export default ServiceDetailsVar3
