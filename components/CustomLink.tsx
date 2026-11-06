"use client"

import { useEffect, useTransition } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { showPageLoader, hidePageLoader } from '@/app/GlobalRedux/app/appSlice'
import { toast } from 'react-toastify'

const CustomLinkMain = (params: any) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const path = usePathname();
    const [isPending, startTransition] = useTransition();

    // Sync the React transition state directly to your Redux loader
    useEffect(() => {
        if (isPending) {
            dispatch(showPageLoader());
        } else {
            dispatch(hidePageLoader());
        }
    }, [isPending, dispatch]);

    if (params.is_theme) {
        return (
            <div {...params} onClick={() => {
                toast.dismiss();
                toast.error("Navigation is not allowed in edit mode");
            }}>
                {params.children}
            </div>
        );
    }

    const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault(); // Stop standard link behavior

        const host = `${window.location.protocol}//${window.location.host}`;
        const curr_href = window.location.href;
        let curr_path = curr_href.replace(host, "");
        curr_path = decodeURIComponent(curr_path);

        if (params.href !== path && params.href !== curr_path) {
            // startTransition stays active until Next.js completes loading the new page
            startTransition(() => {
                router.push(params.href);
            });
        } else {
            // Just push immediately if it's the current page
            router.push(params.href);
        }
    };

    // Extract custom properties out so they don't break the native HTML <a> tag
    const { is_theme, children, ...restProps } = params;

    return (
        <a {...restProps} onClick={handleNavigation} className={params.className}>
            {children}
        </a>
    );
};

export default CustomLinkMain;
