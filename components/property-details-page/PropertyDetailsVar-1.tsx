"use client"

import usePropertyModal from "@/_hooks/usePropertyModal";
import { grayMapStyle, map_center, Place } from "@/_lib/data";
import { Helpers } from "@/_lib/helper";
import { hidePageLoader } from "@/app/GlobalRedux/app/appSlice";
import { RootState } from "@/app/GlobalRedux/store";
import AboutSection1 from "@/components/property-cards/AboutSection-1";
import AddressSection1 from "@/components/property-cards/AddressSection-1";
import AgentInfo1 from "@/components/property-cards/AgentInfo-1";
import AmmenitiesSection1 from "@/components/property-cards/AmmenitiesSection-1";
import BuildingsStructuresSection1 from "@/components/property-cards/BuildingsStructuresSection-1";
import DisclosuresSection1 from "@/components/property-cards/DisclosuresSection-1";
import ExteriorSection1 from "@/components/property-cards/ExteriorSection-1";
import FarmFeaturesSection1 from "@/components/property-cards/FarmFeaturesSection-1";
import FavoriteButton from "@/components/property-cards/FavoriteButton";
import FeaturesSeaction1 from "@/components/property-cards/FeaturesSeaction-1";
import FinancialSection1 from "@/components/property-cards/FinancialSection-1";
import Gallery from "@/components/property-cards/Gallery";
import InteriorSection1 from "@/components/property-cards/InteriorSection-1";
import RequestButtons1 from "@/components/property-cards/RequestButtons-1";
import UtilitiesSection1 from "@/components/property-cards/UtilitiesSection-1";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BiAngry, BiEnvelopeOpen, BiLink, BiMenu, BiShare, BiWalk } from "react-icons/bi";
import { BsYoutube } from "react-icons/bs";
import { MdOutlinePhotoLibrary, MdVideoFile } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { BsGear } from 'react-icons/bs';
import { BiRefresh, BiTrash } from 'react-icons/bi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
// import { GoogleMap, OverlayView } from '@react-google-maps/api';

const helper = new Helpers();
const PropertyDetailsVar1 = ({ is_theme = false, size = 20, raw_data = {} }: { is_theme?: boolean, size?: number, raw_data?: any }) => {

    const searchParams = useSearchParams();
    const params = useParams();
    const router = useRouter();
    const dispatch = useDispatch();

    const slug = params?.slug as string;
    const agent_info = useSelector((state: RootState) => state.agent);
    const brker_info = useSelector((state: RootState) => state.broker);
    const user = useSelector((state: RootState) => state.user);
    const theme = useSelector((state: RootState) => state.theme);
    const [themeSett, setThemeSett] = useState<any | null>(null);

    const parts = decodeURIComponent(slug)?.split("+");
    // const property_uid = parts.pop();
    // const property_uid = searchParams?.get("property_uid") as string || "";
    const property_uid = searchParams?.get("property_uid") as string || "3b9b4948-cdc7-42d0-affc-a88fb91545c7"; //Testing purpose
    const campaign_uid = searchParams?.get("campaign_uid") as string || "";

    const share_title = `Look at what i found on ${process.env.NEXT_PUBLIC_COMPANY_NAME}'s website`;

    const [places, setPlaces] = useState<Place[]>([]);
    // const mapRef = useRef<google.maps.Map | null>(null);

    const containerStyle = {
        width: '100%',
        height: '100%',
    };

    // map_center
    // places_categories

    const mapOptions = {
        fullscreenControl: true,
        mapTypeControl: false, // Remove other controls if needed
        streetViewControl: true,
        zoomControl: true,
        styles: grayMapStyle,
    };

    const empty_form_data = {
        user_uid: user?.user_info?.user_uid || "Guest",
        fullname: `${user?.user_info?.firstname} ${user?.user_info?.lastname}`,
        phone_number: user?.user_info?.phone_1 || user?.user_info?.phone_2,
        email: user?.user_info?.email || user?.user_info?.email,
        prefer_date: "ASAP",
        exact_date: "Select a Day",
        notes: "",
        prop_url: window.location.href,
        mailer: "Nodemailer",
        message_type: "Showing Request"
    }

    const [mapCenter, setMapCenter] = useState(map_center);
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const [google_map_key, setGoogleMapKey] = useState("");
    const [formData, setFormData] = useState(empty_form_data);
    const [page_url, setPageURL] = useState("");
    const [prop, setProp] = useState<any>({});
    const [page_error, setPageError] = useState("");
    const [gallery, setGallery] = useState<React.JSX.Element>(<div className='col-span-2 bg-white flex items-center justify-center h-full'>
        <AiOutlineLoading3Quarters size={30} className='animate-spin' />
    </div>);
    const [showGallery, setShowGallery] = useState(false);
    const [initialSlide, setInitialSlide] = useState(0);
    const [activeDivId, setActiveDivId] = useState<string | null>(null);
    const [places_loading, setPlacesLoading] = useState(false);
    const [prop_fetched, setPropFetched] = useState(false);
    const [fetchError, setFetchError] = useState("");
    const [units, setUnits] = useState<any[]>([]);
    const [units_fetched, setUnitsFetched] = useState(false);
    const [sectionHover, setSectionHover] = useState<boolean>(false);

    const [isMenuOpened, setIsMenuOpened] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const [modal_page, setModalPage] = useState<"Enquiry" | "Tour" | "Share" | null>(null);
    const prop_modal = useSelector((state: RootState) => state.user.prop_modal);

    usePropertyModal({ page: modal_page, property_info: prop });

    const handleSettingsClick = () => {
        // Send a message to the parent window
        window.parent.postMessage(
            {
                type: 'OPEN_EDITOR_SETTINGS',
                data: {
                    "category": "property_details",
                    "type": "section",
                    "component": "PropertyDetailsVar1",
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
                component_type: "PropertyDetails"
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

    const LoadPropertyInfo = async () => {

        const payload = {
            "account_id": process.env.NEXT_PUBLIC_ACCOUNT_ID,
            "property_uid": property_uid,
            "fields": `property_uid,mls_id,is_promoted,listing_price,listing_type,lot_size,mls_number,property_status,property_sub_type,
            property_type,square_meter,title,year_built,stories,street_address,city,state,local_government,postal_code,neighborhood,
            bedrooms,bathrooms,total_rooms,garage_spaces,carport_spaces,agent_info,primary_photo,high_photo_lists,video_tour_url,
            virtual_tour_url,property_description,technology_equipment,interior_features,exterior_features,half_bathrooms,full_bathrooms,
            total_rooms,basement,parking,off_street_parking_spaces,flooring,kitchen_features,heating,cooling,office_features,
            exterior_material,roof_type,lot_features,property_view,agricultural_features,agricultural_operations,land_and_terrain,
            recreational_features,buildings_structures,fencing,land_and_terrain,access,electricity,gas,energy_and_sustainability,
            water_source,sewer,internet,utilities_at_site,common_areas,fuel_and_storage,property_taxes,hoa_fees,hoa_amount,hoa_frequency,
            lease_duration,lease_security_deposit,lease_pet_deposit,gross_income,gross_scheduled_income,operating_expense,
            operating_expense_includes,owner_pays,tenant_pays,financial_options,accessibility_features,green_features,security_features,
            community_amenities,restrictions,farm_features,lifestyle_comfort,technology_equipment,seller_disclosure,special_assessments,
            environmental_hazards`
        }

        const response = await window.MLS_Util.LoadPropertyInfo(payload);

        let resp_message = response.message;
        let status_code = response.status_code;
        if (status_code == 200) {

            setProp(response.data.property_info);
            const propAddress = `${response.data.address}, ${response.data.city}, ${response.data.state} ${response.data.zip_code}`;
            setMapCenter((prev) => {
                return {
                    lat: parseFloat(response.data.latitude),
                    lng: parseFloat(response.data.longitude),
                }
            });

            setFormData(prev => {
                return {
                    ...prev,
                    notes: `I'd like to request a showing of ${propAddress} (MLS® #${response.data.mls_number}). Thank you!`,
                }
            });

        } else {
            setFetchError(resp_message);
        }

        setPropFetched(true);
        dispatch(hidePageLoader());

    }

    const handleButtonClick = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const y = element.getBoundingClientRect().top + window.scrollY - 105;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    useEffect(() => {

        if (prop_fetched) {
            const handleScroll = () => {
                const windscroll = window.scrollY || document.documentElement.scrollTop;
                document.querySelectorAll('.section').forEach(function (section, i) {
                    let id = section.id;

                    // The number at the end of the next line is how many pixels from the top you want it to activate.
                    if (section instanceof HTMLElement) {
                        var sectionTop = section.offsetTop - 105;
                        if (sectionTop <= windscroll) {
                            const all_actives = document.querySelector('.section.active')
                            all_actives?.classList.remove('active');
                            document.querySelectorAll('.section')[i].classList.add('active');
                            setActiveDivId(id);
                        }
                    }
                });
            };

            window.addEventListener('scroll', handleScroll);
            return () => {
                window.removeEventListener('scroll', handleScroll);
            };
        }

    }, [prop_fetched]);

    const OpenGallery = (index: number) => {
        setInitialSlide(index);
        setShowGallery(true);
        document.body.style.overflowY = 'hidden';
    }

    const closeGallery = () => {
        document.body.style.overflowY = 'auto';
        setShowGallery(false);
    }

    useEffect(() => {

        if (prop_fetched) {

            //Always start at page top
            window.scrollTo({ top: 0, behavior: 'smooth' });

            let gallery = <></>
            const TourComponent = <div className=" absolute right-3 bottom-3 flex items-center space-x-2.5">
                {(prop.virtual_tour_url && prop.virtual_tour_url != "") && (
                    <Link href={prop.virtual_tour_url} target="_blank" className='w-fit bg-white py-3 px-4 flex 
                    justify-center items-center rounded-md cursor-pointer border border-gray-100 shadow-md hover:drop-shadow-lg'>
                        <BiWalk size={22} className='mr-1' /> <span>Virtual Tour</span>
                    </Link>
                )}

                {(prop.video_tour_url && prop.video_tour_url != "") && (
                    <Link href={prop.video_tour_url} target="_blank" className='w-fit bg-white py-3 px-4 flex 
                        justify-center items-center rounded-md cursor-pointer border border-gray-100 shadow-md hover:drop-shadow-lg'>
                        <BsYoutube size={22} className='mr-1' /> <span>Video Tour</span>
                    </Link>
                )}
            </div>

            if (prop.high_photo_lists && prop.high_photo_lists.length > 0) {

                if (prop.high_photo_lists.length == 1) {
                    gallery = <div className='w-full grid grid-cols-1 gap-[2px] h-[70vh] relative overflow-hidden' id="gallery">
                        <div className='h-full bg-cover object-contain cursor-pointer' onClick={() => OpenGallery(0)} style={{ backgroundImage: `url(${prop.high_photo_lists[0]})`, backgroundPosition: "center", }}></div>

                        {TourComponent}
                    </div>
                } else if (prop.high_photo_lists.length == 2) {

                    gallery = <div className='w-full grid grid-cols-2 gap-[2px] h-[70vh] relative overflow-hidden' id="gallery">
                        <div className='h-full col-span-2 md:col-span-1 bg-cover object-contain cursor-pointer' onClick={() => OpenGallery(0)} style={{ backgroundImage: `url(${prop.high_photo_lists[0]})`, backgroundPosition: "center", }}></div>
                        <div className='h-full relative cursor-pointer'>
                            <div className={`h-full grid grid-cols-1`}>
                                <div className='bg-cover object-contain' onClick={() => OpenGallery(1)} style={{ backgroundImage: `url(${prop.high_photo_lists[1]})`, backgroundPosition: "center", }}></div>
                            </div>
                        </div>

                        {TourComponent}
                    </div>

                } else if (prop.high_photo_lists.length == 3) {

                    gallery = <div className='w-full grid grid-cols-2 gap-[2px] h-[70vh] relative overflow-hidden' id="gallery">
                        <div className='h-full col-span-2 md:col-span-1 bg-cover object-contain cursor-pointer' onClick={() => OpenGallery(0)} style={{ backgroundImage: `url(${prop.high_photo_lists[0]})`, backgroundPosition: "center", }}></div>
                        <div className='h-full relative cursor-pointer'>
                            <div className={`h-full grid grid-cols-1 gap-[2px]`}>
                                <div className='bg-cover object-contain' onClick={() => OpenGallery(1)} style={{ backgroundImage: `url(${prop.high_photo_lists[1]})`, backgroundPosition: "center", }}></div>
                                <div className='bg-cover object-contain' onClick={() => OpenGallery(2)} style={{ backgroundImage: `url(${prop.high_photo_lists[2]})`, backgroundPosition: "center", }}></div>
                            </div>
                        </div>

                        {TourComponent}
                    </div>

                } else if (prop.high_photo_lists.length == 4) {

                    gallery = <div className='w-full grid grid-cols-2 gap-[2px] h-[70vh] relative overflow-hidden' id="gallery">
                        <div className='h-full col-span-2 md:col-span-1 bg-cover object-contain cursor-pointer' onClick={() => OpenGallery(0)} style={{ backgroundImage: `url(${prop.high_photo_lists[0]})`, backgroundPosition: "center", }}></div>
                        <div className='h-full relative cursor-pointer'>
                            <div className={`h-full w-full grid grid-cols-2 gap-[2px]`}>
                                <div className='bg-cover object-contain' onClick={() => OpenGallery(1)} style={{ backgroundImage: `url(${prop.high_photo_lists[1]})`, backgroundPosition: "center", }}></div>
                                <div className='bg-cover object-contain' onClick={() => OpenGallery(2)} style={{ backgroundImage: `url(${prop.high_photo_lists[2]})`, backgroundPosition: "center", }}></div>
                                <div className='bg-cover object-contain col-span-2' onClick={() => OpenGallery(3)} style={{ backgroundImage: `url(${prop.high_photo_lists[3]})`, backgroundPosition: "center", }}></div>
                            </div>
                        </div>

                        {TourComponent}
                    </div>

                } else {

                    gallery =
                        <div className='w-full grid grid-cols-2 gap-[2px] h-[70vh] relative overflow-hidden' id="gallery">
                            <div className='h-full col-span-2 md:col-span-1 bg-cover object-contain cursor-pointer' onClick={() => OpenGallery(0)}
                                style={{ backgroundImage: `url(${prop.high_photo_lists[0]})`, backgroundPosition: "center", }}>

                            </div>
                            <div className='hidden md:flex md:col-span-1 h-full cursor-pointer'>
                                <div className={`h-full w-full grid grid-cols-2 gap-[2px]`}>
                                    <div className='bg-cover object-contain' onClick={() => OpenGallery(1)} style={{ backgroundImage: `url(${prop.high_photo_lists[1]})`, backgroundPosition: "center", }}></div>
                                    <div className='bg-cover object-contain' onClick={() => OpenGallery(2)} style={{ backgroundImage: `url(${prop.high_photo_lists[2]})`, backgroundPosition: "center", }}></div>
                                    <div className='bg-cover object-contain' onClick={() => OpenGallery(3)} style={{ backgroundImage: `url(${prop.high_photo_lists[3]})`, backgroundPosition: "center", }}></div>
                                    <div className='bg-cover object-contain' onClick={() => OpenGallery(4)} style={{ backgroundImage: `url(${prop.high_photo_lists[4]})`, backgroundPosition: "center", }}></div>
                                </div>
                            </div>

                            <div className='w-[200px] absolute left-2 bottom-2 bg-white py-3 px-4 flex justify-center items-center 
                                rounded-md cursor-pointer border border-gray-100 shadow-md hover:drop-shadow-lg' onClick={() => OpenGallery(0)}>
                                <MdOutlinePhotoLibrary size={22} className='mr-1' /> <span>See all {prop.high_photo_lists.length} photos</span>
                            </div>

                            {TourComponent}

                        </div>

                }

            } else {

                const primary_photo = prop.primary_photo ? `${prop.primary_photo}` : "../../house-not-found-placeholder.png"
                gallery = <div className='w-full grid grid-cols-1 gap-[2px] h-[70vh] relative overflow-hidden' id="gallery">
                    <div className='h-full bg-cover object-contain cursor-pointer'
                        style={{ backgroundImage: `url(${primary_photo})`, backgroundPosition: "center", }}>
                    </div>

                    {TourComponent}
                </div>
            }

            setGallery(gallery);
        }

    }, [prop_fetched]);

    useEffect(() => {
        dispatch(hidePageLoader());
        if (window.MLS_Util) {
            LoadPropertyInfo();
        }
    }, [window.MLS_Util]); //, searchParams


    useEffect(() => {

        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpened(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };

    }, []);

    useEffect(() => {
        if (!prop_modal.shown) {
            setModalPage(null);
        }
    }, [prop_modal.shown]);

    useEffect(() => {
        if (theme) {
            setThemeSett(theme.theme_settings);
        }
    }, [theme]);

    useEffect(() => {
        //Always start at page top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    if (themeSett && themeSett != null) {
        return (
            <section className="flex flex-col min-h-screen" >

                <main className="w-full flex flex-col min-h-[55dvh]">
                    {/**  ======================= Contact Area Starts ====================== **/}
                    <div className="w-full relative pb-16">
                        <div className="w-full mx-auto">

                            {
                                !prop_fetched && <>
                                    <div className='w-full bg-white flex items-center justify-center h-[300px]'>
                                        <AiOutlineLoading3Quarters size={30} className='animate-spin' />
                                    </div>
                                </>
                            }

                            {(prop_fetched && fetchError != "") &&
                                <div className='col-span-full h-[150px] bg-white text-red-600 flex items-center justify-center'>
                                    {fetchError}
                                </div>
                            }

                            {(prop_fetched && fetchError == "") && (
                                <>
                                    {gallery}

                                    <div className='sticky top-0 z-20 shadow bg-white w-full border-b border-t border-gray-300'>
                                        <div className='container m-auto max-w-[1200px] px-3 xl:px-0 overflow-y-hidden overflow-x-auto'>

                                            <div className='w-full min-w-[1050px] md:min-w-[full] grid grid-cols-2 gap-y-3 '>
                                                <div className='grid grid-cols-[max-content]'>
                                                    <div className='w-full flex items-center *:capitalize *:py-6 space-x-8 *:cursor-pointer *:border-b-2 *:border-transparent'>
                                                        <div className={`hover:border-gray-900 ${activeDivId == "about" ? "!border-gray-900" : null}`}
                                                            onClick={() => handleButtonClick('about')}>Overview</div>

                                                        <div className={`hover:border-gray-900 ${activeDivId == "address" ? "!border-gray-900" : null}`}
                                                            onClick={() => handleButtonClick('address')}>Address</div>

                                                        <div className={`hover:border-gray-900 ${activeDivId == "features" ? "!border-gray-900" : null}`}
                                                            onClick={() => handleButtonClick('features')}>Features</div>

                                                        <div className={`hover:border-gray-900 ${activeDivId == "interior" ? "!border-gray-900" : null}`}
                                                            onClick={() => handleButtonClick('interior')}>Interior</div>

                                                        <div className={`hover:border-gray-900 ${activeDivId == "exterior" ? "!border-gray-900" : null}`}
                                                            onClick={() => handleButtonClick('exterior')}>Exterior</div>

                                                        <div className={`hover:border-gray-900 ${activeDivId == "ammenities" ? "!border-gray-900" : null}`}
                                                            onClick={() => handleButtonClick('ammenities')}>Ammenities</div>

                                                        <div className={`hover:border-gray-900 ${activeDivId == "utilities" ? "!border-gray-900" : null}`}
                                                            onClick={() => handleButtonClick('utilities')}>Utilities</div>

                                                        <div className={`hover:border-gray-900 ${activeDivId == "financial" ? "!border-gray-900" : null}`}
                                                            onClick={() => handleButtonClick('financial')}>Financial</div>

                                                        <div className={`hover:border-gray-900 ${activeDivId == "gallery" ? "!border-gray-900" : null}`}
                                                            onClick={() => OpenGallery(0)}>Gallery</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`absolute top-0 bottom-0 right-0 p-4 flex items-center justify-center space-x-3.5`}>

                                            <FavoriteButton themeSett={themeSett} property_uid={prop.property_uid} />

                                            <div className='p-3 rounded z-40 cursor-pointer bg-gray-100 hover:shadow-2xl text-gray-900 
                                            top-[10px] right-[10px]' ref={menuRef} >
                                                <div className=' flex items-center justify-center space-x-1.5 text-sm'
                                                    onClick={() => setIsMenuOpened(!isMenuOpened)}>
                                                    <BiMenu size={20} /> <span>Menu</span>
                                                </div>

                                                <div className={`${isMenuOpened ? "block" : "hidden"} w-[260px] absolute top-[104%] right-0 shadow-2xl 
                                                        rounded bg-gray-50 z-30`}>
                                                    <div className='w-full flex flex-col max-h-[400px] overflow-y-auto font-normal text-base
                                                        *:flex *:items-center *:space-x-1.5 *:px-6 *:py-4 divide-y divide-gray-200'>

                                                        <div className=' hover:bg-gray-200' onClick={() => setModalPage("Enquiry")}>
                                                            <BiEnvelopeOpen size={20} />
                                                            <div>Make Enquiry</div>
                                                        </div>

                                                        <div className=' hover:bg-gray-200' onClick={() => setModalPage("Tour")}>
                                                            <BiWalk size={20} />
                                                            <div>Schedule a Tour</div>
                                                        </div>

                                                        <div className=' hover:bg-gray-200' onClick={() => setModalPage("Share")}>
                                                            <BiShare size={20} />
                                                            <div>Share Listing</div>
                                                        </div>

                                                        <Link href={`${agent_info?.review_link}`} target='_blank' className=' hover:bg-gray-200'>
                                                            <BiLink size={17} /> <span>View reviews on RaR</span>
                                                        </Link>

                                                        <Link href={`${agent_info?.report_link}`} target='_blank' className=' text-red-600 hover:bg-gray-200'>
                                                            <BiAngry size={17} /> <span>Report Agent</span>
                                                        </Link>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='w-full py-10'>
                                        <div className='container m-auto max-w-[1260px] px-3 xl:px-0'>
                                            <div className='w-full grid grid-cols-1 lg:grid-cols-6 gap-8'>
                                                <div className='lg:col-span-4'>

                                                    <AboutSection1 prop={prop} />
                                                    <AddressSection1 prop={prop} />
                                                    <FeaturesSeaction1 prop={prop} />

                                                    {(prop.property_type !== "Multi-Unit" && prop.property_type !== "Land"
                                                        && prop.property_type !== "Farm/Ranch") &&
                                                        <InteriorSection1 prop={prop} />
                                                    }

                                                    {(prop.property_type !== "Multi-Unit" && prop.property_type !== "Farm/Ranch") &&
                                                        <ExteriorSection1 prop={prop} />
                                                    }

                                                    {(prop.property_type == "Farm/Ranch") &&
                                                        <FarmFeaturesSection1 prop={prop} />
                                                    }

                                                    {(prop.property_type == "Farm/Ranch") &&
                                                        <BuildingsStructuresSection1 prop={prop} />
                                                    }

                                                    <AmmenitiesSection1 prop={prop} />
                                                    <UtilitiesSection1 prop={prop} />
                                                    <FinancialSection1 prop={prop} />
                                                    <DisclosuresSection1 prop={prop} />

                                                </div>

                                                <div className='lg:col-span-2 flex flex-col'>
                                                    <AgentInfo1 primary_photo={prop.primary_photo} prop={prop} />
                                                    <RequestButtons1 prop={prop} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </>
                            )}

                        </div>
                    </div>
                </main>

                {(prop_fetched && fetchError == "") && (
                    <Gallery show={showGallery} photos={prop.high_photo_lists} closeGallery={closeGallery} initialSlide={initialSlide} />
                )}

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

export default PropertyDetailsVar1