# memmy - An iOS and Android client for Lemmy

An Apollo-inspired iOS and Android client for using [Lemmy](https://github.com/LemmyNet/lemmy), a federated link aggregator.

## Work in Progress
This is a work in progress and is not in a function state - yet. I intend to release builds on TestFlight starting in
the coming weeks. Once those are up, I will place information here about how to download.

## Building
If you wish to build on your own, you may do so. You will need to follow the instructions found
[here](https://docs.expo.dev/get-started/installation/) to install Expo first. Then, you can simply run the following
to create your own builds.

```shell
git clone https://github.com/gkasdorf/memmy.git
cd memmy

# IOS
eas build -p ios --profile preview --local --output memmy-build.ipa

# Android
eas build -p android --profile preview --local --output memmy-build.apk
```

Install the application through Xcode devices or however else you wish to install.

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