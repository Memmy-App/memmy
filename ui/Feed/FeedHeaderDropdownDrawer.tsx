import React, {useEffect} from "react";
import {Alert, StyleSheet} from "react-native";
import {VStack} from "native-base";
import {useAppDispatch, useAppSelector} from "../../store";
import {selectFeed} from "../../slices/feed/feedSlice";
import {Cell, Section, TableView} from "react-native-tableview-simple";
import {selectCommunities} from "../../slices/communities/communitiesSlice";
import {CommunityView} from "lemmy-js-client";

const FeedHeaderDropdownDrawer = () => {
    const {dropdownVisible} = useAppSelector(selectFeed);
    const {subscribedCommunities} = useAppSelector(selectCommunities);

    useEffect(() => {
        console.log("Communities: ", subscribedCommunities);
    }, [subscribedCommunities]);

    const onCommunityPress = (community: CommunityView) => {
        Alert.alert(community.community.name);
    };

    if(!dropdownVisible) return;

    return (
        <VStack style={styles.container}>
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
        </VStack>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        backgroundColor: "transparent",
        position: "absolute",
        padding: 10,
        zIndex: 1,
        width: "90%",
        right: "5%",
        left: "5%",
        top: -5,
    },

    table: {
        width: "100%",
        shadowColor: "black",
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowOpacity: 1,
        shadowRadius: 100,
        elevation: 5,
    }
});

export default FeedHeaderDropdownDrawer;