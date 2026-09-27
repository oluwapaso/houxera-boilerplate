"use client"

import { RootState } from '@/app/GlobalRedux/store';
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { FaTreeCity } from 'react-icons/fa6';
import { AmenitiesFilters, MediaFilters, ParkingFilters, SecurityFilters, ViewFilters } from '@/_lib/data';
import { CgGym } from 'react-icons/cg';
import { BiCheck } from 'react-icons/bi';

const MustHaveDD = ({ props }: { props: any }) => {

    const [is_shown, setIsShown] = useState(false);
    const boxRef = useRef<HTMLDivElement>(null);
    const theme = useSelector((state: RootState) => state.theme);

    const [themeSett, setThemeSett] = useState<any | null>(null);
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
        props.form_data.must_have ? props.form_data.must_have.split(",").map((v: any) => v.trim()) : []
    );

    const toggleAmenity = (amenityName: string, checked: boolean) => {
        setSelectedAmenities(prev => {
            if (checked) {
                return [...prev, amenityName];
            } else {
                return prev.filter(a => a !== amenityName);
            }
        });
    }

    const MAX_BADGES = 7;
    const mustHaveList = props.form_data.must_have
        ? props.form_data.must_have
            .split(',')
            .map((v: any) => v.trim())
            .filter(Boolean)
        : [];

    const visibleBadges = mustHaveList.slice(0, MAX_BADGES);
    const remainingCount = mustHaveList.length - visibleBadges.length;

    useEffect(() => {
        if (selectedAmenities.length > 0) {
            const amenitiesCSV = selectedAmenities?.join(',');
            props.set_form_data((prev: any) => {
                return {
                    ...prev,
                    must_have: amenitiesCSV,
                }
            });
        } else {
            props.set_form_data((prev: any) => {
                return {
                    ...prev,
                    must_have: "",
                }
            });
        }
    }, [selectedAmenities]);


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
        <div className='w-full relative flex flex-col min-h-12 h-auto max-h-28 cursor-pointer'
            ref={boxRef}>
            <div className='flex items-center flex-wrap gap-2 h-full py-2 pb-2cursor-pointer' onClick={() => setIsShown(true)}>
                {mustHaveList.length > 0 ? (
                    <>
                        {visibleBadges.map((item: any, index: any) => (
                            <span
                                key={index}
                                className="px-2 py-1 text-xs font-medium rounded-full bg-gray-200 text-gray-700"
                            >
                                {item}
                            </span>
                        ))}

                        {remainingCount > 0 && (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-800 text-gray-100">
                                +{remainingCount} more
                            </span>
                        )}
                    </>
                ) : (
                    <span className="text-gray-400 italic">
                        -- select must have amenities --
                    </span>
                )}
            </div>

            {is_shown &&
                <div className={`w-full max-w-[320px] absolute top-[101%] left-0 shadow-2xl rounded-md bg-white z-20 
                    flex flex-col cursor-pointer border border-gray-200  max-h-[340px]  `}>

                    <div className='grow flex flex-col divide-y divide-gray-300 overflow-y-auto'>
                        <div className='w-full flex flex-col'>
                            <div className='flex px-4 py-4 space-x-2.5 font-semibold text-base items-center border-b border-gray-300'>
                                <CgGym size={16} className='mr-1' /> <span>Amenities</span>
                            </div>
                            <div className='divide-y divide-dashed divide-gray-300 flex flex-col *:flex *:items-center 
                            *:space-x-2.5 *:pl-4 *:hover:bg-gray-100'>
                                {AmenitiesFilters.map((amenities, index) => {
                                    const id = `amenity_${index}`;
                                    return <div key={id} className='w-full flex items-center select-none -ml-[10px]'>
                                        <input type='checkbox' className='styled-checkbox menu_cb' id={id}
                                            checked={selectedAmenities.includes(amenities.name)}
                                            onChange={(e) =>
                                                toggleAmenity(amenities.name, e.target.checked)
                                            } />
                                        <label htmlFor={id} className='flex w-full !py-3 after:!top-[23px]'>
                                            <span>{amenities.name}</span>
                                        </label>
                                    </div>
                                })}
                            </div>
                        </div>

                        <div className='w-full flex flex-col'>
                            <div className='flex px-4 py-4 space-x-2.5 font-semibold text-base items-center border-b border-gray-300'>
                                <FaTreeCity size={16} className='mr-1' /> <span>View</span>
                            </div>
                            <div className='divide-y divide-dashed divide-gray-300 flex flex-col *:flex *:items-center 
                            *:space-x-2.5 *:pl-4 *:hover:bg-gray-100'>
                                {ViewFilters.map((view, index) => {
                                    const id = `view_${index}`;
                                    return <div key={id} className='w-full flex items-center select-none -ml-[10px]'>
                                        <input type='checkbox' className='styled-checkbox menu_cb' id={id}
                                            checked={selectedAmenities.includes(view)}
                                            onChange={(e) =>
                                                toggleAmenity(view, e.target.checked)
                                            } />
                                        <label htmlFor={id} className='flex w-full !py-3 after:!top-[23px]'>
                                            <span>{view}</span>
                                        </label>
                                    </div>
                                })}
                            </div>
                        </div>

                        <div className='w-full flex flex-col'>
                            <div className='flex px-4 py-4 space-x-2.5 font-semibold text-base items-center border-b border-gray-300'>
                                <FaTreeCity size={16} className='mr-1' /> <span>Parking</span>
                            </div>
                            <div className='divide-y divide-dashed divide-gray-300 flex flex-col *:flex *:items-center 
                            *:space-x-2.5 *:pl-4 *:hover:bg-gray-100'>
                                {ParkingFilters.map((park, index) => {
                                    const id = `park_${index}`;
                                    return <div key={id} className='w-full flex items-center select-none -ml-[10px]'>
                                        <input type='checkbox' className='styled-checkbox menu_cb' id={id}
                                            checked={selectedAmenities.includes(park)}
                                            onChange={(e) =>
                                                toggleAmenity(park, e.target.checked)
                                            } />
                                        <label htmlFor={id} className='flex w-full !py-3 after:!top-[23px]'>
                                            <span>{park}</span>
                                        </label>
                                    </div>
                                })}
                            </div>
                        </div>

                        <div className='w-full flex flex-col'>
                            <div className='flex px-4 py-4 space-x-2.5 font-semibold text-base items-center border-b border-gray-300'>
                                <FaTreeCity size={16} className='mr-1' /> <span>Media</span>
                            </div>
                            <div className='divide-y divide-dashed divide-gray-300 flex flex-col *:flex *:items-center 
                            *:space-x-2.5 *:pl-4 *:hover:bg-gray-100'>
                                {MediaFilters.map((media, index) => {
                                    const id = `media_${index}`;
                                    return <div key={id} className='w-full flex items-center select-none -ml-[10px]'>
                                        <input type='checkbox' className='styled-checkbox menu_cb' id={id}
                                            checked={selectedAmenities.includes(media)}
                                            onChange={(e) =>
                                                toggleAmenity(media, e.target.checked)
                                            } />
                                        <label htmlFor={id} className='flex w-full !py-3 after:!top-[23px]'>
                                            <span>{media}</span>
                                        </label>
                                    </div>
                                })}
                            </div>
                        </div>

                        <div className='w-full flex flex-col'>
                            <div className='flex px-4 py-4 space-x-2.5 font-semibold text-base items-center border-b border-gray-300'>
                                <FaTreeCity size={16} className='mr-1' /> <span>Security</span>
                            </div>
                            <div className='divide-y divide-dashed divide-gray-300 flex flex-col *:flex *:items-center 
                            *:space-x-2.5 *:pl-4 *:hover:bg-gray-100'>
                                {SecurityFilters.map((security, index) => {
                                    const id = `security_${index}`;
                                    return <div key={id} className='w-full flex items-center select-none -ml-[10px]'>
                                        <input type='checkbox' className='styled-checkbox menu_cb' id={id}
                                            checked={selectedAmenities.includes(security)}
                                            onChange={(e) =>
                                                toggleAmenity(security, e.target.checked)
                                            } />
                                        <label htmlFor={id} className='flex w-full !py-3 after:!top-[23px]'>
                                            <span>{security}</span>
                                        </label>
                                    </div>
                                })}
                            </div>
                        </div>
                    </div>

                    <div className='col-span-full shrink-0 !w-full flex !justify-end py-2 px-2 border-t border-gray-300'>
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

export default MustHaveDD
