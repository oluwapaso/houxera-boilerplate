'use client';

import { useStickyAbsolute } from '@/_hooks/useStickyAbsolute';
import React, { useRef, useState } from 'react'
import { BiRefresh, BiTrash } from 'react-icons/bi'
import { BsGear } from 'react-icons/bs'

const ComponentSettings = ({ is_theme = false, category, component, component_type, raw_data = {} }:
    { is_theme?: boolean, category: string, component: string, component_type: string, raw_data?: any }) => {

    const barRef = useRef<HTMLDivElement>(null);
    useStickyAbsolute(barRef, 16);
    const [sectionHover, setSectionHover] = useState<boolean>(false);
    const handleSettingsClick = () => {
        // Send a message to the parent window 
        window.parent.postMessage(
            {
                type: 'OPEN_EDITOR_SETTINGS',
                data: {
                    "category": category,
                    "type": "section",
                    "component": component,
                    ...raw_data,
                }
            },
            '*' // In production, replace '*' with your parent URL for security
        );
    };

    const handleCompPickerClick = (event_type: string) => {
        // Send a message to the parent window
        window.parent.postMessage(
            {
                type: event_type,
                component_index: raw_data?.component_index,
                component_type: component_type
            },
            '*' // In production, replace '*' with your parent URL for security
        );
    }

    const handleHover = () => {
        setSectionHover(true);
    }

    const handleMouseExist = () => {
        setSectionHover(false);
    }

    var bg_class = "bg-white"
    if (component == "LoginFormVar1") {
        bg_class = "bg-gray-50"
    }

    return (
        <div ref={barRef} className={` ${bg_class} w-fit shadow-lg hover:shadow-2xl absolute p-3 rounded-md xabsolute z-[1000] right-4 top-4 space-x-3 flex items-center 
        divide-x divide-gray-200 justify-end *:text-gray-800 *:flex *:items-center *:justify-center 
        *:px-2 *:py-1 *:rounded *:cursor-pointer`}>

            <div id='editor_settings' className='hover:shadow-2xl relative group'
                onClick={handleSettingsClick} onMouseOver={handleHover} onMouseOut={handleMouseExist}>
                <BsGear size={20} />

                <span className='absolute hidden whitespace-nowrap group-hover:block top-[calc(100%+10px)] px-2 py-2 w-fit rounded bg-gray-800 
                text-white text-xs'>
                    Section settings
                </span>
            </div>

            <div id='editor_settings' className='hover:shadow-2xl relative group'
                onClick={() => handleCompPickerClick("CHANGE_LAYOUT")} onMouseOver={handleHover} onMouseOut={handleMouseExist}>
                <BiRefresh size={20} />

                <span className='absolute hidden whitespace-nowrap group-hover:block top-[calc(100%+10px)] px-2 py-2 w-fit rounded bg-gray-800 
                text-white text-xs right-0'>
                    Replace Section
                </span>
            </div>

            <div id='editor_settings' className='hover:shadow-2xl relative group'
                onClick={() => handleCompPickerClick("REMOVE_SECTION")} onMouseOver={handleHover} onMouseOut={handleMouseExist}>
                <BiTrash size={20} />

                <span className='absolute hidden right-0 whitespace-nowrap group-hover:block top-[calc(100%+10px)] px-2 py-2 w-fit rounded bg-gray-800 
                text-white text-xs'>
                    Remove Section Down
                </span>
            </div>

        </div>
    )
}

export default ComponentSettings
