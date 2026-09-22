'use client';

import moment from "moment";
import CustomLinkMain from "../CustomLink";
import { BlogPost } from "../types"
import { BiStar } from "react-icons/bi";
import { BsArrowRight } from "react-icons/bs";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/GlobalRedux/store";

export function BlogCardVar4({ blog_post, is_theme, featured = false }: { blog_post: BlogPost, is_theme: boolean, featured?: boolean }) {

    var { post_uid, company_uid, title, slug, category_uid, category_name, summary, post_body, header_image_large, header_image_small,
        clicks, views, comments, channels, date_added, } = blog_post

    header_image_large = header_image_large ? header_image_large : "../no-image-found.jpg"

    const theme = useSelector((state: RootState) => state.theme);
    const [themeSett, setThemeSett] = useState<any | null>(null);

    useEffect(() => {
        if (theme) {
            setThemeSett(theme.theme_settings);
        }
    }, [theme]);

    if (featured && themeSett) {
        return (
            <CustomLinkMain href={`/blog-post/${slug}`} is_theme={is_theme}
                className="flex flex-col md:flex-row gap-0 md:gap-6 cursor-pointer group">
                <div className="w-full md:w-2/5 flex-shrink-0">
                    <div className="relative w-full aspect-[5/4] sm:aspect-[4/2] md:aspect-[5/3] overflow-hidden !bg-cover !bg-center rounded-md"
                        style={{ background: `url('${header_image_large}')` }}>
                        <div className=" absolute top-1.5 left-1.5 px-5 py-2 bg-black/50 backdrop-blur-sm text-white flex 
                        items-center space-x-1.5 rounded text-sm font-semibold">
                            <BiStar size={15} /> <span>Featured</span>
                        </div>
                    </div>
                </div>
                <div className="flex-1 py-6 md:py-0 flex flex-col justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-sky-700">{title}</h2>
                        <p className="text-gray-700 text-sm leading-relaxed">
                            {summary}
                        </p>
                    </div>

                    <div className="flex items-center justify-between gap-3 py-3 border-t border-gray-200">
                        <div className="text-sm">
                            <p className="font-medium text-gray-900 flex items-center space-x-1.5">
                                <span className="font-medium">Views:</span> <span>{views}</span>
                            </p>
                            <p className="text-gray-500 italic">{moment(date_added).format("Do MMM, YYYY")}</p>
                        </div>

                        <div className={`bg-${themeSett.primary_color} text-${themeSett.primary_button_text} flex items-center rounded 
                        px-5 py-2 cursor-pointer hover:drop-shadow-xl text-sm space-x-2`}>
                            <span>Read more</span> <BsArrowRight size={16} />
                        </div>
                    </div>
                </div>
            </CustomLinkMain>
        )
    }

    if (themeSett) {
        return (
            <CustomLinkMain href={`/blog-post/${slug}`} is_theme={is_theme}
                className="flex flex-col h-full border border-gray-200 cursor-pointer group bg-white 
                drop-shadow hover:drop-shadow-xl">
                <div className="relative w-full aspect-[3/2] sm:aspect-[4/2] md:aspect-[3/2] overflow-hidden !bg-cover !bg-center"
                    style={{ background: `url('${header_image_large}')` }}>
                </div>

                <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-sky-700">
                            {title}
                        </h3>
                        <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                            {summary}
                        </p>
                    </div>

                    <div className={`h-0.5 w-full my-4 bg-gradient-to-r rounded-full from-transparent 
                    via-${themeSett.primary_color} to-transparent transition-opacity duration-700 `} />

                    <div className="flex items-center justify-between gap-3">
                        <div className="text-xs">
                            <p className="font-medium text-gray-900 flex items-center space-x-1.5">
                                <span className="font-medium">Views:</span> <span>{views}</span>
                            </p>
                            <p className="text-gray-500 italic">{moment(date_added).format("Do MMM, YYYY")}</p>
                        </div>

                        <div className={`bg-${themeSett.primary_color} text-${themeSett.primary_button_text} flex items-center rounded 
                        px-5 py-2 cursor-pointer hover:drop-shadow-xl text-sm space-x-2`}>
                            <span>Read more</span> <BsArrowRight size={16} />
                        </div>
                    </div>
                </div>
            </CustomLinkMain>
        )
    }
}
