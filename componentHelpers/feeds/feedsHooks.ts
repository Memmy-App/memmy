import {useEffect, useState} from "react";
import {ListingType, PostView, SortType} from "lemmy-js-client";
import {useAppSelector} from "../../store";
import {selectSettings} from "../../slices/settings/settingsSlice";
import {lemmyAuthToken, lemmyInstance} from "../../lemmy/LemmyInstance";
import {removeDuplicatePosts} from "../../lemmy/LemmyHelpers";

export const useFeed = () => {
    const settings = useAppSelector(selectSettings);

    const [posts, setPosts] = useState<PostView[]|null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [sort, setSort] = useState<SortType>(settings.defaultSort);
    const [listingType, setListingType] = useState<ListingType>(settings.defaultListingType);
    const [nextPage, setNextPage] = useState(1);

    useEffect(() => {
        console.log("hi");

        if(lemmyInstance) {
            load(true);
        }
    }, [sort, listingType]);

    const load = async (refresh = false) => {
        setLoading(true);

        console.log(nextPage);

        try {
            const res = await lemmyInstance.getPosts({
                auth: lemmyAuthToken,
                limit: 20,
                page: refresh ? 1 : nextPage,
                sort: sort,
                type_: listingType,
            });

            if(!posts || refresh) {
                setPosts(res.posts);
                setNextPage(2);
            } else {
                setPosts(prev => [...prev, ...removeDuplicatePosts(prev.slice(0, 50), res.posts)]);
                setNextPage(prev => prev + 1);
            }

            setLoading(false);
        } catch(e) {
            console.log(e);
            setPosts(null);
            setLoading(false);
        }
    };

    return {
        posts,
        loading,
        sort,
        listingType,
        load,
        setSort,
        setListingType,
    };
};