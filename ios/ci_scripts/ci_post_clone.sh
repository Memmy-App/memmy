#!/bin/sh

# Install CocoaPods and yarn using Homebrew.
brew install cocoapods
brew install yarn

# Install dependencies
yarn
pod install