'use client';

import React, { useEffect, useState } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/GlobalRedux/store';
import { BsGear } from 'react-icons/bs';
import { Helpers } from '@/_lib/helper';
import { BiRefresh, BiTrash } from 'react-icons/bi';

import { useSearchParams } from 'next/navigation';
import { BlogPost, Neighorhood } from '../types';
import ReactivePagination from '../ReactivePagination';
import NeighborhoodCardVar2 from '../neighborhood-cards/NeighborhoodCardVar-2';
import { GiFlame } from 'react-icons/gi';
import SideAds from '../ads/SideAds';

const helpers = new Helpers();
const NeighborhoodsVar2 = ({ is_theme = false, size = 20, raw_data = {} }: { is_theme?: boolean, size?: number, raw_data?: any }) => {

    const theme = useSelector((state: RootState) => state.theme);
    const user = useSelector((state: RootState) => state.user);
    const [themeSett, setThemeSett] = useState<any | null>(null);
    const searchParams = useSearchParams();
    const pageSize = size;
    const current_page = parseInt(searchParams?.get("page") ?? "1") || 1;

    const company_unique_id = searchParams?.get("company_unique_id") as string || "";
    const channel_uid = searchParams?.get("channel_uid") as string || "";

    const [neighborgoods, setNeighborgoods] = useState<Neighorhood[]>([]);
    const [neighListLoaded, setNeighListLoaded] = useState<boolean>(false);
    const [neighListingError, setNeighListingError] = useState("");

    const [sectionHover, setSectionHover] = useState<boolean>(false);
    const [currPage, setCurrPage] = useState(current_page);

    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const [first_comp_pt, setFirstCompPt] = useState("pt-30 md:pt-35");

    const handleSettingsClick = () => {
        // Send a message to the parent window
        window.parent.postMessage(
            {
                type: 'OPEN_EDITOR_SETTINGS',
                data: {
                    "category": "neighborhoods",
                    "type": "section",
                    "component": "NeighborhoodsVar2",
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
                component_type: "Neighborhoods"
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

    const LoadNeighborhoods = async () => {

        const payload = {
            "account_id": is_theme ? company_unique_id : process.env.NEXT_PUBLIC_ACCOUNT_ID,
            "channel_uid": is_theme ? channel_uid : process.env.NEXT_PUBLIC_CHANNEL_UID,
            "size": pageSize,
            "skip": "0",
            "fields": "neighborhood_uid,excerpt,summary,header_image_large,header_image_small,insight_type,slug,title,views,comments"
        }

        try {

            const response = await window.MLS_Util.LoadNeighborhoods(payload);
            let resp_message = response.message;
            let status_code = response.status_code;
            if (status_code == 200) {
                setNeighborgoods(response.data.all_neighborhoods);
                setTotalPages(Math.ceil(response.data.total_records / pageSize));

            } else {
                setNeighListingError(resp_message)
            }

        } catch (e: any) {
            setNeighListingError(e)
        } finally {
            setLoading(false);
            setNeighListLoaded(true);
        }
    }

    useEffect(() => {
        LoadNeighborhoods();
    }, [window.MLS_Util]);

    useEffect(() => {

        if (raw_data?.component_index !== 0) return;

        const navType = themeSett?.nav_component?.type;

        if (navType === "NavVar6") {
            setFirstCompPt("pt-52");
            return;
        }

        if (navType === "NavVar7") {
            const updatePadding = () => {
                const nav = document.getElementById("NavVar7");
                const isMobile = nav?.getAttribute("data-is-mobile") === "true";
                // Adjust these values to whatever looks correct
                setFirstCompPt(isMobile ? "pt-25 md:pt-35" : "pt-54");
            };

            updatePadding(); // initial

            // Watch for changes (forceMobile can change on resize)
            const observer = new MutationObserver(updatePadding);
            const nav = document.getElementById("NavVar7");
            if (nav) {
                observer.observe(nav, {
                    attributes: true,
                    attributeFilter: ["data-is-mobile"],
                });
            }

            return () => observer.disconnect();
        }

    }, [themeSett?.nav_component?.type, raw_data?.component_index]);

    useEffect(() => {
        if (theme) {
            setThemeSett(theme.theme_settings);
        }
    }, [theme]);

    if (themeSett) {
        return (
            <section className={`min-h-screen text-foreground relative ${first_comp_pt} pb-20 bg-gray-100`}>

                <div className=' container mx-auto max-w-[1280px] px-4'>

                    <div className='w-full flex flex-col mt-0'>
                        <div className="m-2">
                            <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 leading-[1.05] max-w-3xl">
                                <span className="relative inline-block w-fit">
                                    {raw_data.header || "Top Neighborhoods"}
                                    <svg className={`absolute left-0 -bottom-2 w-[30%] stroke-${themeSett.primary_color}`} height="10" viewBox="0 0 200 10" preserveAspectRatio="none">
                                        <path d="M0,6 Q50,0 100,5 T200,4" strokeWidth="4" fill="none" />
                                    </svg>
                                </span>
                            </h1>
                            <p className="mt-2 font-sans text-lg text-neutral-500 max-w-xl">
                                {raw_data.sub_header || "Top Real Estate In Osun Nigeria"}
                            </p>
                        </div>

                        {loading && <div className='col-span-full h-[250px] bg-white flex items-center justify-center'>
                            <AiOutlineLoading3Quarters size={30} className='animate animate-spin' />
                        </div>}

                        {/* Neighborhoods Grid */}
                        {(!loading && neighListingError == "" && Array.isArray(neighborgoods)) &&
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 sm:mb-12">
                                {neighborgoods.map((post) => (
                                    <NeighborhoodCardVar2 key={post.neighborhood_uid} is_theme={is_theme} neigh_info={post} />
                                ))}
                            </div>
                        }

                        {/* Pagination */}
                        {(!loading && neighListingError == "" && totalPages > 0) &&
                            <ReactivePagination totalPage={totalPages} curr_page={currPage} is_theme={is_theme}
                                changeTigger={setCurrPage} trigger_loader={setNeighListLoaded}
                                url_path={`/neighborhoods?`} />
                        }

                        {/* Error message  */}
                        {!loading && neighListingError != "" &&
                            <div className='col-span-full h-[150px] bg-white text-red-600 flex items-center justify-center'>
                                {neighListingError}
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


export default NeighborhoodsVar2