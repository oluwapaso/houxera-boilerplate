"use client"

import { hidePageLoader } from '@/app/GlobalRedux/app/appSlice';
import { AppDispatch, RootState } from '@/app/GlobalRedux/store';
import SideAds from '@/components/ads/SideAds';
import SaveSearchComponent from '@/components/modals/SaveSearch';
import ReactivePagination from '@/components/ReactivePagination';
import Advanced_Filter_1 from '@/components/search-components/Advanced_Filter_1';
import { ReadonlyURLSearchParams, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { BiSave } from 'react-icons/bi';
import { FaCheck } from 'react-icons/fa6';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { getComponent } from '../registry';
import Modal from '../modals/Modal';
import { FaSave } from 'react-icons/fa';
import { Helpers } from '@/_lib/helper';
import { RiListSettingsLine } from 'react-icons/ri';
import ComponentSettings from '../editor-items/ComponentSettings';

const helpers = new Helpers();
const MLSSearchVar1 = ({ is_theme = false, size = 20, raw_data = {} }: { is_theme?: boolean, size?: number, raw_data?: any }) => {

    const dispatch = useDispatch<AppDispatch>();
    const searchParams = useSearchParams();
    const theme = useSelector((state: RootState) => state.theme);
    const [themeSett, setThemeSett] = useState<any | null>(null);
    const [first_comp_pt, setFirstCompPt] = useState("pt-30 md:pt-36");

    const page_size = parseInt(raw_data.size) || size;
    const curr_page = parseInt(searchParams?.get("page") as string) || 1;
    const location_params = searchParams?.get("location") as string || "";
    const status_params = searchParams?.get("status") as string || "Active";
    // let all_posts: React.JSX.Element[] = [];

    const company_unique_id = searchParams?.get("company_unique_id") as string || "";
    const channel_uid = searchParams?.get("channel_uid") as string || "";

    //The delivery uid has to come from the components settings
    // const delivery_uid = "xx-8992hhsjsj-sjsjs";

    const [formData, setFormData] = useState<any>({});
    const [properties, setProperties] = useState<any[]>([]);
    const [prop_fetched, setPropFetched] = useState(false);
    const [startFetch, setStartFetch] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [fetchError, setFetchError] = useState("");
    const [currPage, setCurrPage] = useState(curr_page);
    const [all_props, setAllPprops] = useState<React.JSX.Element[]>([]);
    const [total_records, setTotalRecords] = useState(0);
    const [total_page, setTotalPage] = useState(0);
    const [total_filters, setTotalFilters] = useState(0);

    const [filter_by, setFilterBy] = useState("Price (High to Low)"); //Default
    const [sort_shown, setSortShown] = useState(false);
    const sortBoxRef = useRef<HTMLDivElement>(null);
    const [sectionHover, setSectionHover] = useState<boolean>(false);
    const [filter_shown, setFilterShown] = useState(false);
    const filterBoxRef = useRef<HTMLDivElement>(null);

    const [showModal, setShowModal] = useState(false);
    const [modal_title, setModalTitle] = useState(<></>);
    const [modal_children, setModalChildren] = useState({} as React.ReactNode);

    const closeModal = () => {
        setShowModal(false);
    }

    const nothing_found = <div className='w-full text-red-600 flex justify-center items-center min-h-30'>
        No result found
    </div>

    const LoadProperties = async () => {

        setTotalRecords(0);
        console.log("raw_data.delivery_uid", raw_data.delivery_uid)
        const payload = {
            "account_id": is_theme ? company_unique_id : process.env.NEXT_PUBLIC_ACCOUNT_ID,
            "channel_uid": is_theme ? channel_uid : process.env.NEXT_PUBLIC_CHANNEL_UID,
            "delivery_uid": raw_data.delivery_uid,
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
        setModalChildren(<SaveSearchComponent closeModal={closeModal} formData={formData} setFormData={setFormData} is_theme={is_theme} />);
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
        var totalFilters = 0;

        [formData.location, formData.status && formData.status, formData.sales_type, formData.property_sub_type, formData.beds,
        formData.baths, formData.min_price, formData.max_price, formData.min_living_area, formData.max_living_area,
        formData.min_lot_size, formData.max_lot_size, formData.must_have].forEach((form_data) => {
            if (form_data && form_data != "" && form_data != "Any") {
                totalFilters += 1;
            }
        })

        setTotalFilters(totalFilters);
    }, [formData]);

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

                    const PropertyCard = getComponent(themeSett?.property_card);
                    if (PropertyCard) {
                        setAllPprops(properties.map((prop) => {
                            return <PropertyCard key={prop.draft_id} pro_info={prop} is_theme={is_theme} />
                        }));
                    } else {
                        setAllPprops(() => [<div className='w-full flex justify-center items-center min-h-60'>
                            Property card component not found
                        </div>])
                    }

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

            if (filterBoxRef.current && !filterBoxRef.current.contains(e.target as Node)) {
                setFilterShown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };

    }, [sortBoxRef, filterBoxRef]);

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

        params.delivery_uid = raw_data.delivery_uid;
        params.property_sub_type = "All Residential";
        params.property_type = "Residential";
        params.sales_type = "For Sale";
        params.location = location_params;
        params.status = status_params;

        setFormData(params);
        setStartFetch(true);

    }, [searchParams, status_params, location_params, raw_data.delivery_uid]);

    useEffect(() => {
        //Always start at page top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    useEffect(() => {
        if (filter_shown) {
            document.body.style.overflowY = 'hidden';
        } else {
            document.body.style.overflowY = 'auto';
        }
    }, [filter_shown]);

    useEffect(() => {

        if (raw_data?.component_index !== 0) return;

        const navType = themeSett?.nav_component?.type;

        if (navType === "NavVar6") {
            setFirstCompPt("pt-36");
            return;
        }

        if (navType === "NavVar7") {
            const updatePadding = () => {
                const nav = document.getElementById("main-nav");
                const isMobile = nav?.getAttribute("data-is-mobile") === "true";
                // Adjust these values to whatever looks correct
                setFirstCompPt(isMobile ? "pt-40" : "pt-55");
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

    if (themeSett && themeSett != null) {
        return (
            <section className={` flex flex-col min-h-screen relative ${first_comp_pt} pb-15 px-4 xs:px-6 bg-gray-100`}>

                <div className="container mx-auto max-w-[1450px]">

                    {!prop_fetched && <div className='col-span-full h-[250px] bg-white flex items-center justify-center'>
                        <AiOutlineLoading3Quarters size={30} className='animate animate-spin' />
                    </div>}

                    {(prop_fetched) &&
                        <div className='w-full grid grid-cols-1 lgScrn:grid-cols-8 gap-6 mt-0'>
                            <div className='lgScrn:col-span-6'>

                                <div className=' col-span-full flex flex-col max-sm:space-y-1.5 sm:flex-row items-start 
                                sm:justify-between max-sm:mb-4'>
                                    <div className=' flex flex-col mb-4'>
                                        <div className='font-semibold text-2xl md:text-3xl'>{raw_data.header || "Search Results"}</div>
                                        <div className='font-medium text-sm md:text-base flex items-center space-x-4.5'>
                                            <div>{total_records} {total_records > 1 ? "properties" : "property"} found.</div>
                                            <div className=' flex items-center space-x-1.5 text-sky-600 font-medium 
                                            cursor-pointer hover:text-sky-800'
                                                onClick={OpenSaveSearch}>
                                                <FaSave size={16} className='shrink-0' /> <span>Save this result</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='max-sm:w-full max-sm:grid grid-cols-3 xs:grid-cols-2 max-sm:gap-2.5 sm:flex sm:items-center sm:space-x-2.5'>
                                        <div className='col-span-2 xs:col-span-1 shrink relative z-40 bg-white shadow-md hover:shadow-xl rounded-md' ref={sortBoxRef}>
                                            <div className='flex flex-col py-2 md:py-2.5 px-2.5 md:px-4 cursor-pointer'
                                                onClick={() => setSortShown(!sort_shown)}>
                                                <span className='mr-2 font-semibold text-sm md:text-base cursor-pointer'>Sort By</span>
                                                <button className='w-full flex items-center justify-between text-gray-500 text-sm cursor-pointer'>
                                                    <span className=' cursor-pointer'>{filter_by}</span>
                                                    <span className={`ml-1 ${sort_shown ? "rotate-180" : null}`}>
                                                        <MdOutlineKeyboardArrowDown size={22} />
                                                    </span>
                                                </button>
                                            </div>

                                            <div className={`w-[250px] right-0 sm:right-0 absolute bg-transparent 
                                                rounded-lg overflow-hidden shadow-2xl border border-gray-200 ${sort_shown ? "block" : "hidden"}`}>
                                                <div className='w-full bg-white m-0 *:cursor-pointer *:py-4 *:px-4
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

                                        <div className={`col-span-1 lgScrn:hidden relative ${filter_shown ? "z-60" : "z-10"} bg-white shadow-md 
                                            hover:shadow-xl rounded-md`} ref={filterBoxRef}>
                                            <div className='flex items-center justify-between space-x-1.5 py-2 md:py-2.5 px-2.5 md:px-4 cursor-pointer'
                                                onClick={() => setFilterShown(!filter_shown)}>

                                                <div className='flex flex-col '>
                                                    <span className='mr-2 font-semibold text-sm md:text-base'>Filters</span>
                                                    <button className='flex items-center text-gray-500 text-sm cursor-pointer'>
                                                        <span className=''>{total_filters} filter{total_filters > 1 ? "s" : null}</span>
                                                    </button>
                                                </div>

                                                <div className='hidden 3xs:block shrink-0'>
                                                    <RiListSettingsLine size={25} />
                                                </div>
                                            </div>

                                            <div className={`w-full h-[100dvh] fixed z-60 right-0 top-0 bg-black/20 backdrop-blur-2xl 
                                                ${filter_shown ? "flex justify-end" : "hidden"}`}>

                                                <div className='w-full max-w-[450px] bg-white max-h-[100dvh] relative overflow-hidden'>
                                                    <Advanced_Filter_1 setStartFetch={setStartFetch} formData={formData} via={"Mobile"}
                                                        is_theme={is_theme} setFormData={setFormData} OpenSaveSearch={OpenSaveSearch}
                                                        setFilterShown={setFilterShown} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {(fetchError == "" && Array.isArray(all_props)) &&
                                    <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6'>
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

                            <div className='hidden lgScrn:block lgScrn:col-span-2 space-y-10'>

                                <div className='w-full'>
                                    <Advanced_Filter_1 setStartFetch={setStartFetch} formData={formData} is_theme={is_theme}
                                        setFormData={setFormData} OpenSaveSearch={OpenSaveSearch} />
                                </div>

                                <div className='w-full mt-12 flex flex-col space-y-8 *:border *:border-gray-100 *:shadow-lg'>
                                    <SideAds no_ads={2} />
                                </div>
                            </div>
                        </div>
                    }
                </div>

                {is_theme && <ComponentSettings raw_data={raw_data} category='mls_search' component='MLSSearchVar1' component_type='MlsSearch' />}

                <Modal show={showModal} children={modal_children} width={550} closeModal={closeModal} title={modal_title} />
            </section>
        )
    }
}

export default MLSSearchVar1