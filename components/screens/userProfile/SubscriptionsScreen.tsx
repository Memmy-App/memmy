import React from "react";
import {useAppSelector} from "../../../store";
import {selectCommunities} from "../../../slices/communities/communitiesSlice";
import {ScrollView, VStack} from "native-base";
import CTable from "../../ui/table/CTable";
import CSection from "../../ui/table/CSection";
import CCell from "../../ui/table/CCell";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {getBaseUrl} from "../../../helpers/LinkHelper";

const SubscriptionsScreen = ({navigation}: {navigation: NativeStackNavigationProp<any>}) => {
    const {subscribedCommunities} = useAppSelector(selectCommunities);

    return (
        <ScrollView
            flex={1}
            backgroundColor={"screen.800"}
        >
            <CTable>
                <CSection
                    props={{
                        header: "SUBSCRIPTIONS",
                    }}
                >
                    {
                        subscribedCommunities?.map((community) => (
                            <CCell
                                key={community.community.id}
                                props={{
                                    title: `${community.community.name}@${getBaseUrl(community.community.actor_id)}`,
                                    accessory: "DisclosureIndicator",
                                    onPress: () => {
                                        navigation.navigate("Community", {
                                            communityId: community.community.id,
                                            communityName: community.community.name,
                                            actorId: community.community.actor_id
                                        });
                                    }
                                }}
                            />
                        ))
                    }
                </CSection>                
            </CTable>
        </ScrollView>
    );
};

export default SubscriptionsScreen;