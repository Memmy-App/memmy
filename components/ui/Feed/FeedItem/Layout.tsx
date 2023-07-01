import { HStack } from "native-base";

interface Props {
  children: React.ReactNode;
}

export const Header = ({ children }: Props) => {
  return (
    <HStack
      mx={4}
      mt={2}
      mb={2}
      justifyContent="space-between"
      alignItems="center"
    >
      {children}
    </HStack>
  );
};

export const Footer = ({ children }: Props) => {
  return (
    <HStack mx={4} alignItems="center" mb={3} mt={1}>
      {children}
    </HStack>
  );
};
