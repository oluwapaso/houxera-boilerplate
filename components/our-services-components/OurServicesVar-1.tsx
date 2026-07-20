'use client';

import React, { useEffect, useState } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/GlobalRedux/store';
import { BsArrowDown, BsArrowUp, BsGear } from 'react-icons/bs';
import CustomLinkMain from '../CustomLink';
import { FaArrowRightLong } from 'react-icons/fa6';
import { Helpers } from '@/_lib/helper';
import { BiLayerPlus, BiRefresh, BiTrash } from 'react-icons/bi';
import OurServicesCardVar1 from '../our-services-cards/OurServicesCardVar-1';

const helpers = new Helpers();
const OurServicesVar1 = ({ is_theme = false, size = 4, raw_data = {} }: { is_theme?: boolean, size?: number, raw_data?: any }) => {

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
                    "component": "OurServicesVar1",
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
            "fields": "service_uid,title,icon,slug,excerpt,descriptions"
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
            <section className="w-full py-20 px-3 tab:px-0 flex justify-center bg-gray-100 relative" data-show-services="Yes">
                <div className={`container grid grid-cols-1 tab:grid-cols-12 gap-8 
                ${(is_theme && sectionHover) ? "p-[10px] border-2 border-sky-800 transition-all duration-300" : null}`}>

                    <div className=' col-span-full tab:col-span-3 flex flex-col'>
                        <div className='font-medium text-lg'>{raw_data.header || "What we do."}</div>
                        <div className='font-semibold text-xl tab:text-3xl'>{raw_data.sub_header || 'Our Services'}</div>
                    </div>

                    <div className=' col-span-full tab:col-span-9 grid grid-cols-1 lg:grid-cols-2 gap-4 tab:gap-8'>

                        {!servicesLoaded && <div className='col-span-full h-[250px] bg-white flex items-center justify-center'>
                            <AiOutlineLoading3Quarters size={30} className='animate animate-spin' />
                        </div>}

                        {(servicesLoaded && servicesError != "") &&
                            <div className='col-span-full h-[250px] bg-white text-red-600 flex items-center justify-center'>
                                {servicesError}
                            </div>
                        }

                        {(servicesLoaded && Array.isArray(services) && services.length > 0) &&
                            (services.map((srvc, index) => {
                                return <OurServicesCardVar1 key={index} service_info={srvc} is_theme={is_theme} />
                            }))
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

                    </div>
                </div>

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
        )
    }
}


export default OurServicesVar1