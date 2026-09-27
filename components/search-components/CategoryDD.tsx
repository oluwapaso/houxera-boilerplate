"use client"

import { BedsBathsFilters, SalesCatFilters } from '@/_lib/data';
import { RootState } from '@/app/GlobalRedux/store';
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { FaCheck } from 'react-icons/fa6';

const CategoryDD = ({ props, via }: { props: any, via: string }) => {

    const [is_shown, setIsShown] = useState(false);
    const boxRef = useRef<HTMLDivElement>(null);
    const theme = useSelector((state: RootState) => state.theme);

    const [themeSett, setThemeSett] = useState<any | null>(null);
    const catsOptions = [...SalesCatFilters];

    const setSalesOption = (sales_type: string) => {
        setIsShown(false);
        props.set_form_data((prev_val: any) => {
            const prevVal = { ...prev_val }
            return {
                ...prevVal,
                sales_type: sales_type,
            }
        });
    }

    useEffect(() => {

        var property_sub_type = "All Residential"
        var property_type = "Residential"
        var status = "Listed"

        if (via == "Advanced") {
            status = "Active"
        }

        if (props.form_data.sales_type == "For Sale") {

            property_type = "Residential"
            property_sub_type = "All Residential"

        } else if (props.form_data.sales_type == "For Lease") {

            property_type = "Residential"
            property_sub_type = "All Residential"

        } else if (props.form_data.sales_type == "For Rent") {

            property_type = "Rental"
            property_sub_type = "All Rental"

        }

        props.set_form_data((prev_val: any) => {
            const prevVal = { ...prev_val }
            return {
                ...prevVal,
                property_type: property_type,
                property_sub_type: property_sub_type,
                status: status
            }
        });

    }, [props.form_data.sales_type]);

    useEffect(() => {
        if (theme) {
            setThemeSett(theme.theme_settings);
        }
    }, [theme]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
                setIsShown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [boxRef]);



    return (
        <div className='w-full relative flex flex-col h-12 cursor-pointer' ref={boxRef}>
            <div className=' flex items-center justify-start h-full' onClick={() => setIsShown(true)}>
                {props.form_data.sales_type != ""
                    ? <span className='w-full flex justify-start items-center font-medium text-gray-500'>{props.form_data.sales_type}</span>
                    : <span className='text-gray-400 italic'> -- select a category --</span>
                }
            </div>

            {is_shown &&
                <div className={`w-full max-w-[280px] absolute top-[101%] left-0 shadow-2xl rounded-b-md bg-white z-20
                border border-gray-300 grid grid-cols-1 items-center *:flex *:justify-center`}>

                    <div className=' divide-y divide-dashed divide-gray-300 flex flex-col *:flex *:items-center 
                        *:space-x-2.5 *:justify-between *:py-4 *:px-4 *:hover:bg-gray-100'>
                        {catsOptions.map((cat, index) => {
                            return <div key={index} className='' onClick={() => setSalesOption(cat.code)}>
                                <div>{cat.name}</div>
                                {props.form_data.sales_type == cat.code && <FaCheck className={`text-${themeSett.primary_color}`} size={16} />}

                            </div>
                        })}
                    </div>

                </div>
            }
        </div>
    )
}

export default CategoryDD