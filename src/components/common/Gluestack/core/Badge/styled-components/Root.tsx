// @ts-nocheck
import { View } from "react-native";
import { styled } from "../../styled";

export default styled(
  View,
  {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: "$sm",
    variants: {
      user: {
        admin: {
          bg: "$admin",
          _text: {
            color: "$adminText",
          },
          _icon: {
            color: "$adminText",
          },
        },
        mod: {
          bg: "$mod",
          _text: {
            color: "$modText",
          },
          _icon: {
            color: "$modText",
          },
        },
        op: {
          bg: "$op",
          _text: {
            color: "$opText",
          },
          _icon: {
            color: "$opText",
          },
        },
        dev: {
          bg: "$dev",
          _text: {
            color: "$devText",
          },
          _icon: {
            color: "$devText",
          },
        },
      },
      action: {
        error: {
          bg: "$error",
          borderColor: "$error",
          _icon: {
            color: "$errorText",
          },
          _text: {
            color: "$errorText",
          },
        },
        warn: {
          bg: "$warn",
          borderColor: "$warn",
          _icon: {
            color: "$warnText",
          },
          _text: {
            color: "$warnText",
          },
        },
        success: {
          bg: "$success",
          borderColor: "$success",
          _icon: {
            color: "$successText",
          },
          _text: {
            color: "$successText",
          },
        },
        info: {
          bg: "$info",
          borderColor: "$info",
          _icon: {
            color: "$infoText",
          },
          _text: {
            color: "$infoText",
          },
        },
      },

      variant: {
        solid: {},
        outline: {
          borderWidth: "$1",
        },
      },

      size: {
        sm: {
          px: "$1",
          _icon: {
            h: 12,
            w: 12,
          },
          _text: {
            fontSize: "$2xs",
            lineHeight: "$2xs",
          },
        },
        md: {
          px: "$1",
          _icon: {
            h: 14,
            w: 14,
          },
          _text: {
            fontSize: "$xs",
            lineHeight: "$xs",
          },
        },
        lg: {
          px: "$1",
          _icon: {
            h: 16,
            w: 16,
          },
          _text: {
            fontSize: "$sm",
            lineHeight: "$sm",
          },
        },
      },
    },

    ":disabled": {
      opacity: 0.5,
    },
    defaultProps: {
      variant: "solid",
      size: "md",
    },
  },
  {
    descendantStyle: ["_text", "_icon"],
  }
);
