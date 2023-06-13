import React from "react";
import {useAppDispatch, useAppSelector} from "../../store";
import {selectFeed, setDropdownVisible} from "../../slices/feed/feedSlice";
import {Button} from "react-native";
import {useRouter} from "expo-router";

const FeedHeaderRightButton = () => {
    const {dropdownVisible} = useAppSelector(selectFeed);

    const dispatch = useAppDispatch();
    const router = useRouter();

    if(dropdownVisible) {
        return (
            <Button title={"Cancel"} onPress={() => {
                dispatch(setDropdownVisible());
            }} />
        );
    }

    return (
        <Button title={"New Post"} onPress={() => router.push("/tabs/feeds/newPost")} />
    );
};

export default FeedHeaderRightButton;