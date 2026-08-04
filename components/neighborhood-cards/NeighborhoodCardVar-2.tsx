'use client';

import { useEffect, useState } from 'react';
import { BiChat } from 'react-icons/bi';
import { Neighorhood } from '../types';
import { RootState } from '@/app/GlobalRedux/store';
import { useSelector } from 'react-redux';
import { BsEye } from 'react-icons/bs';
import CustomLinkMain from '../CustomLink';

const NeighborhoodCardVar2 = ({ neigh_info, is_theme = false }: { neigh_info: Neighorhood, is_theme?: boolean }) => {

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
                className="w-full cursor-pointer group">
                <div className="relative overflow-hidden bg-white border-2 border-white rounded-xl h-[450px]">
                    {/* Background Image */}
                    <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-all duration-300 ease-out"
                        style={{ backgroundImage: `url(${header_image_large})` }} />

                    {/* Blur Overlay - bottom 50%, fading upward */}
                    <div
                        className="absolute inset-x-0 bottom-0 h-2/3 backdrop-blur-sm backdrop"
                        style={{
                            maskImage: 'linear-gradient(to top, black, transparent)',
                            WebkitMaskImage: 'linear-gradient(to top, black, transparent)',
                        }}
                    />

                    {/* Dark Gradient Overlay - Bottom */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                    {/* Content - Bottom Section */}
                    <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col gap-4">
                        {/* Title and Subtitle */}
                        <div>
                            <h2 className="text-xl font-bold text-white">{title}</h2>
                            <p className="text-gray-200 text-sm line-clamp-2">{excerpt}</p>
                        </div>

                        {/* Info Row */}
                        <div className="flex items-center gap-4 text-sm text-gray-100">
                            <div className="flex items-center gap-2">
                                <BsEye size={18} />
                                <span>{views}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <BiChat size={18} />
                                <span>{comments}</span>
                            </div>
                        </div>

                        {/* Search Button */}
                        <button className="w-full py-3 px-4 bg-white text-black font-semibold rounded-md hover:bg-gray-100 
                        transition-colors cursor-pointer">
                            Explore Neighborhood
                        </button>
                    </div>
                </div>
            </CustomLinkMain>
        );
    }
}

export default NeighborhoodCardVar2