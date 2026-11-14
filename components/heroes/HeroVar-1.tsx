'use client';

import React, { useEffect, useMemo, useState } from 'react'
import { BsArrowDown, BsArrowUp, BsGear } from 'react-icons/bs';
import { BiHappyHeartEyes, BiLayerPlus, BiRefresh, BiTrash } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/GlobalRedux/store';
import { RiShakeHandsLine } from 'react-icons/ri';
import { HiHomeModern } from 'react-icons/hi2';
import HeroSearch_1 from '../search-components/HeroSearch_1';
import { getComponent } from '../registry';
import NavVar1 from '../navs/NavVar-1';
import { Helpers } from "@/_lib/helper";
import SectionSettings from '../editor-items/SectionSettings';

const helpers = new Helpers();
const HeroVar1 = ({ is_theme = false, raw_data = {} }: { is_theme?: boolean, raw_data?: any }) => {

    const theme = useSelector((state: RootState) => state.theme);
    const user = useSelector((state: RootState) => state.user);
    const [themeSett, setThemeSett] = useState<any | null>(null);

    const NavComponent = useMemo(() => {
        const comp = getComponent(theme?.theme_settings?.nav_component?.type);
        return comp || NavVar1;   // Fallback to default card
    }, [theme?.theme_settings?.nav_component]);

    useEffect(() => {
        if (theme) {
            setThemeSett(theme.theme_settings);
        }
    }, [theme]);

    if (themeSett) {
        return <header className="w-full mt-0 grid grid-cols-1 tab:grid-cols-2 min-h-[95dvh] bg-gray-100 relative">

            <NavComponent transparent={true} is_theme={is_theme} />

            <div className="col-span-full tab:col-span-1 flex flex-col justify-center z-20 space-y-4 px-6 xs:px-10 sm:px-16 md:px-20 pt-30 pb-12">
                {/* <div className="font-medium text-3xl sm:text-4xl tab:text-6xl capitalize">Find Your</div>
                <div className="font-medium text-3xl sm:text-4xl tab:text-6xl capitalize flex items-center">
                    <div className=' px-3 py-3 bg-gray-200 mr-2 font-medium drop-shadow-lg rounded-md'>Dream</div> <div>Home</div>
                </div> */}

                <div className="font-medium text-3xl sm:text-4xl tab:text-6xl capitalize flex items-center 
                text-gray-100 tab:text-gray-950">
                    <p>{raw_data.header || "Find Your Dream Hom."}</p>
                </div>

                <div className="font-medium text-lg capitalize mt-4 text-gray-100 tab:text-gray-950">
                    <p>{raw_data.sub_header || "Our website make it easy for you to find your dream home."}</p>
                </div>

                <div className="mt-8 flex items-center">
                    <HeroSearch_1 raw_data={raw_data} />
                </div>

                <div className=' grid grid-cols-1 lg:grid-cols-3 mt-14 gap-4 *:grid *:grid-cols-[50px_1fr] *:gap-3'>
                    <div>
                        <div className={`bg-${themeSett.primary_color}/20 text-${themeSett.primary_color} flex 
                            items-center justify-center px-2 rounded-md drop-shadow-xl`}>
                            <RiShakeHandsLine size={50} />
                        </div>
                        <div className=' co-s flex flex-col text-gray-100 tab:text-gray-950'>
                            <div className='font-semibold text-xl lg:text-3xl'>{raw_data.counter_1_text || "0"}</div>
                            <div>{raw_data.counter_1_subtext || "Sold Properties"}</div>
                        </div>
                    </div>

                    <div>
                        <div className={`bg-${themeSett.primary_color}/20 text-${themeSett.primary_color} flex 
                            items-center justify-center px-2 rounded-md drop-shadow-xl`}>
                            <HiHomeModern size={50} />
                        </div>
                        <div className=' co-s flex flex-col text-gray-100 tab:text-gray-950'>
                            <div className='font-semibold text-xl lg:text-3xl'>{raw_data.counter_2_text || "0"}</div>
                            <div>{raw_data.counter_2_subtext || "Active Listings"}</div>
                        </div>
                    </div>

                    <div>
                        <div className={`bg-${themeSett.primary_color}/20 text-${themeSett.primary_color} flex 
                            items-center justify-center px-2 rounded-md drop-shadow-xl`}>
                            <BiHappyHeartEyes size={50} />
                        </div>
                        <div className=' co-s flex flex-col text-gray-100 tab:text-gray-950'>
                            <div className='font-semibold text-xl lg:text-3xl'>{raw_data.counter_3_text || "0"}</div>
                            <div>{raw_data.counter_3_subtext || "Happy Clients"}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full col-span-full tab:bg-none tab:col-span-1 absolute left-0 top-0 z-10 h-full tab:relative"
                style={{
                    backgroundSize: `cover`,
                    backgroundRepeat: `none`,
                    backgroundImage: "url('/ave-maria_low.jpg')",
                }}>

                <div className="absolute w-full h-full z-10 bg-gradient-to-t from-transparent to-black/50 from-80%
                bg-black/70 tab:bg-transparent"></div>
                <div className="absolute w-full h-full z-10 bg-gradient-to-b from-transparent to-black/50 from-80%"></div>
            </div>

            {is_theme && <SectionSettings raw_data={raw_data} category='home_hero' component='HeroVar1' component_type='Hero Section' />}

        </header>
    }
}

export default HeroVar1