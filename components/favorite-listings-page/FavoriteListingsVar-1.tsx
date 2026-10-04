"use client"

import { hidePageLoader } from '@/app/GlobalRedux/app/appSlice';
import { AppDispatch, RootState } from '@/app/GlobalRedux/store';
import PropCardVar1 from '@/components/property-cards/PropCardVar-1';
import ReactivePagination from '@/components/ReactivePagination';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { BsGear } from 'react-icons/bs';
import { BiRefresh, BiTrash } from 'react-icons/bi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import ComponentSettings from '../editor-items/ComponentSettings';

const FavoriteListingsVar1 = ({ is_theme = false, size = 20, raw_data = {} }: { is_theme?: boolean, size?: number, raw_data?: any }) => {

    const dispatch = useDispatch<AppDispatch>();
    const searchParams = useSearchParams();
    const user = useSelector((state: RootState) => state.user);
    const theme = useSelector((state: RootState) => state.theme);
    const [themeSett, setThemeSett] = useState<any | null>(null);

    const page_size = 30; //20 
    const curr_page = parseInt(searchParams?.get("page") as string) || 1;

    const company_unique_id = searchParams?.get("company_unique_id") as string || "";
    const channel_uid = searchParams?.get("channel_uid") as string || "";
    // let all_favs: React.JSX.Element[] = [];

    const [favorite_listings, setFavoriteFavs] = useState<any[]>([]);
    const [fav_fetched, setFavFetched] = useState(false);
    const [favoritesError, setFavoritesError] = useState("");
    const [currPage, setCurrPage] = useState(curr_page);
    const [total_records, setTotalRecords] = useState(0);
    const [total_page, setTotalPage] = useState(0);
    const [all_favs, setAllFavs] = useState<React.JSX.Element[]>([]);
    const [first_comp_pt, setFirstCompPt] = useState("pt-30 md:pt-35");

    const no_fav_added = <div className='w-full text-red-600 flex justify-center items-center min-h-30'>
        No favorites added yet
    </div>

    const LoadFavorites = async () => {

        const payload = {
            "account_id": is_theme ? company_unique_id : process.env.NEXT_PUBLIC_ACCOUNT_ID,
            "channel_uid": is_theme ? channel_uid : process.env.NEXT_PUBLIC_CHANNEL_UID,
            "user_uid": user.user_info?.user_uid || "23963303-c6b8-4835-9b61-7211f530df22", // || "23963303-c6b8-4835-9b61-7211f530df22" is used for testing ony
            "size": page_size,
            "skip": curr_page - 1
        }

        const response = await window.MLS_Util.LoadFavoriteLitings(payload);

        let resp_message = response.message;
        let status_code = response.status_code;
        if (status_code == 200) {
            setFavoriteFavs(response.data.favorites);
            setTotalRecords(response.data.total_records);
        } else {
            setFavoritesError(resp_message);
        }

        setFavFetched(true);

    }

    useEffect(() => {
        if (Array.isArray(favorite_listings)) {

            setFavoritesError("")
            if (total_records > 0) {

                const total_returned = favorite_listings.length;
                setTotalPage(Math.ceil(total_records / page_size));

                if (total_records > 0 && total_returned > 0) {
                    setAllFavs(favorite_listings.map((fav, index) => {
                        return <PropCardVar1 key={index} pro_info={fav} />
                    }));
                } else {
                    setAllFavs(() => [no_fav_added])
                }

            } else {

                //Making sure request has been sent
                if (fav_fetched) {
                    setAllFavs(() => [no_fav_added])
                } else {
                    setAllFavs(() => [<div className='w-full flex justify-center items-center min-h-60'>
                        <AiOutlineLoading3Quarters size={30} className='animate animate-spin' />
                    </div>])
                }

            }

        } else {
            //Making sure request has been sent
            if (fav_fetched) {
                setAllFavs(() => [no_fav_added])
            } else {
                setAllFavs(() => [<div className='w-full flex justify-center items-center min-h-60'>
                    <AiOutlineLoading3Quarters size={30} className='animate animate-spin' />
                </div>])
            }
        }
    }, [favorite_listings]);

    useEffect(() => {
        dispatch(hidePageLoader());
        if (window.MLS_Util) {
            LoadFavorites();
        }
    }, [window.MLS_Util, searchParams]);



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

    useEffect(() => {
        if (theme) {
            setThemeSett(theme.theme_settings);
        }
    }, [theme]);

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
            <section className={`flex flex-col min-h-screen ${first_comp_pt} pb-20 px-4 relative bg-gray-100`}>

                <main className="w-full flex flex-col min-h-[55dvh]">
                    {/**  ======================= Contact Area Starts ====================== **/}
                    <div className="container mx-auto max-w-[1150px] relative">

                        <div className=' flex flex-col mb-4'>
                            <div className='font-semibold text-3xl'>
                                {raw_data.header || "Favorite Listsings"}
                            </div>
                            <div className='font-medium text-lg'>
                                {raw_data.sub_header || "Manage your favorite listings."}
                            </div>
                        </div>

                        {!fav_fetched && <div className='col-span-full h-[250px] bg-white flex items-center justify-center'>
                            <AiOutlineLoading3Quarters size={30} className='animate animate-spin' />
                        </div>}

                        {(fav_fetched) &&
                            <div className='w-full'>
                                {(favoritesError == "" && Array.isArray(favorite_listings)) &&
                                    <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                                        {all_favs}
                                    </div>
                                }

                                {(favoritesError == "" && total_page > 0) &&
                                    <ReactivePagination totalPage={total_page} curr_page={curr_page} changeTigger={setCurrPage}
                                        trigger_loader={setFavFetched} url_path={`${themeSett.theme_prefix}/favorites?`} />
                                }

                                {favoritesError != "" &&
                                    <div className='col-span-full h-[150px] bg-white text-red-600 flex items-center justify-center'>
                                        {favoritesError}
                                    </div>
                                }
                            </div>
                        }
                    </div>
                </main>

                {is_theme && <ComponentSettings raw_data={raw_data} category='favorite_listings' component='FavoriteListingsVar1' component_type='FavoriteListings' />}
            </section>
        )
    }
}

export default FavoriteListingsVar1