'use client';

import React, { useEffect, useState } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/GlobalRedux/store';
import CustomLinkMain from '../CustomLink';
import { FaArrowRightLong } from 'react-icons/fa6';
import { Helpers } from '@/_lib/helper';
import DynamicIcon from '../DynamicIcon';
import { BiLayerPlus, BiRefresh, BiTrash } from 'react-icons/bi';
import { BsArrowDown, BsArrowUp, BsGear } from 'react-icons/bs';
import OurServicesCardVar2 from '../our-services-cards/OurServicesCardVar-2';

const helpers = new Helpers();
const OurServicesVar2 = ({ is_theme = false, size = 4, raw_data = {} }: { is_theme?: boolean, size?: number, raw_data?: any }) => {

    const theme = useSelector((state: RootState) => state.theme);
    const user = useSelector((state: RootState) => state.user);
    const [themeSett, setThemeSett] = useState<any | null>(null);

    const [services, setServices] = useState<any[]>([]);
    const [servicesLoaded, setServicesLoaded] = useState<boolean>(false);
    const [servicesError, setServicesError] = useState("");
    const [sectionHover, setSectionHover] = useState<boolean>(false);

    const handleSettingsClick = () => {
        // Send a message to the parent window
        window.parent.postMessage(
            {
                type: 'OPEN_EDITOR_SETTINGS',
                data: {
                    "category": "our_services",
                    "type": "section",
                    "component": "OurServicesVar2",
                    ...raw_data,
                }
            },
            '*' // In production, replace '*' with your parent URL for security
        );
    };

    const handleMoveClick = (direction: string) => {
        // Send a message to the parent window
        window.parent.postMessage(
            {
                type: 'MOVE_SECTION',
                direction: direction,
                component_index: raw_data?.component_index
            },
            '*' // In production, replace '*' with your parent URL for security
        );
    }

    const handleCompPickerClick = (event_type: string) => {
        // Send a message to the parent window
        window.parent.postMessage(
            {
                type: event_type,
                component_index: raw_data?.component_index,
                component_type: "Our Services"
            },
            '*' // In production, replace '*' with your parent URL for security
        );
    }

    const handleHover = () => {
        setSectionHover(true);
    }

    const handleMouseExist = () => {
        setSectionHover(false);
    }

    const LoadOurServices = async () => {

        const payload = {
            "account_id": process.env.NEXT_PUBLIC_ACCOUNT_ID,
            "size": size,
            "featured": "Yes", //Constant
            "skip": "0",
            "fields": "service_uid,title,slug,icon,excerpt,descriptions"
        }

        const response = await window.MLS_Util.LoadOurServices(payload);

        let resp_message = response.message;
        let status_code = response.status_code;
        if (status_code == 200) {
            setServices(response.data.services);
        } else {
            setServicesError(resp_message)
        }

        setServicesLoaded(true);

    }

    useEffect(() => {
        LoadOurServices();
    }, [window.MLS_Util]);

    useEffect(() => {
        if (theme) {
            setThemeSett(theme.theme_settings);
        }
    }, [theme]);

    if (themeSett) {
        return (
            <section className="w-full bg-white px-6 py-35 md:px-12 lg:px-20 relative">
                {/* Heading */}
                <div className="mx-auto mb-16 max-w-3xl text-center">
                    <h2 className="text-2xl font-bold leading-tight text-gray-900 md:text-4xl">
                        {raw_data.header || "What we do."}
                    </h2>
                    <p className="mx-auto mt-2 max-w-xl text-base text-gray-600 md:text-lg">
                        {raw_data.sub_header || 'Our Services'}
                    </p>
                </div>

                {!servicesLoaded && <div className='col-span-full h-[250px] bg-white flex items-center justify-center'>
                    <AiOutlineLoading3Quarters size={30} className='animate animate-spin' />
                </div>}

                {(servicesLoaded && servicesError != "") &&
                    <div className='col-span-full h-[250px] bg-white text-red-600 flex items-center justify-center'>
                        {servicesError}
                    </div>
                }

                {/* Image + service list */}
                {(servicesLoaded && Array.isArray(services) && services.length > 0) &&
                    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
                        {/* Image with a clipped top-right corner notch */}
                        <div className={`relative aspect-[4/5] w-full lg:aspect-auto flex items-center justify-center`}  >
                            <img src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQw0ivC1d_swDLOaUoGX0NMCDt1ZUAM7BCnUKYsLuWhHuLTN_ifKQpQu2rY&s=10`}
                                alt={`xxx`} className="h-full w-full max-h-[700px] object-cover rounded-4xl shadow-2xl" />
                        </div>

                        {/* Service list */}
                        <div className="flex flex-col">
                            {services.map((service, index) => (
                                <OurServicesCardVar2 key={index} index={index} service={service} is_theme={is_theme} />
                            ))}
                        </div>

                    </div>
                }

                {raw_data?.show_more == "Yes" &&
                    <div className=' col-span-full w-full mt-10 md:mt-20 flex items-center justify-center'>
                        <CustomLinkMain href={`${themeSett.theme_prefix}/our-services?page=1`} is_theme={is_theme}
                            className={`px-8 py-5 text-white cursor-pointer flex items-center justify-center rounded space-x-2.5 
                                hover:shadow-2xl bg-${themeSett.primary_color} 
                                hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)}`}>
                            <span>{raw_data?.show_more_text || 'See All Services'}</span>
                            <FaArrowRightLong size={18} />
                        </CustomLinkMain>
                    </div>
                }


                {is_theme && (
                    <div className='absolute z-[1000] right-1.5 top-2 space-x-2 flex items-center justify-end 
                    *:bg-gray-800 *:text-white *:flex *:items-center *:justify-center *:p-2 *:rounded *:cursor-pointer'>

                        <div id='editor_settings' className='hover:shadow-2xl relative group' onClick={() => handleCompPickerClick("APPEND_SECTION")}
                            onMouseOver={handleHover} onMouseOut={handleMouseExist}>
                            <BiLayerPlus size={17} />

                            <span className='absolute hidden group-hover:inline-block whitespace-nowrap bottom-full px-2 py-2 w-fit rounded bg-gray-800 
                            text-white text-xs'>
                                Add new section after
                            </span>
                        </div>

                        <div id='editor_settings' className='hover:shadow-2xl relative group'
                            onClick={handleSettingsClick} onMouseOver={handleHover} onMouseOut={handleMouseExist}>
                            <BsGear size={17} />

                            <span className='absolute hidden group-hover:inline-block whitespace-nowrap bottom-full px-2 py-2 w-fit rounded bg-gray-800 
                                text-white text-xs'>
                                Section settings
                            </span>
                        </div>

                        <div id='editor_settings' className='hover:shadow-2xl relative group'
                            onClick={() => handleCompPickerClick("REPLACE_SECTION")} onMouseOver={handleHover} onMouseOut={handleMouseExist}>
                            <BiRefresh size={17} />

                            <span className='absolute hidden group-hover:inline-block whitespace-nowrap bottom-full px-2 py-2 w-fit rounded bg-gray-800 
                                text-white text-xs'>
                                Replace Section
                            </span>
                        </div>

                        <div id='editor_settings' className='hover:shadow-2xl relative group'
                            onClick={() => handleMoveClick("UP")} onMouseOver={handleHover} onMouseOut={handleMouseExist}>
                            <BsArrowUp size={17} />

                            <span className='absolute hidden right-0 group-hover:inline-block whitespace-nowrap bottom-full px-2 py-2 w-fit rounded bg-gray-800 
                                text-white text-xs'>
                                Move Section Up
                            </span>
                        </div>

                        <div id='editor_settings' className='hover:shadow-2xl relative group'
                            onClick={() => handleMoveClick("DOWN")} onMouseOver={handleHover} onMouseOut={handleMouseExist}>
                            <BsArrowDown size={17} />

                            <span className='absolute hidden right-0 group-hover:inline-block whitespace-nowrap bottom-full px-2 py-2 w-fit rounded bg-gray-800 
                                text-white text-xs'>
                                Move Section Down
                            </span>
                        </div>

                        <div id='editor_settings' className='hover:shadow-2xl relative group'
                            onClick={() => handleCompPickerClick("REMOVE_SECTION")} onMouseOver={handleHover} onMouseOut={handleMouseExist}>
                            <BiTrash size={17} />

                            <span className='absolute hidden right-0 w-fit group-hover:inline-block whitespace-nowrap bottom-full px-2 
                                py-2 rounded bg-gray-800 text-white text-xs'>
                                Remove Section Down
                            </span>
                        </div>

                    </div>
                )}
            </section>
        );
    }
}


export default OurServicesVar2