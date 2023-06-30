import React from "react";
import { Box, useTheme } from "native-base";

interface IProps {
  children: React.ReactNode;
}

function ThumbnailBox({ children }: IProps) {
  const { colors } = useTheme();
  return (
    <Box
      width={75}
      height={75}
      backgroundColor={colors.app.bg}
      borderRadius={10}
      justifyContent="center"
      alignItems="center"
      alignSelf="center"
    >
      {children}
    </Box>
  );
}

export default ThumbnailBox;
