import React, {ReactElement, ReactNode} from "react";
import {StyleSheet} from "react-native";
import {Icon, ScrollView, Text, View, VStack} from "native-base";
import {useAppDispatch, useAppSelector} from "../../store";
import {selectFeed, setDropdownVisible, setFeedListingType} from "../../slices/feed/feedSlice";
import {Cell, Section, TableView} from "react-native-tableview-simple";
import {selectCommunities} from "../../slices/communities/communitiesSlice";
import {CommunityView, ListingType} from "lemmy-js-client";
import {useRouter} from "expo-router";
import FeedHeaderDropdownHeaderComponent from "./FeedHeaderDropdownHeaderComponent";
import {Ionicons} from "@expo/vector-icons";

const FeedHeaderDropdownDrawer = () => {
    const {dropdownVisible, listingType} = useAppSelector(selectFeed);
    const {subscribedCommunities} = useAppSelector(selectCommunities);

    const dispatch = useAppDispatch();
    const router = useRouter();

    const onCommunityPress = (community: CommunityView) => {
        dispatch(setDropdownVisible());
        router.push(`/tabs/feeds/${community.community.id}`);
    };

    const onSelectListingType = (type: ListingType) => {
        dispatch(setFeedListingType(type));
        dispatch(setDropdownVisible());
    };

    if(!dropdownVisible) return;

    return (
        <VStack style={styles.container}>
            <View style={styles.scrollContainer}>
                <ScrollView>
                    <TableView style={styles.table}>
                        <Section
                            hideSurroundingSeparators={false}
                            headerComponent={<FeedHeaderDropdownHeaderComponent text={"View"} />}
                        >

                            <Cell
                                cellStyle={"Basic"}
                                title={"All"}
                                onPress={() => onSelectListingType("All")}
                                cellAccessoryView={listingType === "All" ? <Icon as={Ionicons} name={"checkmark-outline"} size={6} /> : null}
                            />
                            <Cell
                                cellStyle={"Basic"}
                                title={"Local"}
                                onPress={() => onSelectListingType("Local")}
                                cellAccessoryView={listingType === "Local" ? <Icon as={Ionicons} name={"checkmark-outline"} size={6} /> : null}

                            />
                            <Cell
                                cellStyle={"Basic"}
                                title={"Subscribed"}
                                onPress={() => onSelectListingType("Subscribed")}
                                cellAccessoryView={listingType === "Subscribed" ? <Icon as={Ionicons} name={"checkmark-outline"} size={6} /> : null}
                            />
                        </Section>

                        <Section
                            hideSurroundingSeparators={false}
                            headerComponent={<FeedHeaderDropdownHeaderComponent text={"Subscribed"} />}
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
                                                        title={community.community.name}
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
        </VStack>
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
    },

    header: {
        flex: 1,
        backgroundColor: "gray"
    }
});

export default FeedHeaderDropdownDrawer;