import React from "react";
import { useTheme, VStack } from "native-base";
import { Section, TableView } from "react-native-tableview-simple";
import { StyleSheet } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

function BookmarksScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<any>;
}) {
  const theme = useTheme();

  return (
    <VStack flex={1} backgroundColor={theme.colors.app.bg}>
      <TableView style={styles.table}>
        <Section header="BOOKMARKS" roundedCorners hideSurroundingSeparators>
          {/* {bookmarks.map((b) => ( */}
          {/*  <CCell */}
          {/*    key={b.postId} */}
          {/*    cellStyle="Basic" */}
          {/*    title={b.postName} */}
          {/*    onPress={() => { */}
          {/*      navigation.push("Post", {}); */}
          {/*    }} */}
          {/*    accessory="DisclosureIndicator" */}
          {/*    backgroundColor={theme.colors.app.bg} */}
          {/*    titleTextColor={theme.colors.app.textPrimary} */}
          {/*    rightDetailColor={theme.colors.app.textSecondary} */}
          {/*  /> */}
          {/* ))} */}
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
