# 🐭 Contributing to Memmy 

Contributions to Memmy are always welcome! Please read below on getting started and some general practices to follow.

## 📦 Download and Setup

After forking and cloning the repo, there are a few things you will need to do to get started. Depending on the environment
you are building for and the devices and/or simulators you want to use to test, the requirements may be slightly different.

### Ensure you have the necessary dependencies installed

You will need:
 - yarn - https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable
 - npx - https://www.npmjs.com/package/npx
 - Xcode 15.0+ (for iOS)
 - Xcode CLI tools (installed through Xcode)
 - A simulator configured for iOS (preferably iOS 16+)
 - Java SDK 17 (for Android)
 - Android Studio
 - Android SDK 33.0 (for more information, see https://reactnative.dev/docs/environment-setup)
 - Flipper (if you wish to monitor performance https://fbflipper.com/)
 - Reactotron (lighter weight option if you are only testing either network requests or global state https://github.com/infinitered/reactotron)

### Install project dependencies

Once you have downloaded the project, you will first need to install the project dependencies

```shell
cd memmy
yarn install

# If building for iOS
npx pod install
```

### Run on a simulator or device

iOS development will require that you are using a Mac and have the necessary dependencies from above installed. This
repo is, for simplicity, configured to be ran using Expo. If you are planning on doing your testing on an iOS simulator,
Expo will handle everything from installing cocoa pods, building, and deploying to the simulator for you. Simply run
the following to get started:

```shell
yarn ios
```

If you wish to build for a device, Expo will ask you to provide an Apple ID that has developer credentials. As such, it
will be easier for you to simply build the application using the react-native CLI. Doing so is also simple when using
npx

```shell
cd ios
npx react-native run-ios --device "<Name of Device>"
```

In both cases, there may be times that you need to clear the Metro cache (if you notice that some changes are not being
correctly reflected in the app - especially for things like theme changes - this is a good sign you need to clear it).
If this happens, you can simply run the following to clear it:

```shell
# Ensure that there is no Metro server (i.e. started from `yarn ios` or `react-native run-ios`) and run
yarn start --clear
```

You can also use `yarn start --clear` instead of `yarn ios` or `react-native run-ios` after you have compiled the app
the first time. As a rule of thumb, you should never need to recompile the app unless you either add a NPM package that
includes a new cocoa pod requirement or you add a new or modify and existing Expo module and its relevant native code.

Android development is similarly simple to get started with. However, it can be easy to have a misconfigured environment
that results in errors. These usually are a result of using a Java version other than 17 (`java --version`).

Regardless of whether you want to build for a device or a simulator, you can run `yarn android` to get started. As with
iOS, you can clear the cache using `yarn start --clear` and a simple `yarn start` to start the development server
without a rebuild.

## 🔥 Monitoring Performance

This app is configured to use [Flipper](https://fbflipper.com/), which allows you to access many of the comment React development tools including
flamegraph, network, and component trees. You can download Flipper from the link prior.

If you wish to only monitor outgoing API requests or global state subscriptions, this project is also configured to use
[Reactotron](https://github.com/infinitered/reactotron) in development builds. This is a much lighterweight alternative
to Flipper if you don't need all the features that Flipper has to offer.

Please note that performance can *not* be determined from development builds. While you can find suspicious re-renders or
time consuming ones with Flipper, you should remember that the render speeds you see in development are not reflective
of production builds. As such, the best way to test performance (especially when dealing with lists such as a feed or
comment list) are by deploying a production build to a device. More on this later.

Lastly, you can use Xcode or Android Studio to create builds for profiling through Xcode or Android Studio. In Xcode,
you can open the `ios` directory as a project, run Product -> Build For -> Profiling then Product -> Perform Action ->
Profile Without Building. You can then use Instruments to monitor memory usage.

Note that you should monitor Heap Allocations when profiling in Instruments. Anonymous VM allocations is determined by the
OS and is out of your control. Heap allocations are reflective of the performance of your code.

You can similarly view Android memory usage through Android Studio by building for profiling and using the built-in
profiler.

Lastly, note that the development client's memory/performance monitor is *not* reflective of production build numbers.
There are a *lot* of things going on in the background that increase the memory usage of these development builds. Again,
if you are concerned about memory usage, you should build and deploy to a physical device through either Xcode or
Android Studio.

### ‼️ Note

If you are adding significant changes to the UI - especially inside a list - it is highly recommended and of huge benefit
to everyone that you test the performance of your new code. Flipper is an indispensable tool that can help you as you
add your new features to ensure that you are not creating an issue. Frequent testing during implementation is extremely
helpful. Refactoring after the fact (as we know) is not fun.

## 🎨 Tamagui

This project uses [Tamagui](https://tamagui.dev/) for the vast majority of components. Tamagui offers well-integrated support for theming and
consistency throughout the app without having to manage poor-performing inline styles (although inline styles are indeed
encouraged!) or creating stylesheets outside the render function with `StyleSheet.create()`.

As noted, you are encouraged to use inline styling. If you have used TailwindCSS, this should be pretty similar. In
addition, Tamagui uses Babel to create constant variables when possible to replace inline variables to improve performance.

You should always try to use Tamagui elements. Whenever there are similarly named components such as `View` from both
Tamagui and react-native, prefer Tamagui. Whenever styling, prefer to use Tamagui's inline styles with tokens rather than
static numbers or colors. 

If you must use a non-Tamagui component (say an external library, and Animated.View, etc) then
you should *usually* create an inline `style={{}}` prop and use `useTheme()` from Tamagui to create your style. For
example:

```tsx
// Use the hook from Tamagui
const theme = useTheme();

// Example of when we might need to use an animated component
const animatedStyle = useAnimatedStyle();

return (
  <Animated.View style={[{backgroundColor: theme.bg.val, borderRadius: "$2"}, animatedStyle]}>
    <WhatWeAreAnimating />
  </Animated.View>
);
```

The `useTheme()` hook offers access to all the theme's tokens.

Additionally, when dealing with `<Text>` components, always use the Tamagui `Text` component. Font sizes should always
use font size tokens instead of static values. This will allow consistent font scaling throughout the app. A good rule
of thumb is:

- General text should use the `$3` token. This defaults to 16px but can be scaled by the user in Settings.
- Each token below or up from `$3` is a 2px difference. I.e. `$2` is 14px and `$4` is 18px assuming the user is using the
default font scale of 16px.
- Smaller text elements (for example a footer) should likely use `$2` whereas a page header might use `$5`.
- If you do not supply a font color to the `Text` component, it will use `$color` which is the default font color for
that theme. Secondary text should have its `color` prop set to `$secondary`.
- Remember to - in most cases - have your text wrapped in a `View`/`XStack`/`YStack` that has the `flex` component set
to `1` and with `numberOfLines` defined inside of the text component. This will prevent text from running off the screen

Lastly, buttons or icons should generally use the `$accent` token. Again, if you are dealing with a non-Tamagui component,
you should use `useTheme()` and assign the item a color of `theme.accent.val` in the item's style object or color prop.

For other questions about Tamagui, see https://tamagui.dev/docs/

## 🙏 Other Things to Consider

This section will be updated continually as I think of things to add here.

#### Strict Boolean Expressions

The linter will ask you to write strict boolean expressions. Please do so! There is a tradeoff between clean code and clear
code here, and when it comes to null checks, clear code is much preferable.

## 🔬 Before Submitting

Generally, it is probably best that you open an issue on GitHub to discuss the changes that you are submitting before
you start on them. While we usually won't turn away good ideas or needed help, we do want to make sure that the changes
you are implementing are not already being addressed and/or conflict with ongoing work or future plans. This is to your
benefit as much as ours, as your time could be better spent on something else if there is already work being done on
your feature/fix.

While there are not currently any tests written for Memmy, you should do your due diligence in making sure that the
feature or bug fix you are implementing does not create any new issues. This isn't always easy, so don't be afraid to
submit even if you are not sure. We are all learning as we go along, so don't worry if you make a mistake.

Please ensure that you lint your code before submitting a pull request. If you forget to do so, the PR's lint action will
fail. If this happens, please just lint your code and commit the changes.

You should not leave behind any `console.log()`s in the code. This is not simply to keep things clean but excessive
console logging can cause significant performance issues. The linter should catch all of your console logs during the lint.

## ✍️ Describe Your Change

Please clearly describe the issue you are fixing or the feature you are adding. Please make sure that you clearly
describe the changes that you're implementing as well. If there are multiple changes, try to break them down by piece
into separate PRs.

If you are adding additional third-party packages or adding native code (the former when new pods are involved or the
latter in all cases) please be sure to explicitly note that.

### ‼️ Changelog

Please be sure to properly document your changes in the CHANGELOG.md file. You should place your changes under
[Unreleased] under either ## Added, ## Fixed, ## Removed, or ## Changed. These will automatically be appended to the
release notes whenever the new version is built. You are free to (in fact encouraged to) add your name and/or GitHub
profile to the changes.

## 🎉 Thank You

Your work is appreciated and extremely helpful in continuing the active development of Memmy.
