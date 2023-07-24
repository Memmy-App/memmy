import React from "react";
import { Text, TextProps } from "react-native";
import { useAppSelector } from "@root/store";
import { selectCurrentTheme } from "@src/slices/settings/settingsSlice";
import { ThemeOptionsMap } from "@src/theme/themeOptions";
import { styled } from "../../styled";

const BaseText = styled(
  Text,
  {
    fontWeight: "$normal",
    fontFamily: "$body",
    fontStyle: "normal",
    letterSpacing: "$md",

    variants: {
      size: {
        "2xs": {
          fontSize: "$2xs",
          lineHeight: "$2xs",
        },
        xs: {
          fontSize: "$xs",
          lineHeight: "$sm",
        },

        sm: {
          fontSize: "$sm",
          lineHeight: "$sm",
        },

        md: {
          fontSize: "$md",
          lineHeight: "$md",
        },

        lg: {
          fontSize: "$lg",
          lineHeight: "$xl",
        },

        xl: {
          fontSize: "$xl",
          lineHeight: "$xl",
        },

        "2xl": {
          fontSize: "$2xl",
          lineHeight: "$2xl",
        },

        "3xl": {
          fontSize: "$3xl",
          lineHeight: "$3xl",
        },

        "4xl": {
          fontSize: "$4xl",
          lineHeight: "$4xl",
        },

        "5xl": {
          fontSize: "$5xl",
          lineHeight: "$6xl",
        },

        "6xl": {
          fontSize: "$6xl",
          lineHeight: "$7xl",
        },
      },
    },

    defaultProps: {
      size: "md",
    },
  },
  {},
  {
    propertyResolver: {
      color: (rawValue, resolver) => {
        if (rawValue.includes(":useDefaultText")) {
          const parts = rawValue.split("-");
          const theme = parts[1];
          const resolved = resolver(ThemeOptionsMap[theme].colors.textPrimary);
          return resolved;
        }
        return resolver(rawValue);
      },
    },
  }
);

export default function StyledText(
  props: React.ComponentProps<typeof BaseText>
) {
  const currentTheme = useAppSelector(selectCurrentTheme);

  const { children, ...rest } = props;
  return (
    <BaseText color={`:useDefaultText-${currentTheme}`} {...rest}>
      {children}
    </BaseText>
  );
}
