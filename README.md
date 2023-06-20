# memmy - An iOS and Android client for Lemmy
## TestFlight Builds
You can now download and run Memmy on your iOS device by using TestFlight. To join the beta group and start doom scrolling, [click here and join the group](https://testflight.apple.com/join/6jaRU6rD). Please submit feedback either by
- Screenshotting the issue you are having, then press the image. When you go to save it, you'll have an option to submit feedback. I'll receive the screenshot and your message.
- Opening an issue here on GitHub. There are also discussions where we can talk about idea or features you are thinking about.
- Message me on Lemmy or [on the Memmy community](https://lemmy.ml/c/memmy)
- [Chat on Discord](https://discord.gg/dSHDF9SJB)

## About

An Apollo-inspired iOS and Android client for using [Lemmy](https://github.com/LemmyNet/lemmy), a federated link aggregator. Heavly influenced and inspired by Apollo for Reddit. Thanks [Christian](https://github.com/christianselig).

## Work in Progress
This is a work in progress and is not in a functional state - yet. I intend to release builds at least nightly on TestFlight, although I am going a bit fast right now (getting ready for the withdraw from no longer having Apollo!)

## Building
If you wish to build on your own, you may do so. You will need to follow the instructions found
[here](https://docs.expo.dev/get-started/installation/) to install Expo first. Next, you will need to create an Expo
account at [https://expo.dev/](https://expo.dev).

Clone the repo to your computer and open app.json. You should remove the `eas` block from this file and save.

You are now ready to create a build. Run `yarn install` then run the build command the OS you are targeting.

```shell
yarn install

# IOS

# To run on an iOS simulator
eas build -p ios --profile simulator --local --output simulator.tar.gz
# OR #
yarn run buildSim

# To run a development build on-device
eas build -p ios --profile development --local --output dev.ipa
# OR #
yarn run buildDev

# To build for personal use without Expo development tools
eas build -p ios --profile preview --local --output preview.ipa
# OR #
yarn run buildPrev

# Android

# To run on an emulator or run on device
eas build -p android --profile development --local --output dev.apk
# OR #
yarn run buildDevAnd

# TO build for personal use without Expo development tools
eas build -p android --profile preview --local --output preview.aab
# OR #
yan run buildPrevAnd
```

Note: For iOS builds that you wish to deploy to a device, it seems that you do require an Apple developer account.

Lastly, to use a development build, start the Expo development server. There are two ways to do this depending on what
you are trying to test.

```shell
# For debugging and error reporting
npx expo start --dev-client
# OR #
yarn run startDev

# To use a development build but achieve a more production-like environment
npx expo start --no-dev --minify
# OR #
yarn run startNoDev
```

You now can connect to the development server via `localhost:8081` for the development server or `localhost:19000` for
the no-dev server.

## Info
This application uses Expo. The various pluses to using Expo/React Native are the following:

#### More opportunities for others to contribute
While there are certainly plenty of people who are adept at Swift,
there are already a few projects out there that are using Swift to create their iOS Lemmy applications. I'd like to
have a codebase where those who may not have a good grasp of native mobile app development to have a chance to contribute,
such as those who already have a good grasp of React.

#### Compatible with already existing libraries
Especially since Lemmy is an ongoing project that will certainly evolve over time, we can easily use the official
[lemmy-js-client](https://github.com/LemmyNet/lemmy-js-client) library to make our API calls. If changes to the API are
made, we can expect this library to be updated by Lemmy developers themselves. This also saves on production time for us.

## Contribution
You are more than welcome to contribute to the codebase on your own. Simply open up an issue or PR and we'll talk! You
can always add me on Discord if you want as well: gk#5175

The codebase is a bit wild right now and needs some refactoring. It was written quite quickly (as of right now in about
3 days) to get something off the ground quickly. I'll be going through and refactoring it in the coming days.

### Themes
Currently, I have thrown together a dark theme for the app given user preference. I will also work on a light theme to
complement that theme. If you are interested in working on themes, you can contribute as well! I will offer support for
multiple themes once we have a few different ones to pick from.

You can view `theme.js` for an example of a theme. Most of the items use one of the `screen` colors. Those are the base
colors for the whole app. I plan to actually name each of these items so that you can easily contribute to themes.

For information, you can view the [NativeBase docs](https://docs.nativebase.io/getting-started) for information about
how themes work. You are more than welcome to submit a PR that includes code modifications to make use of themes better.

## Acknowledgements
Thanks to [Interstellar_1@lemmy.world](https://lemmy.world/u/Interstellar_1) for creating app graphics.

<a href="https://www.buymeacoffee.com/gavink" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>
