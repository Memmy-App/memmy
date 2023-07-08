import React from "react";
import { PersonView } from "lemmy-js-client";
import FastImage from "react-native-fast-image";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { IconUser } from "tabler-icons-react-native";
import { useTheme } from "native-base";
import MCell from "../Table/MCell";
import { getBaseUrl } from "../../../helpers/LinkHelper";

interface IProps {
  user: PersonView;
}

function SearchUserItem({ user }: IProps) {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const theme = useTheme();

  const onPress = () => {
    navigation.push("Profile", {
      fullUsername: `${user.person.name}@${getBaseUrl(user.person.actor_id)}`,
    });
  };

  return (
    <MCell
      title={`${user.person.name}`}
      onPress={onPress}
      icon={
        user.person.avatar ? (
          <FastImage
            source={{ uri: user.person.avatar }}
            style={{ height: 24, width: 24, borderRadius: 100 }}
          />
        ) : (
          <IconUser color={theme.colors.app.accent} />
        )
      }
      showChevron
      subtitle={getBaseUrl(user.person.actor_id)}
    />
  );
}

export default React.memo(SearchUserItem);
