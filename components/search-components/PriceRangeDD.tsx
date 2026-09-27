"use client"

import { PriceFilters } from '@/_lib/data';
import { RootState } from '@/app/GlobalRedux/store';
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import FloatingOptions from '../FloatingOptions';
import { BsDash } from 'react-icons/bs';
import { Helpers } from '@/_lib/helper';
import { BiCheck } from 'react-icons/bi';

const helpers = new Helpers();
const PriceRangeDD = ({ props, raw_data = {} }: { props: any, raw_data?: any }) => {

    const [is_shown, setIsShown] = useState(false);
    const boxRef = useRef<HTMLDivElement>(null);
    const theme = useSelector((state: RootState) => state.theme);

    const [themeSett, setThemeSett] = useState<any | null>(null);

    // Get merchant's minimum price (if set)
    const merchantMinPrice = raw_data?.minimum_price || '';

    // const minPriceOPtions = [{ name: 'No Minimum', code: '' }, ...PriceFilters];
    // const maxPriceOPtions = [{ name: 'No Maximum', code: '' }, ...PriceFilters];

    // Filter minimum price options based on merchant's restriction
    const minPriceOptions = useMemo(() => {
        if (!merchantMinPrice) {
            return [{ name: 'No Minimum', code: '' }, ...PriceFilters];
        }

        // Filter PriceFilters to only show prices >= merchant minimum
        const filteredPrices = PriceFilters.filter(price =>
            parseInt(price.code) >= parseInt(merchantMinPrice)
        );

        return [{ name: 'No Minimum', code: '' }, ...filteredPrices];
    }, [merchantMinPrice]);

    // Filter maximum price options based on merchant's restriction
    const maxPriceOptions = useMemo(() => {
        if (!merchantMinPrice) {
            return [{ name: 'No Maximum', code: '' }, ...PriceFilters];
        }

        // Filter PriceFilters to only show prices >= merchant minimum
        const filteredPrices = PriceFilters.filter(price =>
            parseInt(price.code) >= parseInt(merchantMinPrice)
        );

        return [{ name: 'No Maximum', code: '' }, ...filteredPrices];
    }, [merchantMinPrice]);

    const handlePriceChangeXX = (e: React.ChangeEvent<HTMLSelectElement>) => {

        const name = e.target.name;
        let value = e.target.value;
        let comp_field = "";

        if (name == "min_price") {
            comp_field = "max_price";
        } else if (name == "max_price") {
            comp_field = "min_price";
        }

        let comp_val = props.form_data[comp_field];
        let comp_val_index = PriceFilters.findIndex((price) => price.code == comp_val);
        let this_val_index = PriceFilters.findIndex((price) => price.code == value);

        //Minimum price is greater that maximum price. Need to increase maximum price to next index
        if (name == "min_price" && this_val_index >= comp_val_index && comp_val_index > -1) {
            comp_val = PriceFilters[this_val_index + 1]?.code || PriceFilters[this_val_index].code;
        } else if (name == "max_price" && this_val_index <= comp_val_index && comp_val_index > -1) {
            //Maximum price is less that miniimum price. Need to decrease miniimum price to a lesser index 
            if (PriceFilters[this_val_index - 1]) {
                comp_val = PriceFilters[this_val_index - 1]?.code;
            } else {
                comp_val = PriceFilters[0].code;
            }
        }

        let range_from = "";
        let range_to = "";

        if (name == "min_price") {
            range_from = value;
            range_to = comp_val;
        } else {
            range_from = comp_val;
            range_to = value;
        }

        if (!range_from || range_from == "") {
            range_from = "No Min.";
        } else {
            range_from = helpers.formatCurrency(range_from, true);
        }

        if (!range_to || range_to == "") {
            range_to = "No Max.";
        } else {
            range_to = helpers.formatCurrency(range_to, true);
        }

        props.set_form_data((prev_val: any) => {
            const prevVal = { ...prev_val }
            return {
                ...prevVal,
                [name]: value,
                [comp_field]: comp_val,
                "price_range": `${range_from} - ${range_to}`,
            }
        });
    }

    const handlePriceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const name = e.target.name;
        let value = e.target.value;
        let comp_field = name === "min_price" ? "max_price" : "min_price";

        let comp_val = props.form_data[comp_field];
        let comp_val_index = PriceFilters.findIndex(p => p.code === comp_val);
        let this_val_index = PriceFilters.findIndex(p => p.code === value);

        // Logic to prevent min > max
        if (name === "min_price" && this_val_index >= comp_val_index && comp_val_index > -1) {
            comp_val = PriceFilters[this_val_index + 1]?.code || PriceFilters[this_val_index].code;
        } else if (name === "max_price" && this_val_index <= comp_val_index && comp_val_index > -1) {
            comp_val = PriceFilters[this_val_index - 1]?.code || PriceFilters[0].code;
        }

        let range_from = name === "min_price" ? value : comp_val;
        let range_to = name === "max_price" ? value : comp_val;

        const displayFrom = !range_from ? "No Min." : helpers.formatCurrency(range_from, true);
        const displayTo = !range_to ? "No Max." : helpers.formatCurrency(range_to, true);

        props.set_form_data((prev_val: any) => ({
            ...prev_val,
            [name]: value,
            [comp_field]: comp_val,
            "price_range": `${displayFrom} - ${displayTo}`,
        }));
    };

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

    useEffect(() => {

        if (!props.form_data.price_range || props.form_data.price_range == "") {

            let range_from = props.form_data.min_price;
            let range_to = props.form_data.max_price;

            if (!range_from || range_from == "") {
                range_from = "No Min.";
            } else {
                range_from = helpers.formatCurrency(range_from, true);
            }

            if (!range_to || range_to == "") {
                range_to = "No Max.";
            } else {
                range_to = helpers.formatCurrency(range_to, true);
            }

            props.set_form_data((prev_val: any) => {
                const prevVal = { ...prev_val }
                return {
                    ...prevVal,
                    "price_range": `${range_from} - ${range_to}`,
                }
            });

        }

    }, [props.form_data.price_range]);

    return (
        <div className='w-full relative flex flex-col h-12 cursor-pointer' ref={boxRef}>
            <div className=' flex items-center justify-start h-full' onClick={() => setIsShown(true)}>
                {props.form_data.price_range != ""
                    ? <span className='w-full flex justify-start items-center font-medium text-gray-500 line-clamp-1'>{props.form_data.price_range}</span>
                    : <span className='text-gray-400 italic line-clamp-1'> -- select a price range --</span>
                }
            </div>

            {is_shown &&
                <div className={`w-full 2xs:w-[400px] absolute top-[101%] right-0 shadow-2xl rounded-b-md bg-white z-20
                border border-gray-300 grid grid-cols-1 max-2xs:gap-y-3.5 2xs:grid-cols-[1fr_30px_1fr] p-4 items-center *:flex *:justify-center`}>

                    <div>
                        <FloatingOptions name='min_price' label='Minimum Price' px='px-2' py='py-2'
                            value={props.form_data.min_price} options={minPriceOptions}
                            handleSelectChange={(e) => handlePriceChange(e)} />
                    </div>

                    <div className=' !hidden 2xs:!flex '><BsDash size={25} /></div>

                    <div>
                        <FloatingOptions name='max_price' label='Maximum Price' px='px-2' py='py-2'
                            value={props.form_data.max_price} options={maxPriceOptions}
                            handleSelectChange={(e) => handlePriceChange(e)} />
                    </div>

                    <div className='col-span-full !w-full flex !justify-end 2xs:mt-2'>
                        <div className='bg-gray-950 text-white py-1 px-3 rounded flex items-center space-x-1'
                            onClick={() => setIsShown(false)}>
                            <div className='text-sm font-medium'>Done</div> <BiCheck size={18} />
                        </div>
                    </div>

                </div>
            }
        </div>
    )
}

export default PriceRangeDD