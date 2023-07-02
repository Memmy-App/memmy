import React from "react";
import { Section, TableView } from "@gkasdorf/react-native-tableview-simple";
import {
  IconArrowDown,
  IconChevronRight,
  IconNote,
  IconPlanet,
  IconUser,
} from "tabler-icons-react-native";
import { useTheme, View } from "native-base";
import CCell from "../table/CCell";
import MTable from "../table/MTable";
import MCell from "../table/MCell";

function SearchOptionsList() {
  const theme = useTheme();

  return (
    <View p={4}>
      <MTable>
        <MCell
          title="Search Communities"
          onPress={() => {}}
          icon={<IconPlanet color={theme.colors.app.accent} />}
          rightAccessory={<IconChevronRight color={theme.colors.app.accent} />}
        />
        <MCell
          title="Search Users"
          onPress={() => {}}
          icon={<IconUser color={theme.colors.app.accent} />}
          rightAccessory={<IconChevronRight color={theme.colors.app.accent} />}
        />
        <MCell
          title="Search Posts"
          onPress={() => {}}
          icon={<IconNote color={theme.colors.app.accent} />}
          rightAccessory={<IconChevronRight color={theme.colors.app.accent} />}
        />
      </MTable>
    </View>
  );
}

export default SearchOptionsList;
