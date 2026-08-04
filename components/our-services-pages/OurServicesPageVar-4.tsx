'use client';

import React, { useEffect, useState } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/GlobalRedux/store';
import { BsGear } from 'react-icons/bs';
import { Helpers } from '@/_lib/helper';
import { BiRefresh, BiTrash } from 'react-icons/bi';
import { useSearchParams } from 'next/navigation';
import { OurService } from '../types';
import ReactivePagination from '../ReactivePagination';
import { GiFlame } from 'react-icons/gi';
import SideAds from '../ads/SideAds';
import OurServicesCardVar4 from '../our-services-cards/OurServicesCardVar-4';

const helpers = new Helpers();
const OurServicesPageVar4 = ({ is_theme = false, size = 20, raw_data = {} }: { is_theme?: boolean, size?: number, raw_data?: any }) => {

    const theme = useSelector((state: RootState) => state.theme);
    const user = useSelector((state: RootState) => state.user);
    const [themeSett, setThemeSett] = useState<any | null>(null);
    const searchParams = useSearchParams();
    const pageSize = size;
    const current_page = parseInt(searchParams?.get("page") ?? "1") || 1;

    const [services, setServices] = useState<OurService[]>([]);
    const [servicestLoaded, setServicesLoaded] = useState<boolean>(false);
    const [serviceError, setServiceListingError] = useState("");

    const [sectionHover, setSectionHover] = useState<boolean>(false);
    const [currPage, setCurrPage] = useState(current_page);

    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);

    const handleSettingsClick = () => {
        // Send a message to the parent window
        window.parent.postMessage(
            {
                type: 'OPEN_EDITOR_SETTINGS',
                data: {
                    "category": "services",
                    "type": "section",
                    "component": "OurServicesPageVar4",
                    ...raw_data,
                }
            },
            '*' // In production, replace '*' with your parent URL for security
        );
    };

    const handleCompPickerClick = (event_type: string) => {
        // Send a message to the parent window
        window.parent.postMessage(
            {
                type: event_type,
                component_index: raw_data?.component_index,
                component_type: "OurServices"
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
            "size": pageSize,
            "skip": "0",
            "fields": "service_uid,excerpt,header_image_large,header_image_small,insight_type,slug,title,icon,featured,date_added"
        }

        try {

            const response = await window.MLS_Util.LoadOurServices(payload);
            let resp_message = response.message;
            let status_code = response.status_code;
            if (status_code == 200) {
                setServices(response.data.services);
                setTotalPages(Math.ceil(response.data.total_records / pageSize));

            } else {
                setServiceListingError(resp_message)
            }

        } catch (e: any) {
            setServiceListingError(e)
        } finally {
            setLoading(false);
            setServicesLoaded(true);
        }
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
            <section className="min-h-screen text-foreground relative py-35 bg-gray-100">

                <div className=' container mx-auto max-w-[1280px]'>

                    <div className='w-full flex flex-col mt-0'>
                        {/* Blog Posts Section */}
                        <div className="w-full text-center mb-16">
                            <h2 className="font-sans text-4xl md:text-5xl font-bold text-neutral-900 
                            flex flex-col items-center space-y-2.5">
                                <span>{raw_data.header || "Top Neighborhoods"}</span>
                                <div className={`w-16 border-2 border-${themeSett.primary_color}`}></div>
                            </h2>
                            <p className="mt-4 font-sans text-base text-neutral-600 max-w-md mx-auto">
                                {raw_data.sub_header || "Top Real Estate In Osun Nigeria"}
                            </p>
                        </div>

                        {loading && <div className='col-span-full h-[250px] bg-white flex items-center justify-center'>
                            <AiOutlineLoading3Quarters size={30} className='animate animate-spin' />
                        </div>}

                        {/* Services Grid */}
                        {(!loading && serviceError == "" && Array.isArray(services)) &&
                            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
                                {services.map((srvc, index) => (
                                    <OurServicesCardVar4 key={srvc.service_uid} index={index} is_theme={is_theme} service={srvc} />
                                ))}
                            </div>
                        }

                        {/* Pagination */}
                        {(!loading && serviceError == "" && totalPages > 0) &&
                            <ReactivePagination totalPage={totalPages} curr_page={currPage} is_theme={is_theme}
                                changeTigger={setCurrPage} trigger_loader={setServicesLoaded}
                                url_path={`/neighborhoods?`} />
                        }

                        {/* Error message  */}
                        {!loading && serviceError != "" &&
                            <div className='col-span-full h-[150px] bg-white text-red-600 flex items-center justify-center'>
                                {serviceError}
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
                            <BiTrash size={17} />

                            <span className='absolute hidden right-0 whitespace-nowrap group-hover:block bottom-full px-2 py-2 w-fit rounded bg-gray-800 
                            text-white text-xs'>
                                Remove Section Down
                            </span>
                        </div>

                    </div>
                )}
            </section>
        )
    }
}


export default OurServicesPageVar4