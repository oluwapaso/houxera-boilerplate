"use client"

import { Helpers } from '@/_lib/helper';
import { showPageLoader } from '@/app/GlobalRedux/app/appSlice';
import ImageWithFallback from '@/components/ImageWithFallback';
import moment from 'moment';
import React, { useState } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { BiCalendar, BiRefresh, BiTrashAlt } from 'react-icons/bi';
import { BsEyeFill, BsGear } from 'react-icons/bs';
import { FaArrowLeftLong } from 'react-icons/fa6';

import SideAds from '@/components/ads/SideAds';
import { useServiceDetails } from '@/_hooks/useServiceDetails';

const ServiceDetailsVar1 = ({ is_theme = false, size = 20, raw_data = {} }: { is_theme?: boolean, size?: number, raw_data?: any }) => {

    var {
        slug,
        company_unique_id,
        channel_uid,
        serviceInfo,
        serviceInfoLoaded,
        serviceInfoError,
        first_comp_pt,
        themeSett,
        router,

        // handlers 
        dispatch,
        handleSettingsClick,
        handleCompPickerClick,
        handleHover,
        handleMouseExist,
    } = useServiceDetails({ is_theme, raw_data, component: "ServiceDetailsVar1" });

    const crumb = <div className='font-play-fair-display text-4xl !text-white'>
        {
            serviceInfoLoaded ? (
                serviceInfo ? (
                    serviceInfo.title
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
                            backgroundImage: `url(${(serviceInfo.header_image_large && serviceInfo.header_image_large != "")
                                ? `${serviceInfo?.header_image_large}` : "../no-blog-image-added.png"})`, //Remove ../../, the  ../../ is added for testing
                        }}>

                        <div className={`container mx-auto max-w-[1200px] px-3 xl:px-0 text-left z-20 flex flex-col`}>
                            <div className={`w-full font-medium *:text-white xl:text-shadow-primary`}>{crumb}</div>
                            <div className={`w-full text-white line-clamp-2 mb-4 `}>{serviceInfo?.excerpt}</div>
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

                            {!serviceInfoLoaded && <div className='col-span-full h-[250px] bg-white flex items-center justify-center'>
                                <AiOutlineLoading3Quarters size={30} className='animate animate-spin' />
                            </div>}

                            {(serviceInfoLoaded && serviceInfo) &&
                                <div className='w-full grid grid-cols-1 lg:grid-cols-6 gap-6 mt-0'>
                                    <div className='lg:col-span-4'>
                                        {serviceInfoError == "" &&
                                            <div className='w-full'>

                                                <div className='w-full'>
                                                    <ImageWithFallback key={serviceInfo.post_id} width={1250} height={400}
                                                        src={`${(serviceInfo.header_image_large && serviceInfo.header_image_large != "")
                                                            ? `${serviceInfo?.header_image_large}` : "../no-blog-image-added.png"}`}
                                                        fallbackSrc={`../no-blog-image-added.png`} alt={serviceInfo.post_title} />
                                                </div>

                                                <div className='w-full font-normal mt-3 overflow-x-hidden'>
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
