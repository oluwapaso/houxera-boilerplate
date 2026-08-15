"use client"

import { hidePageLoader } from '@/app/GlobalRedux/app/appSlice';
import { AppDispatch, RootState } from '@/app/GlobalRedux/store';
import { updateDataCounts } from '@/app/GlobalRedux/user/userSlice';
import ReactivePagination from '@/components/ReactivePagination';
import StatusFilter from '@/components/tours/StatusFilter';
import TourCardVar1 from '@/components/tours/TourCardVar-1';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { BsGear } from 'react-icons/bs';
import { BiRefresh, BiTrash } from 'react-icons/bi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const ScheduledToursVar1 = ({ is_theme = false, size = 20, raw_data = {} }: { is_theme?: boolean, size?: number, raw_data?: any }) => {

    const dispatch = useDispatch<AppDispatch>();
    const searchParams = useSearchParams();
    const user = useSelector((state: RootState) => state.user);
    const theme = useSelector((state: RootState) => state.theme);
    const [themeSett, setThemeSett] = useState<any | null>(null);

    const page_size = 20; //20 
    const curr_page = parseInt(searchParams?.get("page") as string) || 1;
    const status_param = searchParams?.get("status") as string || "Upcoming";

    const [scheduled_tours, setScheduledTours] = useState<any[]>([]);
    const [tour_fetched, setTourFetched] = useState(false);
    const [toursError, setTourError] = useState("");
    const [currPage, setCurrPage] = useState(curr_page);
    const [status, setStatus] = useState(status_param);
    const [total_records, setTotalRecords] = useState(0);
    const [total_page, setTotalPage] = useState(0);
    const [all_tours, setAllTours] = useState<React.JSX.Element[]>([]);
    const [is_menu_shown, setIsMenuShown] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const [refresh_page, setRefreshPage] = useState(false);
    const [sectionHover, setSectionHover] = useState<boolean>(false);

    const no_tour_added = <div className='w-full text-red-600 flex justify-center items-center min-h-30'>
        No tour scheduled yet
    </div>

    const handleSettingsClick = () => {
        // Send a message to the parent window
        window.parent.postMessage(
            {
                type: 'OPEN_EDITOR_SETTINGS',
                data: {
                    "category": "scheduled_tours",
                    "type": "section",
                    "component": "ScheduledToursVar1",
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
                component_type: "ScheduledTours"
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

    const LoadTours = async () => {

        const payload = {
            "account_id": process.env.NEXT_PUBLIC_ACCOUNT_ID,
            "user_uid": user.user_info?.user_uid || "d25e25a6-a6fb-4193-857f-2144e8d05f9b", // || "d25e25a6-a6fb-4193-857f-2144e8d05f9b" is used for testing only
            "status": status,
            "size": page_size,
            "skip": curr_page - 1
        }

        const response = await window.MLS_Util.LoadScheduledTours(payload);

        let resp_message = response.message;
        let status_code = response.status_code;
        if (status_code == 200) {
            setScheduledTours(response.data.tours);
            setTotalRecords(response.data.total_records);

            if (status == "Upcoming") {
                dispatch(updateDataCounts({ "upcoming_tours": response.data.total_records }));
            }

        } else {
            setTourError(resp_message);
        }

        setTourFetched(true);

    }

    const TriggerStatus = (new_status: string) => {
        console.log("new_status != status_param", new_status != status_param, new_status, status_param)
        if (new_status != status_param) {
            setStatus(new_status); // Update the type state to trigger useEffect

            let link = `${themeSett.theme_prefix}/scheduled-tours?status=${new_status}&page=1`;

            setTourFetched(false);
            setRefreshPage(true);
            window.history.replaceState({}, '', link); // Use pushState to change URL without reloading
        }
    }

    useEffect(() => {
        if (Array.isArray(scheduled_tours)) {

            setTourError("")
            if (total_records > 0) {

                const total_returned = scheduled_tours.length;
                setTotalPage(Math.ceil(total_records / page_size));

                if (total_records > 0 && total_returned > 0) {
                    setAllTours(scheduled_tours.map((tour, index) => {
                        return <TourCardVar1 key={index} tour_info={tour} />
                    }));
                } else {
                    setAllTours(() => [no_tour_added])
                }

            } else {

                //Making sure request has been sent
                if (tour_fetched) {
                    setAllTours(() => [no_tour_added])
                } else {
                    setAllTours(() => [<div className='w-full flex justify-center items-center min-h-60'>
                        <AiOutlineLoading3Quarters size={30} className='animate animate-spin' />
                    </div>])
                }

            }

        } else {
            //Making sure request has been sent
            if (tour_fetched) {
                setAllTours(() => [no_tour_added])
            } else {
                setAllTours(() => [<div className='w-full flex justify-center items-center min-h-60'>
                    <AiOutlineLoading3Quarters size={30} className='animate animate-spin' />
                </div>])
            }
        }
    }, [scheduled_tours]);

    useEffect(() => {
        dispatch(hidePageLoader());
        if (window.MLS_Util) {
            LoadTours();
        }
    }, [window.MLS_Util, searchParams]);

    useEffect(() => {
        if (theme) {
            setThemeSett(theme.theme_settings);
        }
    }, [theme]);

    useEffect(() => {
        if (refresh_page) {
            LoadTours();
        }
    }, [refresh_page]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsMenuShown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuRef]);

    if (!is_theme && !user.isLogged) {
        return (
            <div className="flex flex-col min-h-screen" >
                <main className="w-full flex flex-col min-h-[55dvh]">
                    <div className='col-span-full h-[250px] bg-white text-red-600 flex items-center justify-center'>
                        You need to login to access this page.
                    </div>
                </main>
            </div>
        )
    }

    if (themeSett && themeSett != null) {
        return (
            <section className="flex flex-col min-h-screen py-35 relative bg-gray-100" >

                <main className="w-full flex flex-col min-h-[55dvh]">
                    {/**  ======================= Contact Area Starts ====================== **/}
                    <div className="container mx-auto max-w-[1150px] relative">

                        <div className=' flex justify-between mb-4'>
                            <div className=' flex flex-col'>
                                <div className='font-semibold text-3xl'>{raw_data.header || "Scheduled Tours"}</div>
                                <div className='font-medium text-lg'>
                                    {raw_data.sub_header || "Manage your upcoming/past scheduled property tour."}
                                </div>
                            </div>

                            <div className='ml-2 flex items-center'>
                                <div className='flex items-center group px-3 bg-white border border-zinc-900 cursor-pointer 
                                    h-[40px] rounded min-w-[100px] hover:shadow-xl *:font-medium relative mr-2'
                                    ref={menuRef} onClick={() => setIsMenuShown(true)}>
                                    <div className='flex justify-between w-full items-center text-base'>
                                        <span><span className='font-semibold'>Status:</span> {status}</span>
                                        <span className={`${is_menu_shown && "rotate-180"} transition-all duration-300`}>
                                            <MdOutlineKeyboardArrowDown size={20} />
                                        </span>
                                    </div>

                                    {is_menu_shown &&
                                        <div className='w-[240px] absolute top-[104%] right-0 shadow-2xl rounded-md bg-white z-30'>
                                            <div className='w-full flex flex-col max-h-[400px] font-normal text-base'>
                                                <StatusFilter onFilterUpdates={TriggerStatus} curr_value={status} activeClass="bg-primary text-white"
                                                    selectClass="w-full py-4 px-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50" />
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>

                        {!tour_fetched && <div className='col-span-full h-[250px] bg-white flex items-center justify-center'>
                            <AiOutlineLoading3Quarters size={30} className='animate animate-spin' />
                        </div>}

                        {(tour_fetched) &&
                            <div className='w-full'>
                                {(toursError == "" && Array.isArray(scheduled_tours)) &&
                                    <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6'>
                                        {all_tours}
                                    </div>
                                }

                                {(toursError == "" && total_page > 0) &&
                                    <ReactivePagination totalPage={total_page} curr_page={curr_page} changeTigger={setCurrPage}
                                        trigger_loader={setTourFetched} url_path={`${themeSett.theme_prefix}/scheduled-tours?status=${status}&`} />
                                }

                                {toursError != "" &&
                                    <div className='col-span-full h-[150px] bg-white text-red-600 flex items-center justify-center'>
                                        {toursError}
                                    </div>
                                }
                            </div>
                        }
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

export default ScheduledToursVar1