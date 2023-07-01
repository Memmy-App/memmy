import { VStack, useTheme } from "native-base";

interface Props {
  children: React.ReactNode;
}

export const Post = ({ children }: Props) => {
  const theme = useTheme();

  return <VStack backgroundColor={theme.colors.app.fg}>{children}</VStack>;
};
