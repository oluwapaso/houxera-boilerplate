
 import React, { ReactNode, useEffect, useRef, useState } from 'react' 
import { hidePageLoader } from '@/app/GlobalRedux/app/appSlice';
import { AppDispatch, RootState } from '@/app/GlobalRedux/store'; 
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';  
 
export const useServiceDetails  = ({is_theme = false, raw_data = {}, component}: 
    { is_theme?: boolean; raw_data?: any; component?: string;}) => {
    
    const dispatch = useDispatch<AppDispatch>();
    const params = useParams();
    const searchParams = useSearchParams();
    const slug = params?.slug as string || "high-end-properties"; //Hardcoded part is for testing
    const router = useRouter();

    const company_unique_id = searchParams?.get("company_unique_id") as string || "";
    const channel_uid = searchParams?.get("channel_uid") as string || ""; 

    const user = useSelector((state: RootState) => state.user);
    const theme = useSelector((state: RootState) => state.theme);
    const [themeSett, setThemeSett] = useState<any | null>(null); 
    const [first_comp_pt, setFirstCompPt] = useState("pt-30 md:pt-35");

    const [serviceInfo, setServiceInfo] = useState<any>({});
    const [serviceInfoLoaded, setServiceInfoLoaded] = useState<boolean>(false);
    const [serviceInfoError, setServiceInfoError] = useState(""); 
    const [sectionHover, setSectionHover] = useState<boolean>(false); 

    const handleSettingsClick = () => {
        // Send a message to the parent window
        window.parent.postMessage(
            {
                type: 'OPEN_EDITOR_SETTINGS',
                data: {
                    "category": "neighborhood_details",
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
                component_type: "Neighborhood Posts"
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
    
    const LoadServicesDetails = async () => {

        const payload = {
            "account_id": is_theme ? company_unique_id : process.env.NEXT_PUBLIC_ACCOUNT_ID,
            "channel_uid": is_theme ? channel_uid : process.env.NEXT_PUBLIC_CHANNEL_UID,
            "slug": slug,
            "user_uid": user.user_info?.user_uid,
        }

        const response = await window.MLS_Util.LoadServiceDetails(payload);

        let resp_message = response.message;
        let status_code = response.status_code;
        if (status_code == 200) {
            setServiceInfo(response.data.service);
        } else {
            setServiceInfoError(resp_message)
        }

        setServiceInfoLoaded(true);

    }   

    useEffect(() => {

        dispatch(hidePageLoader());
        if (window.MLS_Util) {
            LoadServicesDetails();
        }

    }, [window.MLS_Util]); 

    useEffect(() => {
        if (theme) {
            setThemeSett(theme.theme_settings);
        }
    }, [theme]);


    useEffect(() => {

        if (raw_data?.component_index !== 0) return;

        const navType = themeSett?.nav_component?.type;

        if (navType === "NavVar6") {
            setFirstCompPt("pt-52");
            return;
        }

        if (navType === "NavVar7") {
            const updatePadding = () => {
                const nav = document.getElementById("main-nav");
                const isMobile = nav?.getAttribute("data-is-mobile") === "true";
                // Adjust these values to whatever looks correct
                setFirstCompPt(isMobile ? "pt-25 md:pt-35" : "pt-54");
            };

            updatePadding(); // initial

            // Watch for changes (forceMobile can change on resize)
            const observer = new MutationObserver(updatePadding);
            const nav = document.getElementById("main-nav");
            if (nav) {
                observer.observe(nav, {
                    attributes: true,
                    attributeFilter: ["data-is-mobile"],
                });
            }

            return () => observer.disconnect();
        }

    }, [themeSett?.nav_component?.type, raw_data?.component_index]); 
      
    return {
        slug,
        company_unique_id,
        channel_uid,
        serviceInfo,  
        serviceInfoLoaded,
        serviceInfoError,  
        first_comp_pt, 
        themeSett,  
        router,

        // handlers 
        dispatch,
        handleSettingsClick,
        handleCompPickerClick, 
        handleHover,
        handleMouseExist, 
    };
        
}