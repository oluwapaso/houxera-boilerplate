'use client';

import { useEffect, useState } from 'react';
import { BiChat } from 'react-icons/bi';
import { Neighorhood } from '../types';
import { RootState } from '@/app/GlobalRedux/store';
import { useSelector } from 'react-redux';
import { BsEye } from 'react-icons/bs';
import CustomLinkMain from '../CustomLink';
import { Helpers } from '@/_lib/helper';
import { FiExternalLink } from 'react-icons/fi';

const helpers = new Helpers();
const NeighborhoodCardVar4 = ({ neigh_info, is_theme = false }: { neigh_info: Neighorhood, is_theme?: boolean }) => {

    const theme = useSelector((state: RootState) => state.theme);
    const [themeSett, setThemeSett] = useState<any | null>(null);
    const [isFavorite, setIsFavorite] = useState(false);

    const { neighborhood_uid, company_uid, title, slug, header_image_large, header_image_small,
        views, comments, excerpt } = neigh_info

    useEffect(() => {
        if (theme) {
            setThemeSett(theme.theme_settings);
        }
    }, [theme]);

    if (themeSett && themeSett != null) {

        return (
            <CustomLinkMain href={`/neighborhood-insight/${neigh_info.slug}`} is_theme={is_theme}
                className="w-full cursor-pointer group shadow-xl rounded-2xl p-4 bg-white overflow-hidden">
                <div className='flex flex-col space-y-5'>
                    <div className='relative h-[300px] rounded-2xl z-3 overflow-hidden'>
                        {/* Background Image */}
                        <div className="absolute z-1 h-full rounded-2xl overflow-hidden inset-0 bg-cover bg-center group-hover:scale-105 transition-all duration-300 ease-out"
                            style={{ backgroundImage: `url(${header_image_large})` }} />
                        {/* Blur Overlay - bottom 50%, fading upward */}
                        <div
                            className="absolute z-2 inset-x-0 bottom-0 h-2/3 backdrop-blur-sm backdrop rounded-bl-2xl rounded-br-2xl"
                            style={{
                                maskImage: 'linear-gradient(to top, black, transparent)',
                                WebkitMaskImage: 'linear-gradient(to top, black, transparent)',
                            }}
                        />
                    </div>


                    <div className='relative overflow-hidden'>
                        <div className=" relative inset-x-0 bottom-0 flex flex-col gap-4 pb-12 h-full">
                            {/* Title and Subtitle */}
                            <div>
                                <h2 className="text-xl font-bold text-gray-950 line-clamp-2">{title}</h2>
                                <p className="text-gray-950 text-sm line-clamp-4">{excerpt}</p>
                            </div>

                            {/* Info Row */}
                            <div className="flex items-center justify-between">
                                <div className=' flex items-center gap-4 text-sm text-gray-950'>
                                    <div className="flex items-center gap-2">
                                        <BsEye size={18} />
                                        <span>{views}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <BiChat size={18} />
                                        <span>{comments}</span>
                                    </div>
                                </div>
                            </div>

                            <div className=' absolute bottom-0 left-0 w-full flex items-end justify-end h-12'>
                                <button className={`w-fit py-2 px-4 font-semibold rounded-md hover:bg-gray-100 cursor-pointer 
                                transition-colors text-xs hover:shadow-md flex items-center justify-center bg-${themeSett.primary_color} 
                                text-${themeSett.primary_button_text} hover:bg-${helpers.adjustColorShade(themeSett.primary_color, 1)}
                                space-x-1.5`}>
                                    <span>Explore Neighborhood</span>
                                    <FiExternalLink size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </CustomLinkMain>
        );
    }
}

export default NeighborhoodCardVar4