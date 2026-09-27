"use client"

import { InsightStatusFilters, StatusFilters } from '@/_lib/data';
import { RootState } from '@/app/GlobalRedux/store';
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { FaCheck } from 'react-icons/fa6';
import { OptionsType } from '../types';

const StatusDD = ({ props, via }: { props: any, via: string }) => {

    const [is_shown, setIsShown] = useState(false);
    const boxRef = useRef<HTMLDivElement>(null);
    const theme = useSelector((state: RootState) => state.theme);

    const [themeSett, setThemeSett] = useState<any | null>(null);
    const [statusOptions, setStatusOptions] = useState<OptionsType[]>([]);

    const setSalesOption = (status: string) => {
        setIsShown(false);
        props.set_form_data((prev_val: any) => {
            const prevVal = { ...prev_val }
            return {
                ...prevVal,
                status: status,
            }
        });
    }

    useEffect(() => {

        var options: OptionsType[] = []

        if (props.form_data.sales_type == "For Sale") {
            if (via == "Advanced") {
                options = [
                    { name: 'Active', code: 'Active' },
                    { name: 'Sold', code: 'Sold' }
                ]
            } else {
                options = [
                    { name: 'Listed', code: 'Listed' },
                    { name: 'Sold', code: 'Sold' }
                ]
            }
        } else if (props.form_data.sales_type == "For Lease") {
            if (via == "Advanced") {
                options = [
                    { name: 'Active', code: 'Active' },
                    { name: 'Sold', code: 'Sold' }
                ]
            } else {
                options = [
                    { name: 'Listed', code: 'Listed' },
                    { name: 'Leased', code: 'Leased' }
                ]
            }
        } else if (props.form_data.sales_type == "For Rent") {
            if (via == "Advanced") {
                options = [
                    { name: 'Active', code: 'Active' },
                    { name: 'Sold', code: 'Sold' }
                ]
            } else {
                options = [
                    { name: 'Listed', code: 'Listed' },
                    { name: 'Rented', code: 'Rented' }
                ]
            }
        }

        setStatusOptions(() => options);

    }, [props.form_data.sales_type]);

    useEffect(() => {
        if (theme) {
            setThemeSett(theme.theme_settings);
        }
    }, [theme]);


    useEffect(() => {

        if (statusOptions.length > 0) {
            props.set_form_data((prev_val: any) => {
                const prevVal = { ...prev_val }
                return {
                    ...prevVal,
                    status: props.form_data.status,
                }
            });
        }

    }, [statusOptions]);

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
                {props.form_data.status != ""
                    ? <span className='w-full flex justify-start items-center font-medium text-gray-500'>{props.form_data.status}</span>
                    : <span className='text-gray-400 italic'> -- select a status --</span>
                }
            </div>

            {is_shown &&
                <div className={`w-full max-w-[280px] absolute top-[101%] left-0 shadow-2xl rounded-b-md bg-white z-20
                border border-gray-300 grid grid-cols-1 items-center *:flex *:justify-center`}>

                    <div className=' divide-y divide-dashed divide-gray-300 flex flex-col *:flex *:items-center 
                        *:space-x-2.5 *:justify-between *:py-4 *:px-4 *:hover:bg-gray-100'>
                        {statusOptions.map((status, index) => {
                            return <div key={index} className='' onClick={() => setSalesOption(status.code)}>
                                <div>{status.name}</div>
                                {props.form_data.status == status.code && <FaCheck className={`text-${themeSett.primary_color}`} size={16} />}

                            </div>
                        })}
                    </div>

                </div>
            }
        </div>
    )
}

export default StatusDD