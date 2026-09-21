'use client';

import { BsArrowRight } from 'react-icons/bs';
import { BlogPost } from '../types';
import moment from 'moment';
import CustomLinkMain from '../CustomLink';
import { useEffect, useState } from 'react';
import { RootState } from '@/app/GlobalRedux/store';
import { useSelector } from 'react-redux';

export function BlogCardVar2({ blog_post, is_theme }: { blog_post: BlogPost, is_theme: boolean }) {

    var { post_uid, company_uid, title, slug, category_uid, category_name, summary, post_body, header_image_large, header_image_small,
        clicks, views, comments, channels, date_added, } = blog_post

    const theme = useSelector((state: RootState) => state.theme);
    const [themeSett, setThemeSett] = useState<any | null>(null);

    useEffect(() => {
        if (theme) {
            setThemeSett(theme.theme_settings);
        }
    }, [theme]);

    header_image_large = header_image_large ? header_image_large : "../no-image-found.jpg"

    if (themeSett) {
        return (
            <CustomLinkMain href={`/blog-post/${slug}`} is_theme={is_theme} className="group flex flex-col h-full overflow-hidden 
                rounded-xl bg-card shadow-xl hover:shadow-2xl transition-shadow cursor-pointer duration-300">
                {/* Image Container */}
                <div className="relative w-full aspect-[3/2] sm:aspect-[4/2] md:aspect-[3/2] overflow-hidden !bg-cover !bg-center 
                border-b border-gray-300" style={{ background: `url('${header_image_large}')` }}>
                </div>

                {/* Content Container */}
                <div className="flex flex-col flex-1 p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl cursor-pointer font-semibold text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                        {title}
                    </h3>

                    <p className="text-sm sm:text-base text-muted-foreground line-clamp-2 flex-grow text-gray-600">
                        {summary}
                    </p>

                    <div className={`h-0.5 w-full my-6 bg-gradient-to-r rounded-full from-transparent 
                    via-${themeSett.primary_color} to-transparent transition-opacity duration-700 `} />

                    {/* Footer with Author and Date */}
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <p className="text-xs sm:text-sm font-medium text-foreground flex items-center space-x-1.5">
                                <span className=' font-medium'>Views:</span>
                                <span>{views}</span>
                            </p>
                            <p className="text-xs text-muted-foreground">{moment(date_added).format("Do MMM, YYYY")}</p>
                        </div>
                        <div className={`p-3 rounded bg-${themeSett.primary_color} text-${themeSett.primary_button_text}`}>
                            <BsArrowRight className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer 
                            group-hover:opacity-100 transition-opacity" />
                        </div>
                    </div>
                </div>
            </CustomLinkMain>
        );
    }
}
