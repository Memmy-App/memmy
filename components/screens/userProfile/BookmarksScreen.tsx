import React from "react";
import { useTheme, VStack } from "native-base";
import { Cell, Section, TableView } from "react-native-tableview-simple";
import { StyleSheet } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAppSelector } from "../../../store";
import { selectBookmarks } from "../../../slices/bookmarks/bookmarksSlice";

function BookmarksScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<any>;
}) {
  const { bookmarks } = useAppSelector(selectBookmarks);
  const theme = useTheme();

  return (
    <VStack flex={1} backgroundColor={theme.colors.app.bgSecondary}>
      <TableView style={styles.table}>
        <Section header="BOOKMARKS" roundedCorners hideSurroundingSeparators>
          {bookmarks.map((b) => (
            <Cell
              key={b.postId}
              cellStyle="Basic"
              title={b.postName}
              onPress={() => {
                navigation.push("Post", {});
              }}
              accessory="DisclosureIndicator"
              backgroundColor={theme.colors.app.bgTertiary}
              titleTextColor={theme.colors.app.textPrimary}
              rightDetailColor={theme.colors.app.iconColor}
            />
          ))}
        </Section>
      </TableView>
    </VStack>
  );
}

const styles = StyleSheet.create({
  table: {
    marginHorizontal: 15,
  },
});

export default BookmarksScreen;
