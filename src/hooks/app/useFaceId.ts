import * as LocalAuthentication from "expo-local-authentication";
import { LocalAuthenticationResult } from "expo-local-authentication/src/LocalAuthentication.types";

const useFaceId = () => {
  const authenticateFaceId = async () => {
    const isCompatible = await LocalAuthentication.hasHardwareAsync();

    if (isCompatible) {
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (isEnrolled) {
        return LocalAuthentication.authenticateAsync();
      }
    }
    // no fallback available yet
    return Promise.resolve<LocalAuthenticationResult>({
      success: true,
    });
  };

  return {
    authenticateFaceId,
  };
};

export default useFaceId;
