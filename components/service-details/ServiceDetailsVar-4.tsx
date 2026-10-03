"use client"

import { Helpers } from '@/_lib/helper';
import { hidePageLoader, showPageLoader } from '@/app/GlobalRedux/app/appSlice';
import { AppDispatch, RootState } from '@/app/GlobalRedux/store';
import CommentBox from '@/components/blog-cards/CommentBox';
import CommentCardVar2 from '@/components/blog-cards/CommentCardVar-2';
import moment from 'moment';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { BiCalendarEvent, BiRefresh, BiTrashAlt } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';

import { BsEye, BsGear, BsTwitterX } from 'react-icons/bs';
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
import { GiChatBubble, GiEggEye, GiFlame } from 'react-icons/gi';
import BlogSearch from '../blog-cards/BlogSearch';
import BlogCategoryLists from '../blog-cards/BlogCategoryLists';
import { useNeighborhoodDetails } from '@/_hooks/useNeighborhoodDetails';
import RecommendedNeighborhood from '../neighborhood-cards/RecommendedNeighborhood';
import Modal from '../modals/Modal';
import { useServiceDetails } from '@/_hooks/useServiceDetails';

const helpers = new Helpers();
const BlogDetailsVar4 = ({ is_theme = false, size = 20, raw_data = {} }: { is_theme?: boolean, size?: number, raw_data?: any }) => {

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
    } = useServiceDetails({ is_theme, raw_data, component: "ServiceDetailsVar4" });

    if (themeSett && themeSett != null) {
        return (
            <div className={`min-h-screen bg-gray-100 relative ${first_comp_pt} pb-20 px-3`}>

                <div className='w-full h-[45dvh] grid grid-cols-1 tab:grid-cols-2 gap-0 relative'>

                    {/* Empty space */}
                    <div className='hidden tab:block'></div>

                    {/* Hero image */}
                    <div className=" col-span-1 w-full mx-auto h-full flex flex-col justify-end object-cover rounded-2xl overflow-hidden"
                        style={{
                            backgroundSize: `cover`,
                            backgroundPosition: `center`,
                            backgroundRepeat: `none`,
                            backgroundImage: `url(${(serviceInfo.header_image_large && serviceInfo.header_image_large != "")
                                ? `${serviceInfo?.header_image_large}` : "../no-blog-image-added.png"})`, //Remove ../../, the  ../../ is added for testing
                        }}>
                    </div>

                    <div className='w-full h-full absolute flex items-center justify-center'>
                        <div className='mx-auto w-[95%] tab:w-[75%] flex flex-col items-start justify-center h-full'>
                            <h1 className=" w-full text-2xl xs:text-3xl sm:text-4xl font-semibold sm:leading-snug text-gray-900">
                                <span className="bg-white leading-10 xs:leading-14 sm:leading-16 px-2 py-0.5 xs:py-1 [box-decoration-break:clone] [-webkit-box-decoration-break:clone]">
                                    {serviceInfo.title}
                                </span>
                            </h1>

                            <div className=' flex w-full space-x-1.5 2xs:space-x-3 *:bg-white *:px-3 2xs:*:px-4 *:py-2 *:rounded *:flex *:items-center'>
                                <div className='space-x-1.5'>
                                    <BiCalendarEvent size={15} />
                                    <span className='text-sm font-semibold'>{moment(serviceInfo.date_added).format("Do MMM, YYYY")}</span>
                                </div>

                                <div className='space-x-1.5'>
                                    <BsEye size={15} />
                                    <span className='text-sm font-semibold'>{serviceInfo.views || "0"}</span>
                                </div>

                                <div className='space-x-1.5'>
                                    <GiChatBubble size={15} />
                                    <span className='text-sm font-semibold'>{serviceInfo.comments || "0"}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Content wrapper with overlapping card */}
                <div className={`container mx-auto max-w-[1280px] mt-8`}>

                    <div className='w-full grid grid-cols-1 lg:grid-cols-6 gap-6 mt-0'>
                        <div className='lg:col-span-4'>
                            {/* Main article card */}
                            {serviceInfoError == "" &&
                                <div className="rounded-2xl bg-white p-5 shadow-xl ring-1 ring-gray-100 sm:p-8">
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
                        </div>

                        <div className='hidden lg:block lg:col-span-2'>
                            {(serviceInfoLoaded && serviceInfo) &&
                                <div className='w-full'>
                                    <RecommendedNeighborhood neighborhood_uid={serviceInfo?.neighborhood_uid} is_theme={is_theme} />
                                </div>
                            }

                            <div className='w-full mt-12 flex flex-col space-y-8 *:border *:border-gray-100 *:shadow-lg'>
                                <SideAds no_ads={4} />
                            </div>
                        </div>
                    </div>
                </div >

                {
                    is_theme && (
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
                    )
                }
            </div>
        )
    }
}

export default BlogDetailsVar4
