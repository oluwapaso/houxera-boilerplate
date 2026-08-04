"use client"

import { hidePageLoader, showPageLoader } from '@/app/GlobalRedux/app/appSlice';
import { AppDispatch, RootState } from '@/app/GlobalRedux/store';
import SideAds from '@/components/ads/SideAds';
import SaveSearchComponent from '@/components/modals/SaveSearch';
import PropCardVar1 from '@/components/property-cards/PropCardVar-1';
import ReactivePagination from '@/components/ReactivePagination';
import Advanced_Filter_1 from '@/components/search-components/Advanced_Filter_1';
import { ReadonlyURLSearchParams, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import { BiSave } from 'react-icons/bi';
import { FaCheck } from 'react-icons/fa6';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { BsGear } from 'react-icons/bs';
import { BiRefresh, BiTrash } from 'react-icons/bi';
import { Helpers } from '@/_lib/helper';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { GiFlame } from 'react-icons/gi';
import { toast } from 'react-toastify';

const MLSSearchVar1 = ({ is_theme = false, size = 20, raw_data = {} }: { is_theme?: boolean, size?: number, raw_data?: any }) => {

    const dispatch = useDispatch<AppDispatch>();
    const searchParams = useSearchParams();
    const theme = useSelector((state: RootState) => state.theme);
    const [themeSett, setThemeSett] = useState<any | null>(null);

    const page_size = size;
    const curr_page = parseInt(searchParams?.get("page") as string) || 1;
    const location_params = searchParams?.get("location") as string || "";
    const status_params = searchParams?.get("status") as string || "Active";
    // let all_posts: React.JSX.Element[] = [];

    //The delivery uid has to come from the components settings
    const delivery_uid = "xx-8992hhsjsj-sjsjs";
    const account_id = process.env.NEXT_PUBLIC_ACCOUNT_ID;

    const [formData, setFormData] = useState<any>({});
    const [srchFormData, setSrchFormData] = useState<any>({});
    const [properties, setProperties] = useState<any[]>([]);
    const [prop_fetched, setPropFetched] = useState(false);
    const [startFetch, setStartFetch] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [fetchError, setFetchError] = useState("");
    const [currPage, setCurrPage] = useState(curr_page);
    const [all_props, setAllPprops] = useState<React.JSX.Element[]>([]);
    const [total_records, setTotalRecords] = useState(0);
    const [total_page, setTotalPage] = useState(0);

    const [filter_by, setFilterBy] = useState("Price (High to Low)"); //Default
    const [sort_shown, setSortShown] = useState(false);
    const sortBoxRef = useRef<HTMLDivElement>(null);
    const [sectionHover, setSectionHover] = useState<boolean>(false);

    const [showModal, setShowModal] = useState(false);
    const [modal_title, setModalTitle] = useState(<></>);
    const [modal_children, setModalChildren] = useState({} as React.ReactNode);

    const closeModal = () => {
        setShowModal(false);
    }

    const handleSettingsClick = () => {
        // Send a message to the parent window
        window.parent.postMessage(
            {
                type: 'OPEN_EDITOR_SETTINGS',
                data: {
                    "category": "mls_search",
                    "type": "section",
                    "component": "MLSSearchVar1",
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
                component_type: "MlsSearch"
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

    const nothing_found = <div className='w-full text-red-600 flex justify-center items-center min-h-30'>
        No result found
    </div>

    const LoadProperties = async () => {

        setTotalRecords(0);

        const payload = {
            "account_id": account_id,
            "delivery_uid": delivery_uid,
            "location": formData.location,
            // "state": formData.state,
            "status": formData.status || "Active",
            "sales_type": formData.sales_type || "For Sale",
            "property_type": formData.property_type,
            "property_sub_type": formData.property_sub_type,
            "beds": formData.beds,
            "baths": formData.baths,
            "min_price": formData.min_price,
            "max_price": formData.max_price,
            "min_living_area": formData.min_living_area,
            "max_living_area": formData.max_living_area,
            "min_lot_size": formData.min_lot_size,
            "max_lot_size": formData.max_lot_size,
            "must_have": formData.must_have,
            "fields": `property_uid,mls_id,is_promoted,listing_price,listing_type,lot_size,mls_number,property_status,property_sub_type,
            property_type,square_meter,title,year_built,stories,street_address,city,state,local_government,postal_code,neighborhood,
            bedrooms,bathrooms,total_rooms,garage_spaces,carport_spaces,agent_info,primary_photo,low_photo_lists,video_tour_url,
            virtual_tour_url,property_description,company_uid`,
            "size": page_size,
            "skip": curr_page - 1,
            "sort_by": formData.sort_by || "Price",
            "sort_dir": formData.sort_dir || "DESC"
        }

        const response = await window.MLS_Util.LoadMLSListings(payload);

        let resp_message = response.message;
        let status_code = response.status_code;
        if (status_code == 200) {
            setProperties(response.data.properties);
            setTotalRecords(response.data.total_records);
        } else {
            setFetchError(resp_message);
        }

        setPropFetched(true);
        setRefresh(false);
        dispatch(hidePageLoader());

    }

    const BuildPaginationLink = async (params: ReadonlyURLSearchParams) => {
        var link = ""
        if (params?.get("location") && params?.get("location") != "") {
            link += `location=${params?.get("location")}`
        }
    }

    const handleSort = (sort_by: string, sort_dir: string) => {

        setFormData((prev: any) => {
            return {
                ...prev,
                sort_by: sort_by,
                sort_dir: sort_dir,
            }
        });

        setSortShown(false);
        setRefresh(true);

    }

    const OpenSaveSearch = () => {
        setModalTitle(<div className=' flex items-center'><BiSave size={20} className='mr-1' /> Save Search</div>)
        setModalChildren(<SaveSearchComponent closeModal={closeModal} formData={formData} setFormData={setFormData} />);
        setShowModal(true);
    }

    useEffect(() => {

        var filterBy = "Price (High to Low)"
        if (formData.sort_by == "Price" && formData.sort_dir == "DESC") {
            filterBy = "Price (High to Low)"
        } else if (formData.sort_by == "Price" && formData.sort_dir == "ASC") {
            filterBy = "Price (Low to High)"
        } else if (formData.sort_by == "Date" && formData.sort_dir == "DESC") {
            filterBy = "Newest Firsts"
        } else if (formData.sort_by == "Date" && formData.sort_dir == "ASC") {
            filterBy = "Oldest Firsts"
        } else if (formData.sort_by == "Beds") {
            filterBy = "Bedrooms"
        } else if (formData.sort_by == "Baths") {
            filterBy = "Bathrooms"
        } else if (formData.sort_by == "Sqm") {
            filterBy = "Living Area"
        } else if (formData.sort_by == "Lots") {
            filterBy = "Lot Size"
        }

        setFilterBy(() => filterBy);

    }, [formData.sort_by, formData.sort_dir]);

    useEffect(() => {
        if (prop_fetched && refresh) {
            LoadProperties();
        }
    }, [prop_fetched, refresh]);

    useEffect(() => {

        if (Array.isArray(properties)) {

            setFetchError("");
            if (total_records > 0) {

                const total_returned = properties.length;
                setTotalPage(Math.ceil(total_records / page_size));

                if (total_records > 0 && total_returned > 0) {
                    setAllPprops(properties.map((prop) => {
                        return <PropCardVar1 key={prop.draft_id} pro_info={prop} />
                    }));
                } else {
                    setAllPprops(() => [nothing_found]);
                }

            } else {

                //Making sure request has been sent
                if (prop_fetched) {
                    setAllPprops(() => [nothing_found]);
                } else {
                    setAllPprops(() => [<div className='w-full flex justify-center items-center min-h-60'>
                        <AiOutlineLoading3Quarters size={30} className='animate animate-spin' />
                    </div>])
                }

            }

        } else {
            //Making sure request has been sent
            if (prop_fetched) {
                setAllPprops(() => [nothing_found]);
            } else {
                setAllPprops(() => [<div className='w-full flex justify-center items-center min-h-60'>
                    <AiOutlineLoading3Quarters size={30} className='animate animate-spin' />
                </div>]);
            }
        }

    }, [properties]);

    useEffect(() => {
        dispatch(hidePageLoader());
        if (window.MLS_Util && startFetch) {
            LoadProperties();
        }
    }, [window.MLS_Util, startFetch, searchParams]);

    useEffect(() => {
        if (theme) {
            setThemeSett(theme.theme_settings);
        }
    }, [theme]);

    useEffect(() => {

        const handleClickOutside = (e: MouseEvent) => {
            if (sortBoxRef.current && !sortBoxRef.current.contains(e.target as Node)) {
                setSortShown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };

    }, [sortBoxRef]);

    useEffect(() => {

        const params: Record<string, any> = {};

        searchParams.forEach((value, key) => {
            // handle array-like params (?city=Lagos&city=Ikeja)
            if (params[key]) {
                params[key] = Array.isArray(params[key])
                    ? [...params[key], value]
                    : [params[key], value];
            } else {
                params[key] = value;
            }
        });

        if (!params.beds || params.beds == "") {
            params.beds = "Any";
        }

        if (!params.baths || params.baths == "") {
            params.baths = "Any";
        }

        params.delivery_uid = delivery_uid;
        params.property_sub_type = "All Residential";
        params.property_type = "Residential";
        params.sales_type = "For Sale";
        params.location = location_params;

        setFormData(params);
        setStartFetch(true);

    }, [searchParams, location_params, delivery_uid]);

    useEffect(() => {
        //Always start at page top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    if (themeSett && themeSett != null) {
        return (
            <section className="flex flex-col min-h-screen relative py-35 bg-gray-100" >
                {/* <NavVar1 transparent={false} /> */}

                <main className="w-full flex flex-col min-h-[55dvh]">
                    {/**  ======================= Contact Area Starts ====================== **/}
                    <div className="w-full relative pt-10 pb-16">
                        <div className="container mx-auto max-w-[1450px]">

                            {!prop_fetched && <div className='col-span-full h-[250px] bg-white flex items-center justify-center'>
                                <AiOutlineLoading3Quarters size={30} className='animate animate-spin' />
                            </div>}

                            {(prop_fetched) &&
                                <div className='w-full grid grid-cols-1 lg:grid-cols-8 gap-6 mt-0'>
                                    <div className='lg:col-span-6'>

                                        <div className=' col-span-full flex items-start justify-between'>
                                            <div className=' flex flex-col mb-4'>
                                                <div className='font-semibold text-3xl'>Search Results</div>
                                                <div className='font-medium text-base'>
                                                    {total_records} {total_records > 1 ? "properties" : "property"} found.
                                                </div>
                                            </div>

                                            <div className='relative z-50' ref={sortBoxRef}>
                                                <div className='flex items-center'>
                                                    <span className='mr-2 font-semibold'>Sort By:</span>
                                                    <button onClick={() => setSortShown(!sort_shown)}
                                                        className='flex items-center text-sky-700 cursor-pointer'>
                                                        <span className=''>{filter_by}</span>
                                                        <span className={`ml-1 ${sort_shown ? "rotate-180" : null}`}>
                                                            <MdOutlineKeyboardArrowDown size={22} />
                                                        </span>
                                                    </button>
                                                </div>

                                                <div className={`w-[250px] right-0 sm:right-0 absolute bg-transparent 
                                                    rounded-lg overflow-hidden shadow-2xl border border-gray-200 ${sort_shown ? "block" : "hidden"}`}>
                                                    <div className='w-full bg-white m-0  *:cursor-pointer *:py-4 *:px-4
                                                     *:flex *:justify-between *:items-center divide-y divide-gray-200'>
                                                        <div className="w-full hover:bg-gray-100" onClick={() => handleSort("Price", "DESC")}>
                                                            <span>Price (High to Low)</span>
                                                            {filter_by == "Price (High to Low)" ? <FaCheck size={18} className='text-green-700' /> : null}
                                                        </div>
                                                        <div className="w-full hover:bg-gray-100" onClick={() => handleSort("Price", "ASC")}>
                                                            <span>Price (Low to High)</span>
                                                            {filter_by == "Price (Low to High)" ? <FaCheck size={18} className='text-green-700' /> : null}
                                                        </div>
                                                        <div className="w-full hover:bg-gray-100" onClick={() => handleSort("Date", "DESC")}>
                                                            <span>Newest Firsts</span>
                                                            {filter_by == "Newest Firsts" ? <FaCheck size={18} className='text-green-700' /> : null}
                                                        </div>
                                                        <div className="w-full hover:bg-gray-100" onClick={() => handleSort("Date", "ASC")}>
                                                            <span>Oldest Firsts</span>
                                                            {filter_by == "Oldest Firsts" ? <FaCheck size={18} className='text-green-700' /> : null}
                                                        </div>
                                                        <div className="w-full hover:bg-gray-100" onClick={() => handleSort("Beds", "DESC")}>
                                                            <span>Bedrooms</span>
                                                            {filter_by == "Bedrooms" ? <FaCheck size={18} className='text-green-700' /> : null}
                                                        </div>
                                                        <div className="w-full hover:bg-gray-100" onClick={() => handleSort("Baths", "DESC")}>
                                                            <span>Bathrooms</span>
                                                            {filter_by == "Bathrooms" ? <FaCheck size={18} className='text-green-700' /> : null}
                                                        </div>
                                                        <div className="w-full hover:bg-gray-100" onClick={() => handleSort("Sqm", "DESC")}>
                                                            <span>Living Area</span>
                                                            {filter_by == "Living Area" ? <FaCheck size={18} className='text-green-700' /> : null}
                                                        </div>
                                                        <div className="w-full hover:bg-gray-100" onClick={() => handleSort("Lots", "DESC")}>
                                                            <span>Lot Size</span>
                                                            {filter_by == "Lot Size" ? <FaCheck size={18} className='text-green-700' /> : null}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {(fetchError == "" && Array.isArray(all_props)) &&
                                            <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                                                {all_props}
                                            </div>
                                        }

                                        {(fetchError == "" && total_page > 0) &&
                                            <ReactivePagination totalPage={total_page} curr_page={curr_page}
                                                changeTigger={setCurrPage} trigger_loader={setPropFetched}
                                                url_path={`${themeSett.theme_prefix}/property-search?${BuildPaginationLink(searchParams)}`} />
                                        }

                                        {fetchError != "" &&
                                            <div className='col-span-full h-[150px] bg-white text-red-600 flex items-center justify-center'>
                                                {fetchError}
                                            </div>
                                        }
                                    </div>

                                    <div className='hidden lg:block lg:col-span-2 space-y-10'>

                                        <div className='w-full'>
                                            <Advanced_Filter_1 setStartFetch={setStartFetch} formData={formData}
                                                setFormData={setFormData} OpenSaveSearch={OpenSaveSearch} />
                                        </div>

                                        <div className='w-full mt-12 flex flex-col space-y-8 *:border *:border-gray-100 *:shadow-lg'>
                                            <SideAds no_ads={2} />
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

export default MLSSearchVar1