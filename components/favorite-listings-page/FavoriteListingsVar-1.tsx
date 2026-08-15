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

const FavoriteListingsVar1 = ({ is_theme = false, size = 20, raw_data = {} }: { is_theme?: boolean, size?: number, raw_data?: any }) => {

    const dispatch = useDispatch<AppDispatch>();
    const searchParams = useSearchParams();
    const user = useSelector((state: RootState) => state.user);
    const theme = useSelector((state: RootState) => state.theme);
    const [themeSett, setThemeSett] = useState<any | null>(null);

    const page_size = 30; //20 
    const curr_page = parseInt(searchParams?.get("page") as string) || 1;
    // let all_favs: React.JSX.Element[] = [];

    const [favorite_listings, setFavoriteFavs] = useState<any[]>([]);
    const [fav_fetched, setFavFetched] = useState(false);
    const [favoritesError, setFavoritesError] = useState("");
    const [currPage, setCurrPage] = useState(curr_page);
    const [total_records, setTotalRecords] = useState(0);
    const [total_page, setTotalPage] = useState(0);
    const [all_favs, setAllFavs] = useState<React.JSX.Element[]>([]);
    const [sectionHover, setSectionHover] = useState<boolean>(false);

    const no_fav_added = <div className='w-full text-red-600 flex justify-center items-center min-h-30'>
        No favorites added yet
    </div>

    const handleSettingsClick = () => {
        // Send a message to the parent window
        window.parent.postMessage(
            {
                type: 'OPEN_EDITOR_SETTINGS',
                data: {
                    "category": "favorite_listings",
                    "type": "section",
                    "component": "FavoriteListingsVar1",
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
                component_type: "FavoriteListings"
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

    const LoadFavorites = async () => {

        const payload = {
            "account_id": process.env.NEXT_PUBLIC_ACCOUNT_ID,
            "user_uid": user.user_info?.user_uid || "d25e25a6-a6fb-4193-857f-2144e8d05f9b", // || "d25e25a6-a6fb-4193-857f-2144e8d05f9b" is used for testing ony
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

    // if (Array.isArray(favorite_listings)) {

    //     // setFavoritesError("");
    //     if (total_records > 0) {

    //         const total_returned = favorite_listings.length;
    //         total_page = Math.ceil(total_records / page_size);

    //         if (total_records > 0 && total_returned > 0) {

    //             all_favs = favorite_listings.map((fav, index) => {
    //                 return <PropCardVar1 key={index} pro_info={fav} />
    //             });

    //         } else {
    //             all_favs[0] = no_fav_added;
    //         }

    //     } else {

    //         //Making sure request has been sent
    //         if (fav_fetched) {
    //             all_favs[0] = no_fav_added
    //         } else {
    //             all_favs[0] = <div className='w-full flex justify-center items-center min-h-60'>
    //                 <AiOutlineLoading3Quarters size={30} className='animate animate-spin' />
    //             </div>
    //         }

    //     }

    // } else {
    //     //Making sure request has been sent
    //     if (fav_fetched) {
    //         all_favs[0] = no_fav_added
    //     } else {
    //         all_favs[0] = <div className='w-full flex justify-center items-center min-h-60'>
    //             <AiOutlineLoading3Quarters size={30} className='animate animate-spin' />
    //         </div>
    //     }
    // }

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
            <section className="flex flex-col min-h-screen py-35 relative bg-gray-100">

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

export default FavoriteListingsVar1