# memmy - An iOS client for Lemmy
## TestFlight Builds
You can now download and run Memmy on your iOS device by using TestFlight. To join the beta group and start doom scrolling, [click here and join the group](https://testflight.apple.com/join/6jaRU6rD). Please submit feedback either by
- Screenshotting the issue you are having, then press the image. When you go to save it, you'll have an option to submit feedback. I'll receive the screenshot and your message.
- Opening an issue here on GitHub. There are also discussions where we can talk about idea or features you are thinking about.
- Message me on Lemmy or [on the Memmy community](https://lemmy.ml/c/memmy)
- [Chat on Discord](https://discord.gg/MbufFPhe2e)

## About

An Apollo-inspired iOS client for using [Lemmy](https://github.com/LemmyNet/lemmy), a federated link aggregator. Heavly influenced and inspired by Apollo for Reddit. Thanks [Christian](https://github.com/christianselig).

## Work in Progress
This is a work in progress and is not in a functional state - yet. I intend to release builds at least nightly on TestFlight, although I am going a bit fast right now (getting ready for the withdraw from no longer having Apollo!)

## Requirements

- [MacOS](https://www.apple.com/macos/)
- [node 16+ / npm 8+](https://nodejs.org/en/download) (Node.js, node package manager)
  - _we recommend using [nvm](https://github.com/nvm-sh/nvm) (node version manager)_
- [yarn 1](https://classic.yarnpkg.com/en/) (_classic_)

## Building
Building for iOS requires a Mac. To build, you will also need to make sure that you have the required dependencies installed. Generally, this is Ruby and Xcode. You'll also need yarn.

```shell
git clone https://github.com/memmy-app/memmy
cd memmy
yarn install

# EITHER
cd ios
pod install

#OR
npx pod install

yarn ios
```
A simulator should open with the app running. To change the device type or to deply to your physical device, run `yarn ios --device` and select the device you want to deploy to.

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

Some rules and guidelines:
* Don't make PRs that add entirely new features without discussing with us first (either ask in Discord or open an issue)
* We may not respond to your issue or PR (but that doesn't mean we don't look at it, we're really busy now!)
* We may close a PR without much feedback
* We can't guarantee that we can provide support for build issues
* Check for exisitng issues before filing a new one
* Open an issue and give us time to review it before opening a PR

### Themes
To contribute to themes, you can create a new theme object in `theme/theme.ts`. Once you create it with all the proper colors 
and extend it with `extendTheme()`, you must then add it to `EThemeOptions` and `ThemeOptionsMap` in `theme/themeOptions.ts`.
This will automatically add it to the theme selector in the settings page.

## Acknowledgements
Thanks to [Interstellar_1@lemmy.world](https://lemmy.world/u/Interstellar_1) for creating app graphics.

<a href="https://www.buymeacoffee.com/gavink" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>
