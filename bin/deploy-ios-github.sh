# Add fastlane plugins
cd ios
gem install fastlane
fastlane add_plugin changelog
cd ..

# Make sure that pods are installed
cd ios && pod install && cd ..

# Configure the git environment
git config user.name "GitHub Actions Bot"
git config user.email "<>"

# Generate updated license
yarn generate-license
