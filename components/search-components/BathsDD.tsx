"use client"

import { BedsBathsFilters } from '@/_lib/data';
import { RootState } from '@/app/GlobalRedux/store';
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { FaCheck } from 'react-icons/fa6';

const BathsDD = ({ props }: { props: any }) => {

    const [is_shown, setIsShown] = useState(false);
    const boxRef = useRef<HTMLDivElement>(null);
    const theme = useSelector((state: RootState) => state.theme);

    const [themeSett, setThemeSett] = useState<any | null>(null);
    const bathsOptions = [...BedsBathsFilters];

    const setBathsOption = (no_baths: string) => {
        setIsShown(false);
        props.set_form_data((prev_val: any) => {
            const prevVal = { ...prev_val }
            return {
                ...prevVal,
                baths: no_baths,
            }
        });
    }

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
                {(props.form_data.baths && props.form_data.baths != "")
                    ? <span className='w-full flex justify-start items-center font-medium text-gray-500'>{props.form_data.baths}</span>
                    : <span className='text-gray-400 italic'> --select no of baths --</span>
                }
            </div>

            {is_shown &&
                <div className={`w-[220px] absolute top-[101%] right-0 shadow-2xl rounded-b-md bg-white z-20
                border border-gray-300 grid grid-cols-1 items-center *:flex *:justify-center`}>

                    <div className=' divide-y divide-dashed divide-gray-300 flex flex-col *:flex *:items-center 
                        *:space-x-2.5 *:justify-between *:py-4 *:px-4 *:hover:bg-gray-100'>
                        {bathsOptions.map((baths, index) => {
                            return <div key={index} className='' onClick={() => setBathsOption(baths.code)}>
                                <div>{baths.name}</div>
                                {props.form_data.baths == baths.code && <FaCheck className={`text-${themeSett.primary_color}`} size={16} />}

                            </div>
                        })}
                    </div>

                </div>
            }
        </div>
    )
}

export default BathsDD