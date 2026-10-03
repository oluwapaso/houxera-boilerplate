"use client"

import React from 'react'
import { BiRefresh, BiTrashAlt } from 'react-icons/bi';

import { BsGear } from 'react-icons/bs';
import SideAds from '@/components/ads/SideAds';
import { GiFlame } from 'react-icons/gi';
import { useServiceDetails } from '@/_hooks/useServiceDetails';

const ServiceDetailsVar2 = ({ is_theme = false, size = 20, raw_data = {} }: { is_theme?: boolean, size?: number, raw_data?: any }) => {

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
    } = useServiceDetails({ is_theme, raw_data, component: "ServiceDetailsVar2" });



    if (themeSett && themeSett != null) {
        return (
            <div className={`min-h-screen bg-gray-100 relative ${first_comp_pt} pb-20`}>

                {/* Hero image */}
                <header className="w-full h-[45dvh] relative z-1 overflow-hidden">
                    <div className=" w-[96%] max-w-[1450px] rounded-2xl mx-auto h-full flex flex-col justify-end object-cover"
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
                <div className={`container mx-auto max-w-[1280px] relative px-3 sm:px-6 lg:px-8 z-2 -mt-14`}>
                    {/* Main article card */}
                    {serviceInfoError == "" &&
                        <div className="rounded-2xl bg-white px-3 2xs:px-5 py-5 shadow-xl ring-1 ring-gray-100 sm:p-8">
                            <h1 className=" text-2xl font-bold leading-snug text-gray-900 sm:text-3xl">
                                {serviceInfo.title}
                            </h1>

                            <div className="w-full font-normal mt-8 space-y-4 text-sm leading-relaxed text-gray-600 sm:text-base overflow-x-hidden">
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

export default ServiceDetailsVar2
