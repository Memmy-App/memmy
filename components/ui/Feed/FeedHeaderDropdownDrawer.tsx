import React from "react";
import {StyleSheet} from "react-native";
import {Pressable, ScrollView, View} from "native-base";
import {useAppDispatch, useAppSelector} from "../../../store";
import {selectFeed, setDropdownVisible} from "../../../slices/feed/feedSlice";
import {Cell, Section, TableView} from "react-native-tableview-simple";
import {selectCommunities} from "../../../slices/communities/communitiesSlice";
import {CommunityView} from "lemmy-js-client";
import {getBaseUrl} from "../../../helpers/LinkHelper";
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";

const FeedHeaderDropdownDrawer = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const {dropdownVisible} = useAppSelector(selectFeed);
    const {subscribedCommunities} = useAppSelector(selectCommunities);

    const dispatch = useAppDispatch();

    const onCommunityPress = (community: CommunityView) => {
        dispatch(setDropdownVisible());
        navigation.push("Community", {
            communityId: community.community.id,
            communityName: community.community.name,
            actorId: community.community.actor_id
        });
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