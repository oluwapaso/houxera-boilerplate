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
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import ComponentSettings from '../editor-items/ComponentSettings';

const ScheduledToursVar1 = ({ is_theme = false, size = 20, raw_data = {} }: { is_theme?: boolean, size?: number, raw_data?: any }) => {

    const dispatch = useDispatch<AppDispatch>();
    const searchParams = useSearchParams();
    const user = useSelector((state: RootState) => state.user);
    const theme = useSelector((state: RootState) => state.theme);
    const [themeSett, setThemeSett] = useState<any | null>(null);

    const page_size = size; //20 
    const curr_page = parseInt(searchParams?.get("page") as string) || 1;
    const status_param = searchParams?.get("status") as string || "Upcoming"; //"Upcoming" //"Past"

    const company_unique_id = searchParams?.get("company_unique_id") as string || "";
    const channel_uid = searchParams?.get("channel_uid") as string || "";

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
    const [first_comp_pt, setFirstCompPt] = useState("pt-30 md:pt-35");

    const no_tour_added = <div className='w-full text-red-600 flex justify-center items-center min-h-30'>
        No tour scheduled yet
    </div>

    const LoadTours = async () => {

        const payload = {
            "account_id": is_theme ? company_unique_id : process.env.NEXT_PUBLIC_ACCOUNT_ID,
            "channel_uid": is_theme ? channel_uid : process.env.NEXT_PUBLIC_CHANNEL_UID,
            "user_uid": user.user_info?.user_uid || "23963303-c6b8-4835-9b61-7211f530df22", // || "23963303-c6b8-4835-9b61-7211f530df22" is used for testing only
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
        if (new_status != status_param) {
            setStatus(new_status); // Update the type state to trigger useEffect

            let link = `/scheduled-tours?status=${new_status}&page=1`;

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

    useEffect(() => {

        if (raw_data?.component_index !== 0) return;

        const navType = themeSett?.nav_component?.type;

        if (navType === "NavVar6") {
            setFirstCompPt("pt-52");
            return;
        }

        if (navType === "NavVar7") {
            const updatePadding = () => {
                const nav = document.getElementById("main-nav");
                const isMobile = nav?.getAttribute("data-is-mobile") === "true";
                // Adjust these values to whatever looks correct
                setFirstCompPt(isMobile ? "pt-25 md:pt-35" : "pt-54");
            };

            updatePadding(); // initial

            // Watch for changes (forceMobile can change on resize)
            const observer = new MutationObserver(updatePadding);
            const nav = document.getElementById("main-nav");
            if (nav) {
                observer.observe(nav, {
                    attributes: true,
                    attributeFilter: ["data-is-mobile"],
                });
            }

            return () => observer.disconnect();
        }

    }, [themeSett?.nav_component?.type, raw_data?.component_index]);

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
            <section className={`flex flex-col min-h-screen ${first_comp_pt} px-4 pb-20 relative bg-gray-100`}>

                <main className="w-full flex flex-col min-h-[55dvh]">
                    {/**  ======================= Contact Area Starts ====================== **/}
                    <div className="container mx-auto max-w-full tab:max-w-[800px] xl:max-w-[1150px] relative">

                        <div className=' flex flex-col sm:flex-row sm:justify-between mb-4 sm:space-x-2'>
                            <div className=' flex flex-col'>
                                <div className='font-semibold text-2xl xs:text-3xl'>{raw_data.header || "Scheduled Tours"}</div>
                                <div className='font-medium text-lg'>
                                    {raw_data.sub_header || "Manage your upcoming/past scheduled property tour."}
                                </div>
                            </div>

                            <div className='max-2xs:w-full flex max-sm:justify-self-end max-sm:ml-auto max-sm:mt-2 items-center'>
                                <div className='max-2xs:w-full flex items-center group px-3 bg-white border border-zinc-900 cursor-pointer 
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
                                    <div className='w-full grid grid-cols-1 xl:grid-cols-2 gap-6'>
                                        {all_tours}
                                    </div>
                                }

                                {(toursError == "" && total_page > 0) &&
                                    <ReactivePagination totalPage={total_page} curr_page={curr_page} changeTigger={setCurrPage}
                                        trigger_loader={setTourFetched} url_path={`/scheduled-tours?status=${status}&`} />
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

                {is_theme && <ComponentSettings raw_data={raw_data} category='scheduled_tours' component='ScheduledToursVar1' component_type='ScheduledTours' />}
            </section>
        )
    }
}

export default ScheduledToursVar1