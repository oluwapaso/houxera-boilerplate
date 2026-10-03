 import React, { ReactNode, useEffect, useRef, useState } from 'react' 
import { hidePageLoader } from '@/app/GlobalRedux/app/appSlice';
import { AppDispatch, RootState } from '@/app/GlobalRedux/store'; 
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux'; 
import { Helpers } from '@/_lib/helper';

const helpers = new Helpers();
export const useNeighborhoodDetails = ({is_theme = false, raw_data = {}, component}: 
    { is_theme?: boolean; raw_data?: any; component?: string;}) => {
 
    const dispatch = useDispatch<AppDispatch>();
    const params = useParams();
    const searchParams = useSearchParams();
    const slug = params?.slug as string || "agric-ikorodu"; //Hardcoded part is for testing
    const router = useRouter();

    const company_unique_id = searchParams?.get("company_unique_id") as string || "";
    const channel_uid = searchParams?.get("channel_uid") as string || "";

    const user = useSelector((state: RootState) => state.user);
    const theme = useSelector((state: RootState) => state.theme);
    const [themeSett, setThemeSett] = useState<any | null>(null);
    const [page_url, setPageURL] = useState("");
    const [is_menu_shown, setIsMenuShown] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const [first_comp_pt, setFirstCompPt] = useState("pt-30 md:pt-35");

    const [neighInfo, setNeighInfo] = useState<any>({});
    const [neighInsight, setNeighInsight] = useState<any>({});
    const [neighProperties, setNeighProperties] = useState<any[]>([]);
    const [neighInfoLoaded, setNeighInfoLoaded] = useState<boolean>(false);
    const [neighInfoError, setNeighInfoError] = useState("");

    const [neighInfoComm, setNeighborhoodComm] = useState<any[]>([]);
    const [neighInfoCommLoaded, setNeighborhoodCommLoaded] = useState<boolean>(false);
    const [neighInfoCommError, setNeighborhoodCommError] = useState("");

    const [skip, setSkip] = useState(0);
    const [comment_resp, setCommResp] = useState("");
    const [has_more, setHasMore] = useState("No");
    const [rep_to_append, setRepToAppend] = useState<any>(null);
    const [curr_no_comms, setNoComms] = useState(0);

    let all_comments: React.JSX.Element[] = [];
 
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

    //, quoted_comments: string
    // const handleReply = (comment_uid: string) => {
    //     setModalChildren(<ReplyComment closeModal={closeModal} item_type="Neighborhood" item_uid={neighInfo.neighborhood_uid} comment_uid={comment_uid} setRepToAppend={setRepToAppend} setNoComms={setNoComms} />);
    //     setShowModal(true);

    //     const body = document.querySelector("body");
    //     if (body) {
    //         body.style.overflow = "hidden";
    //     }
    // }

    const LoadNeighsDetails = async () => {

        const payload = {
            "account_id": is_theme ? company_unique_id : process.env.NEXT_PUBLIC_ACCOUNT_ID,
            "channel_uid": is_theme ? channel_uid : process.env.NEXT_PUBLIC_CHANNEL_UID,
            "slug": slug,
            "user_uid": user.user_info?.user_uid,
        }

        const response = await window.MLS_Util.LoadNeighborhoodDetails(payload);

        let resp_message = response.message;
        let status_code = response.status_code;
        if (status_code == 200) {
            setNeighInfo(response.data.neighborhood);
            setNoComms(response.data?.neighborhood?.comments);
            setNeighInsight(response.data.insights);
            setNeighProperties(response.data.properties);
        } else {
            setNeighInfoError(resp_message)
        }

        setNeighInfoLoaded(true);

    }

    const LoadNeighsComments = async (skip: number) => {

        const payload = {
            "account_id": is_theme ? company_unique_id : process.env.NEXT_PUBLIC_ACCOUNT_ID,
            "channel_uid": is_theme ? channel_uid : process.env.NEXT_PUBLIC_CHANNEL_UID,
            "neighborhood_uid": neighInfo.neighborhood_uid,
            "skip": skip || 0,
            "size": 5,//20
        }

        const response = await window.MLS_Util.LoadNeighborhoodComments(payload);
        let resp_message = response.message;
        let status_code = response.status_code;
        if (status_code == 200) {

            setNeighborhoodComm((prev_comm: any[]) => [...prev_comm, ...response.data?.comments]);
            dispatch(hidePageLoader());
            setHasMore(response.data?.has_more);
            setSkip(skip);

        } else {
            setNeighborhoodCommError(resp_message);
            setHasMore("No");
        }

        setNeighborhoodCommLoaded(true);

    }

    const fetchMoreComments = async () => {
        const new_skip = skip + 1;
        LoadNeighsComments(new_skip);
    }

    const BuildSearchLink = (neighInfo: any) => {
        var link = "";
        var prop_delv = neighInfo.property_delivery;

        if (prop_delv.city && prop_delv.city != "") {
            link += `location=${prop_delv.city}&`;
        }

        if (Array.isArray(prop_delv.listing_type) && prop_delv.listing_type.length > 0) {
            link += `sales_type=${prop_delv.listing_type[0]}&`;
        }

        link = helpers.rTrim(link, "&");
        return link;
    }

    useEffect(() => {
        LoadNeighsComments(0);
    }, [neighInfo]);

    useEffect(() => {

        dispatch(hidePageLoader());
        if (window.MLS_Util) {
            LoadNeighsDetails();
        }

    }, [window.MLS_Util]);

    useEffect(() => {
        setPageURL(`${window.location.href}/neigh-info/${slug}`);
    }, []);

    useEffect(() => {
        if (theme) {
            setThemeSett(theme.theme_settings);
        }
    }, [theme]);

    useEffect(() => {
        if (rep_to_append) {
            setNeighborhoodCommLoaded(false);

            const to = setTimeout(() => {
                setNeighborhoodComm((prev_comm: any[]) => [rep_to_append, ...prev_comm]);
                setNeighborhoodCommLoaded(true);
            }, 250)

            const to2 = setTimeout(() => {
                const parentElement = document.getElementById('comment_area') as HTMLDivElement;
                if (parentElement) {
                    var top = parentElement.offsetTop - 10;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
            }, 550)

            return () => {
                clearTimeout(to);
                clearTimeout(to2);
            }

        }
    }, [rep_to_append]);

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

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsMenuShown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuRef]);

    const share_title = `Check out this neighborhod guide i found on ${process.env.NEXT_PUBLIC_CHANNEL_WEBSITE}`;
  
    return {
        slug,
        company_unique_id,
        channel_uid,
        neighInfo,
        neighInsight,
        neighProperties,
        neighInfoLoaded,
        neighInfoError,
        neighInfoComm,
        neighInfoCommLoaded,
        neighInfoCommError,
        skip,
        has_more,
        curr_no_comms,
        page_url,
        first_comp_pt,
        sectionHover, 
        themeSett,
        menuRef,
        is_menu_shown,
        all_comments,
        share_title,
        router,

        // handlers 
        dispatch,
        handleSettingsClick,
        handleCompPickerClick,
        handleHover,
        handleMouseExist, 
        fetchMoreComments,
        BuildSearchLink,
        setIsMenuShown,
        setNoComms,
        setRepToAppend
    };

}