"use client"

import { RootState } from '@/app/GlobalRedux/store';
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { OptionsType } from '../types';
import { PropertySubTypes } from '@/_lib/data';
import { FaCheck, FaMountainSun, FaTreeCity } from 'react-icons/fa6';
import { HiHomeModern } from 'react-icons/hi2';
import { HiOfficeBuilding } from 'react-icons/hi';
import { LuCalendarSync } from 'react-icons/lu';
import { GiPlantWatering } from 'react-icons/gi';

const PropertyTypeDD = ({ props }: { props: any }) => {

    const [is_shown, setIsShown] = useState(false);
    const boxRef = useRef<HTMLDivElement>(null);
    const theme = useSelector((state: RootState) => state.theme);

    const [themeSett, setThemeSett] = useState<any | null>(null);
    const [Residentials, setResidentials] = useState<OptionsType[]>([]);
    const [MultiUnits, setMultiUnits] = useState<OptionsType[]>([]);
    const [Commercials, setCommercials] = useState<OptionsType[]>([]);
    const [Lands, setLands] = useState<OptionsType[]>([]);
    const [FarmRanches, setFarmRanches] = useState<OptionsType[]>([]);
    const [Rentals, setRentals] = useState<OptionsType[]>([]);

    const setPropType = (prop_type: string | undefined, prop_sub_type: string) => {
        setIsShown(false);
        props.set_form_data((prev: any) => {
            return {
                ...prev,
                property_type: prop_type,
                property_sub_type: prop_sub_type,
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

    useEffect(() => {
        let PropertyTypes: OptionsType[] = [];

        if (props.active_tab == "Buy" || props.form_data.sales_type == "For Sale") {
            const subTypes = ["Residential", "Multi-Unit", "Commercial", "Land", "Farm/Ranch"];
            PropertyTypes = PropertySubTypes.filter((sub_type) => subTypes.includes(sub_type.group as string));
        } else if (props.active_tab == "Rent" || props.form_data.sales_type == "For Rent") {
            const subTypes = ["Rental"];
            PropertyTypes = PropertySubTypes.filter((sub_type) => subTypes.includes(sub_type.group as string));
        } else if (props.active_tab == "Short-Let" || props.form_data.sales_type == "Short-Let") {
            const subTypes = ["Residential", "Rental"];
            PropertyTypes = PropertySubTypes.filter((sub_type) => subTypes.includes(sub_type.group as string));
        }

        const Residentials = PropertyTypes.filter((type) => type.group == "Residential");
        const MultiUnits = PropertyTypes.filter((type) => type.group == "Multi-Unit");
        const Commercials = PropertyTypes.filter((type) => type.group == "Commercial");
        const Lands = PropertyTypes.filter((type) => type.group == "Land");
        const FarmRanches = PropertyTypes.filter((type) => type.group == "Farm/Ranch");
        const Rentals = PropertyTypes.filter((type) => type.group == "Rental");

        setResidentials(() => {
            return [{ group: "Residential", name: 'All Residential', code: 'All Residential' }, ...Residentials]
        });

        setMultiUnits(() => {
            return [{ group: "Multi-Unit", name: 'All Multi-Unit', code: 'All Multi-Unit' }, ...MultiUnits]
        });

        setCommercials(() => {
            return [{ group: "Commercial", name: 'All Commercial', code: 'All Commercial' }, ...Commercials]
        });

        setLands(() => {
            return [{ group: "Land", name: 'All Land', code: 'All Land' }, ...Lands]
        });

        setFarmRanches(() => {
            return [{ group: "Farm/Ranch", name: 'All Farm/Ranch', code: 'All Farm/Ranch' }, ...FarmRanches]
        });

        setRentals(() => {
            return [{ group: "Rental", name: 'All Rental', code: 'All Rental' }, ...Rentals]
        });

    }, [props.active_tab, props.form_data.sales_type]);

    return (
        <div className='w-full relative flex flex-col h-12 cursor-pointer'
            ref={boxRef}>
            <div className=' flex items-center justify-start h-full' onClick={() => setIsShown(true)}>
                {props.form_data.property_sub_type
                    ? <span className='w-full flex justify-start items-center font-medium text-gray-500 line-clamp-1'>{props.form_data.property_sub_type}</span>
                    : <span className='text-gray-400 italic line-clamp-1'> -- select a property type --</span>
                }
            </div>

            {is_shown &&
                <div className={`w-full max-w-[350px] absolute top-[101%] right-0 shadow-2xl rounded-md bg-white z-20
                flex flex-col cursor-pointer border border-gray-200 divide-y divide-gray-300 max-h-[340px] overflow-y-auto `}>

                    { /** .length > 1 for all property types*/}
                    {(Array.isArray(Residentials) && Residentials.length > 1)
                        ? <div className='w-full flex flex-col'>
                            <div className='flex px-4 py-4 space-x-2.5 font-semibold text-base items-center border-b border-gray-300'>
                                <FaTreeCity size={16} className='mr-1' /> <span>Residential</span>
                            </div>
                            <div className='pl-8 divide-y divide-dashed divide-gray-300 flex flex-col *:flex *:items-center 
                            *:space-x-2.5 *:justify-between *:py-4 *:pl-2 *:hover:bg-gray-100'>
                                {Residentials.map((prop_type, index) => {
                                    return <div key={index} className='' onClick={() => setPropType(prop_type.group, prop_type.code)}>
                                        <div>{prop_type.name}</div>
                                        {(props.form_data.property_type == "Residential" && props.form_data.property_sub_type == prop_type.code)
                                            && <FaCheck className={`text-${themeSett.primary_color} mr-4`} size={16} />}
                                    </div>
                                })}
                            </div>
                        </div>
                        : null
                    }

                    { /** .length > 1 for all property types*/}
                    {(Array.isArray(MultiUnits) && MultiUnits.length > 1)
                        ? <div className='w-full flex flex-col'>
                            <div className='flex px-4 py-4 space-x-2.5 font-semibold text-base items-center border-b border-gray-300'>
                                <HiHomeModern size={16} className='mr-1' /> <span>Multi-Units</span>
                            </div>
                            <div className='pl-8 divide-y divide-dashed divide-gray-300 flex flex-col *:flex *:items-center 
                            *:space-x-2.5 *:justify-between *:py-4 *:pl-2 *:hover:bg-gray-100'>
                                {MultiUnits.map((prop_type, index) => {
                                    return <div key={index} className='' onClick={() => setPropType(prop_type.group, prop_type.code)}>
                                        <div>{prop_type.name}</div>
                                        {(props.form_data.property_type == "Multi-Unit" && props.form_data.property_sub_type == prop_type.code)
                                            && <FaCheck className={`text-${themeSett.primary_color} mr-4`} size={16} />}
                                    </div>
                                })}
                            </div>
                        </div>
                        : null
                    }

                    { /** .length > 1 for all property types*/}
                    {(Array.isArray(Commercials) && Commercials.length > 1)
                        ? <div className='w-full flex flex-col'>
                            <div className='flex px-4 py-4 space-x-2.5 font-semibold text-base items-center border-b border-gray-300'>
                                <HiOfficeBuilding size={16} className='mr-1' /> <span>Commercial</span>
                            </div>
                            <div className='pl-8 divide-y divide-dashed divide-gray-300 flex flex-col *:flex *:items-center 
                            *:space-x-2.5 *:justify-between *:py-4 *:pl-2 *:hover:bg-gray-100'>
                                {Commercials.map((prop_type, index) => {
                                    return <div key={index} className='' onClick={() => setPropType(prop_type.group, prop_type.code)}>
                                        <div>{prop_type.name}</div>
                                        {(props.form_data.property_type == "Commercial" && props.form_data.property_sub_type == prop_type.code)
                                            && <FaCheck className={`text-${themeSett.primary_color} mr-4`} size={16} />}
                                    </div>
                                })}
                            </div>
                        </div>
                        : null
                    }

                    { /** .length > 1 for all property types*/}
                    {(Array.isArray(Rentals) && Rentals.length > 1)
                        ? <div className='w-full flex flex-col'>
                            <div className='flex px-4 py-4 space-x-2.5 font-semibold text-base items-center border-b border-gray-300'>
                                <LuCalendarSync size={16} className='mr-1' /> <span>Rental</span>
                            </div>
                            <div className='pl-8 divide-y divide-dashed divide-gray-300 flex flex-col *:flex *:items-center 
                            *:space-x-2.5 *:justify-between *:py-4 *:pl-2 *:hover:bg-gray-100'>
                                {Rentals.map((prop_type, index) => {
                                    return <div key={index} className='' onClick={() => setPropType(prop_type.group, prop_type.code)}>
                                        <div>{prop_type.name}</div>
                                        {(props.form_data.property_type == "Rental" && props.form_data.property_sub_type == prop_type.code)
                                            && <FaCheck className={`text-${themeSett.primary_color} mr-4`} size={16} />}
                                    </div>
                                })}
                            </div>
                        </div>
                        : null
                    }

                    { /** .length > 1 for all property types*/}
                    {(Array.isArray(Lands) && Lands.length > 1)
                        ? <div className='w-full flex flex-col'>
                            <div className='flex px-4 py-4 space-x-2.5 font-semibold text-base items-center border-b border-gray-300'>
                                <FaMountainSun size={16} className='mr-1' /> <span>Land</span>
                            </div>
                            <div className='pl-8 divide-y divide-dashed divide-gray-300 flex flex-col *:flex *:items-center 
                            *:space-x-2.5 *:justify-between *:py-4 *:pl-2 *:hover:bg-gray-100'>
                                {Lands.map((prop_type, index) => {
                                    return <div key={index} className='' onClick={() => setPropType(prop_type.group, prop_type.code)}>
                                        <div>{prop_type.name}</div>
                                        {(props.form_data.property_type == "Land" && props.form_data.property_sub_type == prop_type.code)
                                            && <FaCheck className={`text-${themeSett.primary_color} mr-4`} size={16} />}
                                    </div>
                                })}
                            </div>
                        </div>
                        : null
                    }

                    { /** .length > 1 for all property types*/}
                    {(Array.isArray(FarmRanches) && FarmRanches.length > 1)
                        ? <div className='w-full flex flex-col'>
                            <div className='flex px-4 py-4 space-x-2.5 font-semibold text-base items-center border-b border-gray-300'>
                                <GiPlantWatering size={16} className='mr-1' /> <span>Farm/Ranch</span>
                            </div>
                            <div className='pl-8 divide-y divide-dashed divide-gray-300 flex flex-col *:flex *:items-center 
                            *:space-x-2.5 *:justify-between *:py-4 *:pl-2 *:hover:bg-gray-100'>
                                {FarmRanches.map((prop_type, index) => {
                                    return <div key={index} className='' onClick={() => setPropType(prop_type.group, prop_type.code)}>
                                        <div>{prop_type.name}</div>
                                        {(props.form_data.property_type == "Farm/Ranch" && props.form_data.property_sub_type == prop_type.code)
                                            && <FaCheck className={`text-${themeSett.primary_color} mr-4`} size={16} />}
                                    </div>
                                })}
                            </div>
                        </div>
                        : null
                    }
                </div>
            }
        </div>
    )
}

export default PropertyTypeDD
