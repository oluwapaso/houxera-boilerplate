"use client"
import { Helpers } from '@/_lib/helper';
import React, { useEffect, useRef, useState } from 'react'
import { APIResponseProps } from '../types';
import { FaCity } from 'react-icons/fa';
import { FaTreeCity } from 'react-icons/fa6';
import { GiModernCity } from 'react-icons/gi';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/GlobalRedux/store';

const helpers = new Helpers();
const LocationLookupInput = ({ setFormData, props, tiny = false }: { setFormData: React.Dispatch<any>, props: any, tiny?: boolean }) => {

    const theme = useSelector((state: RootState) => state.theme);

    const [searchTerm, setSearchTerm] = useState(props?.form_data?.location || "");
    const [loading, setLoading] = useState(false);
    const [is_opened, setIsOpened] = useState(false);
    const [results, setResults] = useState<any[]>([]);
    const [cities, setCities] = useState<any[]>([]);
    const [states, setStates] = useState<any[]>([]);
    const [neighborhoods, setNeighborhoods] = useState<any[]>([]);
    const [lgs, setLgs] = useState<any[]>([]);
    const [themeSett, setThemeSett] = useState<any | null>(null);


    const debounceTimeout = useRef<number | null>(null); // To store the timeout reference
    const inputRef = useRef<HTMLInputElement>(null);
    const ddRef = useRef<HTMLDivElement>(null);
    const [req_resp, setReqResp] = useState("");

    const handleKeyUp = async (e: React.KeyboardEvent<HTMLInputElement>) => {

        const value = (e.target as HTMLInputElement).value;
        setSearchTerm(value);
        setReqResp("");
        setResults([]); // Clear old results
        setCities([]); // Clear old results
        setStates([]); // Clear old results 
        setNeighborhoods([]); // Clear old results 
        setLgs([]); // Clear old results 

        if (value.length > 0) {
            setLoading(true);
        } else {
            setLoading(false);
        }

        //Reset
        setFormData((prev_val: any) => {
            const prevVal = { ...prev_val }
            return {
                ...prevVal,
                // location: "",
                location: value,
            }
        })

        // props.set_form_data((prev_val: any) => {
        //     const prevVal = { ...prev_val }
        //     return {
        //         ...prevVal,
        //         location: value,
        //     }
        // });

        // Clear any previous timeout to debounce
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        // Set a timeout to delay the search request
        debounceTimeout.current = window.setTimeout(async () => {
            if (value.length > 0) {
                setLoading(true);
                try {

                    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
                    await fetch(`${apiBaseUrl}/api/v1/mls/properties/location-lookup?keyword=${value}`, {
                        method: "GET",
                        headers: {
                            // 'Content-Type': 'application/json',
                        },
                        // body: JSON.stringify(payload),
                        // 'credentials': 'include',
                    }).then((resp): Promise<APIResponseProps> => {
                        return resp.json();
                    }).then(reqResp => {

                        if (reqResp.success) {

                            setResults(reqResp.data.results); // Assume response is an array of vehicle data

                            if (Array.isArray(reqResp.data.results) && reqResp.data.results.length > 0) {

                                const cities = reqResp.data.results.filter((result: any) => result.TableName == "City")
                                const states = reqResp.data.results.filter((result: any) => result.TableName == "State")
                                const neighs = reqResp.data.results.filter((result: any) => result.TableName == "Neighborhood")
                                const lgs = reqResp.data.results.filter((result: any) => result.TableName == "LG")

                                setCities(() => cities)
                                setStates(() => states)
                                setNeighborhoods(() => neighs)
                                setLgs(() => lgs)

                            }

                        } else {
                            setReqResp(reqResp.message);
                            setLoading(false);
                        }

                    }).catch((error: any) => {
                        setReqResp(`${error}`);
                        setLoading(false);
                    });


                } catch (error) {
                    console.error("Error fetching location data", error);
                } finally {
                    setLoading(false);
                }

            } else {
                setResults([]); // Clear results if search term is too short
            }
        }, 500); // 500ms delay for debounce
    };

    const handleSelect = (value: any, type: string) => {
        var srchTerm = value.city;
        if (type == "City") {
            srchTerm = value.city;
        } else if (type == "State") {
            srchTerm = value.state;
        } else if (type == "Neighborhood") {
            srchTerm = value.neighborhood;
        } else if (type == "LG") {
            srchTerm = value.local_government;
        }

        setSearchTerm(`${srchTerm}`)
        setFormData((prev_val: any) => {
            const prevVal = { ...prev_val }
            return {
                ...prevVal,
                location: srchTerm,
            }
        })

        // props.set_form_data((prev_val: any) => {
        //     const prevVal = { ...prev_val }
        //     return {
        //         ...prevVal,
        //         location: srchTerm,
        //     }
        // });

        setResults([]); // Clear old results
        setCities([]); // Clear old results
        setStates([]); // Clear old results 
        setNeighborhoods([]); // Clear old results 
        setLgs([]); // Clear old results 
    };

    useEffect(() => {
        if (theme) {
            setThemeSett(theme.theme_settings);
        }
    }, [theme]);

    useEffect(() => {

        const handleClickOutside = (e: MouseEvent) => {
            if (ddRef.current && !ddRef.current.contains(e.target as Node) && inputRef.current && !inputRef.current.contains(e.target as Node)) {
                setReqResp(""); //Required
                setResults([]); // Clear old results
                setCities([]); // Clear old results
                setStates([]); // Clear old results 
                setNeighborhoods([]); // Clear old results 
                setLgs([]); // Clear old results 
                setIsOpened(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };

    }, [ddRef, inputRef]);

    return (
        <div className='w-full relative'>
            <input name={`search_term`} value={`${searchTerm}`} ref={inputRef}
                className={`w-full font-normal pl-1 outline-none placeholder:font-light placeholder:text-sm appearance-none resize-none 
                overflow-hidden ${tiny ? "text-sm h-7 !p-0 !m-0 w-fit" : "text-base h-12"}`}
                placeholder={"Enter a city, state or neighborhood..."} autoComplete='off'
                onKeyUp={(e) => handleKeyUp(e)} onChange={(e) => setSearchTerm(e.target.value)} />

            {(loading || is_opened || req_resp != "" || (results && results.length > 0))
                ? <div ref={ddRef} className='w-full max-w-[350px] bg-white shadow-2xl max-h-[400px] overflow-y-auto z-20 border border-gray-200 
                    scrollbar scrollbar-w-[10px] scrollbar-thumb-rounded-full scrollbar-thumb-${themeSett.primary_color}-500 rounded-md'
                    style={{
                        position: 'absolute',
                        left: '0',
                        top: '100%'
                    }}>

                    {loading && <div className='w-full h-[100px] flex justify-center items-center'>Loading...</div>}

                    {(Array.isArray(cities) && cities.length > 0 && !loading)
                        ?
                        <ul className="w-full divide-y divide-dashed divide-gray-300">
                            <li className='px-3 py-3 font-semibold text-base flex items-center'>
                                <FaCity size={16} className='mr-1' /> <span>Cities:</span>
                            </li>
                            {cities.map((city, index) => (
                                <li key={index} onClick={() => handleSelect(city, "City")}
                                    className="px-4 py-3 cursor-pointer hover:bg-gray-100 w-full">
                                    <div className=' flex justify-start items-start'>
                                        <div className='px-3 flex flex-col'>
                                            <div className='font-medium text-base'>{city.city}, {city.state} State</div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        : null
                    }

                    {(Array.isArray(states) && states.length > 0 && !loading)
                        ?
                        <ul className="w-full divide-y divide-dashed divide-gray-300">
                            <li className='px-3 py-3 font-semibold text-base flex items-center'>
                                <FaTreeCity size={16} className='mr-1' /> <span>States:</span>
                            </li>
                            {states.map((state, index) => (
                                <li key={index} onClick={() => handleSelect(state, "State")}
                                    className="px-4 py-3 cursor-pointer hover:bg-gray-100 w-full">
                                    <div className=' flex justify-start items-start'>
                                        <div className='px-3 flex flex-col'>
                                            <div className='font-medium text-base'>{state.state} State</div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        : null
                    }


                    {(Array.isArray(neighborhoods) && neighborhoods.length > 0 && !loading)
                        ?
                        <ul className="w-full divide-y divide-dashed divide-gray-300">
                            <li className='px-3 py-3 font-semibold text-base flex items-center'>
                                <FaTreeCity size={16} className='mr-1' /> <span>Neighborhoods:</span>
                            </li>
                            {neighborhoods.map((neigh, index) => (
                                <li key={index} onClick={() => handleSelect(neigh, "Neighborhood")}
                                    className="px-4 py-3 cursor-pointer hover:bg-gray-100 w-full">
                                    <div className=' flex justify-start items-start'>
                                        <div className='px-3 flex flex-col'>
                                            <div className='font-medium text-base'>{neigh.neighborhood}, {neigh.city}, {neigh.state} State</div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        : null
                    }

                    {(Array.isArray(lgs) && lgs.length > 0 && !loading)
                        ?
                        <ul className="w-full divide-y divide-dashed divide-gray-300">
                            <li className='px-3 py-3 font-semibold text-base flex items-center'>
                                <GiModernCity size={16} className='mr-1' /> <span>L.G Areas:</span>
                            </li>
                            {lgs.map((lg, index) => (
                                <li key={index} onClick={() => handleSelect(lg, "LG")}
                                    className="px-4 py-3 cursor-pointer hover:bg-gray-100 w-full">
                                    <div className=' flex justify-start items-start'>
                                        <div className='px-3 flex flex-col'>
                                            <div className='font-medium text-base'>{lg.local_government}, {lg.state} State</div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        : null
                    }

                    {(results.length < 1 && req_resp != "") ? <div className='w-full flex py-8 items-center justify-center'>{req_resp}</div> : null}
                </div>
                : null
            }
        </div>
    )

}

export default LocationLookupInput
