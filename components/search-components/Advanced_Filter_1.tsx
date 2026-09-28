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
import { FiFilter } from 'react-icons/fi';
import BedsDD from './BedsDD';
import BathsDD from './BathsDD';
import CategoryDD from './CategoryDD';
import StatusDD from './StatusDD';
import MustHaveDD from './MustHaveDD';
import LivingAreaRangeDD from './LivingAreaDD';
import LotSizeRangeDD from './LotSizeRangeDD';
import { Helpers } from '@/_lib/helper';
import { TiTimes } from 'react-icons/ti';
import { GrClose } from 'react-icons/gr';

const helpers = new Helpers();
const Advanced_Filter_1 = ({ setStartFetch, formData, setFormData, OpenSaveSearch, is_theme = false, via = "Desktop", setFilterShown }:
    {
        setStartFetch: React.Dispatch<React.SetStateAction<boolean>>,
        formData: any, setFormData: React.Dispatch<any>, OpenSaveSearch: () => void, is_theme: boolean, via?: "Mobile" | "Desktop",
        setFilterShown?: React.Dispatch<React.SetStateAction<boolean>>
    }) => {

    const router = useRouter();
    const dispatch = useDispatch();

    const theme = useSelector((state: RootState) => state.theme);
    const [themeSett, setThemeSett] = useState<any | null>(null);

    const PropertyTypeDD_Data: any = {
        form_data: formData,
        set_form_data: setFormData,
        property_type: formData.property_type,
        property_sub_type: formData.property_sub_type,
    }

    const Run_MLS_Search = () => {

        toast.dismiss();
        if (is_theme) {
            toast.error(`Can not complete this request in design mode.`, {
                position: "top-center",
                theme: "colored"
            });
            return false;
        }

        if (!formData.property_sub_type || formData.property_sub_type == "") {
            toast.error("Select a valid property type", {
                position: "top-center",
                theme: "colored",
            });
            return false;
        }

        dispatch(showPageLoader());
        setStartFetch(false);
        router.push(`${themeSett.theme_prefix}/property-search?location=${formData.location}&state=${formData.state}&sales_type=${formData.sales_type}&property_type=${formData.property_type}&property_sub_type=${formData.property_sub_type}&beds=${formData.beds ? formData.beds : "Any"}&baths=${formData.baths ? formData.baths : "Any"}&min_price=${formData.min_price ? formData.min_price : ""}&max_price=${formData.max_price ? formData.max_price : ""}&min_living_area=${formData.min_living_area ? formData.min_living_area : ""}&max_living_area=${formData.max_living_area ? formData.max_living_area : ""}&min_lot_size=${formData.min_lot_size ? formData.min_lot_size : ""}&max_lot_size=${formData.max_lot_size ? formData.max_lot_size : ""}&status=${formData.status ? formData.status : "Active"}&must_have=${formData.must_have ? formData.must_have : ""}&_version=${moment().unix()}`);
    }

    useEffect(() => {
        if (theme) {
            setThemeSett(theme.theme_settings);
        }
    }, [theme]);

    //http://localhost:3001/homely/property-search?location=undefined&state=undefined&sales_type=For%20Sale&property_type=Residential,Comercial,Multi-Units,Land&property_sub_type=&status=Active&min_price=&max_price=&must_have=Pool,%20Basement,Wheelchair%20Ramp&_version=1769927237
    if (themeSett && themeSett != null) {
        return (
            <div className={` w-full ${via == "Mobile" ? "max-h-[100dvh]" : "rounded-md"} flex flex-col drop-shadow-2xl relative z-30 
            bg-white `}>
                <div className={`w-full bg-${themeSett.primary_color} ${via != "Mobile" ? "rounded-t-md" : ""} flex items-center 
                space-x-1.5 shrink-0 px-3 py-3 text-${themeSett.primary_button_text} `}>
                    <FiFilter size={16} className='shrink-0' /> <div>Advanced Filter</div>
                    {via == "Mobile" &&
                        <div className=' justify-self-end ml-auto cursor-pointer'>
                            <GrClose size={20} onClick={() => setFilterShown!(false)} />
                        </div>
                    }
                </div>

                <div className={` w-full ${via == "Mobile" ? "max-h-[calc(100dvh-48px)] overflow-y-auto" : ""} relative z-30 grow`}>

                    <div className=' w-full z-30 px-5 py-5 rounded-2xl rounded-tl-none bg-white flex flex-col 
                    *:grid *:grid-cols-1 space-y-5.5'>

                        <div className=''>
                            <div className='font-semibold text-base'>Location</div>
                            <div className='w-full border-b border-gray-200'>
                                <LocationLookupInput props={PropertyTypeDD_Data} setFormData={setFormData} />
                            </div>
                        </div>

                        <div className=''>
                            <div className='font-semibold text-base'>Property Type</div>
                            <div className='w-full border-b border-gray-200'>
                                <PropertyTypeDD props={PropertyTypeDD_Data} />
                            </div>
                        </div>

                        <div className=''>
                            <div className='font-semibold text-base'>Category</div>
                            <div className='w-full border-b border-gray-200'>
                                <CategoryDD props={PropertyTypeDD_Data} via="Advanced" />
                            </div>
                        </div>

                        <div className=''>
                            <div className='font-semibold text-base'>Property Status</div>
                            <div className='w-full border-b border-gray-200'>
                                <StatusDD props={PropertyTypeDD_Data} via="Advanced" />
                            </div>
                        </div>

                        <div className=''>
                            <div className='font-semibold text-base'>Price Range</div>
                            <div className='w-full border-b border-gray-200'>
                                <PriceRangeDD props={PropertyTypeDD_Data} />
                            </div>
                        </div>

                        <div className=' !grid-cols-2 gap-6'>
                            <div className=' '>
                                <div className='font-semibold text-base'>Beds</div>
                                <div className='w-full border-b border-gray-200'>
                                    <BedsDD props={PropertyTypeDD_Data} />
                                </div>
                            </div>

                            <div className=''>
                                <div className='font-semibold text-base'>Baths</div>
                                <div className='w-full border-b border-gray-200'>
                                    <BathsDD props={PropertyTypeDD_Data} />
                                </div>
                            </div>
                        </div>

                        <div className=''>
                            <div className='font-semibold text-base'>Living Area</div>
                            <div className='w-full border-b border-gray-200'>
                                <LivingAreaRangeDD props={PropertyTypeDD_Data} />
                            </div>
                        </div>

                        <div className=''>
                            <div className='font-semibold text-base'>
                                Lot Size <span className=' text-gray-500 text-sm font-medium'>(Land Area)</span>
                            </div>
                            <div className='w-full border-b border-gray-200'>
                                <LotSizeRangeDD props={PropertyTypeDD_Data} />
                            </div>
                        </div>

                        <div className=''>
                            <div className='font-semibold text-base'>Must Have</div>
                            <div className='w-full border-b border-gray-200'>
                                <MustHaveDD props={PropertyTypeDD_Data} />
                            </div>
                        </div>

                        <div className={`!flex items-center justify-center py-3 px-2 bg-${themeSett.primary_color}
                            text-${themeSett.primary_button_text} space-x-1.5 rounded-md text-white cursor-pointer
                            hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)} hover:shadow-2xl `}
                            onClick={() => Run_MLS_Search()}>
                            <BsSearch size={16} /> <span>Search</span>
                        </div>

                    </div>

                </div>

            </div >
        )
    }
}

export default Advanced_Filter_1