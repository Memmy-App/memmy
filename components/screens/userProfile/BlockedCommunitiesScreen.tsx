import React, {useCallback, useState} from "react";
import {ScrollView} from "native-base";
import {useFocusEffect} from "@react-navigation/native";
import {useAppDispatch, useAppSelector} from "../../../store";
import {selectSite} from "../../../slices/site/siteSlice";
import {getSiteInfo, unblockCommunity} from "../../../slices/site/siteActions";
import LoadingView from "../../ui/Loading/LoadingView";
import CTable from "../../ui/table/CTable";
import CSection from "../../ui/table/CSection";
import CCell from "../../ui/table/CCell";

const BlockedCommunitiesScreen = () => {
    const {communityBlocks, loaded} = useAppSelector(selectSite);

    const dispatch = useAppDispatch();

    useFocusEffect(useCallback(() => {
        dispatch(getSiteInfo());
    }, []));

    if(!loaded) {
        return <LoadingView />;
    }

    return (
        <ScrollView
            flex={1}
            backgroundColor={"screen.800"}
        >
            <CTable>
                <CSection
                    header={"BLOCKED COMMUNITIES"}
                >
                    {
                        communityBlocks.length === 0 ?
                            <CCell
                                cellStyle={"Basic"}
                                title={"No blocked communities"}
                            />
                            :
                            communityBlocks.map((b) => {
                                return (
                                    <CCell
                                        key={b.community.id}
                                        title={b.community.name}
                                        accessory={"DisclosureIndicator"}
                                        onPress={() => {
                                            dispatch(unblockCommunity(b.community.id));
                                        }}
                                    />
                                );
                            })
                    }
                </CSection>
            </CTable>
        </ScrollView>
    );
};

export default BlockedCommunitiesScreen;