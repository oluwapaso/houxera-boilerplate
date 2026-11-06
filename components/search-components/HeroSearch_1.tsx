'use client';

import { RootState } from '@/app/GlobalRedux/store';
import React, { useEffect, useState } from 'react'
import { BsSearch } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import LocationLookupInput from './LocationLookupInput';
import PropertyTypeDD from './PropertyTypeDD';
import PriceRangeDD from './PriceRangeDD';
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation';
import moment from 'moment';
import { hidePageLoader, showPageLoader } from '@/app/GlobalRedux/app/appSlice';
import { Helpers } from '@/_lib/helper';

const helpers = new Helpers();
const HeroSearch_1 = ({ raw_data = {} }: { raw_data?: any }) => {

    const router = useRouter();
    const dispatch = useDispatch();

    const theme = useSelector((state: RootState) => state.theme);
    const [activeTab, setActiveTab] = useState('Buy');
    const [themeSett, setThemeSett] = useState<any | null>(null);
    const [formData, setFormData] = useState<any>({
        "price_range": "No Min. - No Max."
    });

    const setTab = (tab: string) => {
        setActiveTab(tab);
        setFormData((prev: any) => {
            return {
                ...prev,
                property_type: "",
                property_sub_type: "",
            }
        });
    }

    const PropertyTypeDD_Data: any = {
        form_data: formData,
        set_form_data: setFormData,
        property_type: formData.property_type,
        property_sub_type: formData.property_sub_type,
        active_tab: activeTab
    }

    const Run_MLS_Search = () => {

        // if (!formData.location || formData.location == "") {
        //     toast.error("Select a valid location");
        //     return false;
        // }

        if (!formData.property_sub_type || formData.property_sub_type == "") {
            toast.error("Select a valid property type");
            return false;
        }

        var sales_type = "For Sale"
        if (activeTab == "Rent") {
            sales_type = "For Rent"
        } else if (activeTab == "Short-Let") {
            sales_type = "Short-Let"
        }

        dispatch(showPageLoader());
        router.push(`${themeSett.theme_prefix}/property-search?location=${formData.location}&state=${formData.state}&sales_type=${sales_type}&property_type=${formData.property_type}&property_sub_type=${formData.property_sub_type}&status=Active&min_price=${formData.min_price ? formData.min_price : ""}&max_price=${formData.max_price ? formData.max_price : ""}&_version=${moment().unix()}`);
    }

    useEffect(() => {
        if (theme) {
            setThemeSett(theme.theme_settings);
        }
    }, [theme]);

    if (themeSett && themeSett != null) {
        return (
            <div className=' w-full flex flex-col drop-shadow-2xl relative z-30'>
                <div className=' w-full flex items-center divide-x divide-gray-200/30 *:first:rounded-tl-2xl 
                    *:last:rounded-tr-2xl *:flex *:items-center font-medium text-sm lg:text-base *:px-5 *:py-3 lg:*:px-8 
                    lg:*:py-4 *:text-white cursor-pointer '>
                    {(Array.isArray(raw_data.search_tabs) && raw_data.search_tabs.includes("Buy Tab")) ?
                        <div className={`${activeTab == "Buy"
                            ? `bg-${themeSett.primary_color} hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)}`
                            : `bg-${themeSett.secondary_color} hover:bg-${helpers.adjustColorShade(themeSett.secondary_color, -1)}`}`}
                            onClick={() => setTab("Buy")}>Buy</div>
                        : null
                    }

                    {(Array.isArray(raw_data.search_tabs) && raw_data.search_tabs.includes("Rent Tab")) ?
                        <div className={`${activeTab == "Rent"
                            ? `bg-${themeSett.primary_color} hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)}`
                            : `bg-${themeSett.secondary_color} hover:bg-${helpers.adjustColorShade(themeSett.secondary_color, -1)}`}`}
                            onClick={() => setTab("Rent")}>Rent</div>
                        : null
                    }

                    {(Array.isArray(raw_data.search_tabs) && raw_data.search_tabs.includes("Short-Let Tab")) ?
                        <div className={`${activeTab == "Short-Let"
                            ? `bg-${themeSett.primary_color} hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)}`
                            : `bg-${themeSett.secondary_color} hover:bg-${helpers.adjustColorShade(themeSett.secondary_color, -1)}`}`}
                            onClick={() => setTab("Short-Let")}>Short-Let</div>
                        : null
                    }
                </div>

                <div className='w-full relative z-30'>

                    <div className=' w-full lg:w-[950px] z-30 px-5 py-5 rounded-2xl rounded-tl-none bg-white 
                        grid grid-cols-1 lg:grid-cols-[4fr_3fr_4fr_70px] gap-3.5  *:flex *:flex-col'>

                        <div className='lg:grid-cols-1'>
                            <div className='font-semibold text-lg'>Location</div>
                            <div className='w-full border-b border-gray-200'>
                                <LocationLookupInput props={PropertyTypeDD_Data} setFormData={setFormData} />
                            </div>
                        </div>

                        <div className='lg:grid-cols-1'>
                            <div className='font-semibold text-lg'>Property Type</div>
                            <div className='w-full border-b border-gray-200'>
                                <PropertyTypeDD props={PropertyTypeDD_Data} />
                            </div>
                        </div>

                        <div className='lg:grid-cols-1'>
                            <div className='font-semibold text-lg'>Price Range</div>
                            <div className='w-full border-b border-gray-200'>
                                <PriceRangeDD props={PropertyTypeDD_Data} raw_data={raw_data} />
                            </div>
                        </div>

                        <div className={` py-3 tab:py-0 lg:grid-cols-1 bg-${themeSett.primary_color} 
                            hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)} 
                            rounded-lg flex items-center justify-center text-white cursor-pointer hover:shadow-2xl `}
                            onClick={() => Run_MLS_Search()}>
                            <BsSearch size={30} />
                        </div>

                    </div>

                </div>

            </div>
        )
    }
}

export default HeroSearch_1