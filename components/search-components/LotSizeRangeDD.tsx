"use client"

import { LivingAreaFilters } from '@/_lib/data';
import { RootState } from '@/app/GlobalRedux/store';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import FloatingOptions from '../FloatingOptions';
import { BsDash } from 'react-icons/bs';
import { GrClose } from 'react-icons/gr';
import { BiCheck } from 'react-icons/bi';

const LotSizeRangeDD = ({ props }: { props: any }) => {

    const [isShown, setIsShown] = useState(false);
    const boxRef = useRef<HTMLDivElement>(null);
    const theme = useSelector((state: RootState) => state.theme);

    const minAreaOptions = [{ name: 'No Minimum', code: '' }, ...LivingAreaFilters];
    const maxAreaOptions = [{ name: 'No Maximum', code: '' }, ...LivingAreaFilters];

    const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const name = e.target.name; // min_lot_size | max_lot_size
        let value = e.target.value;
        let compField = name === "min_lot_size" ? "max_lot_size" : "min_lot_size";

        let compVal = props.form_data[compField];

        let thisIndex = LivingAreaFilters.findIndex(v => v.code === value);
        let compIndex = LivingAreaFilters.findIndex(v => v.code === compVal);

        // Enforce valid range
        if (name === "min_lot_size" && thisIndex >= compIndex && compIndex > -1) {
            compVal = LivingAreaFilters[thisIndex + 1]?.code || value;
        }

        if (name === "max_lot_size" && thisIndex <= compIndex && compIndex > -1) {
            compVal = LivingAreaFilters[thisIndex - 1]?.code || '';
        }

        let rangeFrom = name === "min_lot_size" ? value : compVal;
        let rangeTo = name === "max_lot_size" ? value : compVal;

        const displayFrom = rangeFrom ? `${rangeFrom} sqm` : 'No Min.';
        const displayTo = rangeTo ? `${rangeTo} sqm` : 'No Max.';

        props.set_form_data((prev: any) => ({
            ...prev,
            [name]: value,
            [compField]: compVal,
            lot_size_range: `${displayFrom} - ${displayTo}`,
        }));
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
                setIsShown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {

        if (!props.form_data.lot_size_range || props.form_data.lot_size_range == "") {

            let range_from = props.form_data.min_lot_size;
            let range_to = props.form_data.max_lot_size;

            if (!range_from || range_from == "") {
                range_from = "No Min.";
            } else {
                range_from = `${range_from} sqm`
            }

            if (!range_to || range_to == "") {
                range_to = "No Max.";
            } else {
                range_to = `${range_to} sqm`
            }

            props.set_form_data((prev_val: any) => {
                const prevVal = { ...prev_val }
                return {
                    ...prevVal,
                    "lot_size_range": `${range_from} - ${range_to}`,
                }
            });

        }

    }, [props.form_data.lot_size_range]);

    return (
        <div className="w-full relative flex flex-col h-12 cursor-pointer" ref={boxRef}>
            <div className="flex items-center h-full" onClick={() => setIsShown(true)}>
                {props.form_data.lot_size_range
                    ? <span className="font-medium text-gray-500">
                        {props.form_data.lot_size_range}
                    </span>
                    : <span className="text-gray-400 italic">
                        -- select living area --
                    </span>
                }
            </div>

            {isShown && (
                <div className="w-full 2xs:w-[400px] absolute top-[101%] right-0 z-20 bg-white border border-gray-300 shadow-2xl 
                rounded-md grid grid-cols-1 max-2xs:gap-y-3.5 2xs:grid-cols-[1fr_30px_1fr] p-4 items-center">

                    <FloatingOptions
                        name="min_lot_size"
                        label="Min Max Lot Size"
                        value={props.form_data.min_lot_size}
                        options={minAreaOptions}
                        handleSelectChange={handleAreaChange}
                    />

                    <div className="!hidden 2xs:!flex justify-center">
                        <BsDash size={25} />
                    </div>

                    <FloatingOptions
                        name="max_lot_size"
                        label="Max Lot Size"
                        value={props.form_data.max_lot_size}
                        options={maxAreaOptions}
                        handleSelectChange={handleAreaChange}
                    />

                    <div className='col-span-full !w-full flex !justify-end 2xs:mt-2'>
                        <div className='bg-gray-950 text-white py-1 px-3 rounded flex items-center space-x-1'
                            onClick={() => setIsShown(false)}>
                            <div className='text-sm font-medium'>Done</div> <BiCheck size={18} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LotSizeRangeDD;
