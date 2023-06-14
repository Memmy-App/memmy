import React from "react";
import {StyleSheet} from "react-native";
import {Icon, Pressable, ScrollView, View, VStack} from "native-base";
import {useAppDispatch, useAppSelector} from "../../store";
import {selectFeed, setDropdownVisible, setFeedListingType} from "../../slices/feed/feedSlice";
import {Cell, Section, TableView} from "react-native-tableview-simple";
import {selectCommunities} from "../../slices/communities/communitiesSlice";
import {CommunityView, ListingType} from "lemmy-js-client";
import {useRouter} from "expo-router";
import FeedHeaderDropdownHeaderComponent from "./FeedHeaderDropdownHeaderComponent";
import {Ionicons} from "@expo/vector-icons";
import {getBaseUrl} from "../../helpers/LinkHelper";

const FeedHeaderDropdownDrawer = () => {
    const {dropdownVisible} = useAppSelector(selectFeed);
    const {subscribedCommunities} = useAppSelector(selectCommunities);

    const dispatch = useAppDispatch();
    const router = useRouter();

    const onCommunityPress = (community: CommunityView) => {
        dispatch(setDropdownVisible());
        router.push(`/tabs/feeds/${community.community.id}`);
    };

    if(!dropdownVisible) return;

    return (
        <Pressable style={styles.container} onPress={() => dispatch(setDropdownVisible())}>
            <View style={styles.scrollContainer}>
                <ScrollView>
                    <TableView style={styles.table}>
                        <Section
                            roundedCorners={true}
                            hideSurroundingSeparators={true}
                        >

                            {
                                subscribedCommunities.length === 0 ? (
                                    <Cell
                                        cellStyle={"Basic"}
                                        title={"No subscribed communities"}
                                        isDisabled={true}
                                    />
                                ) : (
                                    <>
                                        {
                                            subscribedCommunities.map((community) => {
                                                return (
                                                    <Cell
                                                        key={community.community.id}
                                                        cellStyle={"Basic"}
                                                        title={`${community.community.name}@${getBaseUrl(community.community.actor_id)}`}
                                                        accessory={"DisclosureIndicator"}
                                                        onPress={() => onCommunityPress(community)}
                                                    />
                                                );
                                            })
                                        }
                                    </>
                                )
                            }
                        </Section>
                    </TableView>
                </ScrollView>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, .5)",
        position: "absolute",
        zIndex: 1,
        top: -10,
        bottom: 0,
        right: 0,
        left: 0,
    },

    scrollContainer: {
        flex: 1,
        alignItems: "stretch",
        width: "100%",
    },

    table: {
        flex: 1,
        marginHorizontal: 15
    },

    header: {
        flex: 1,
        backgroundColor: "gray"
    }
});

export default FeedHeaderDropdownDrawer;