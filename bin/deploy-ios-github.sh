# Make sure that all our packages are installed
yarn install

# Make sure that pods are installed
cd ios && pod install && cd ..

# Generate updated license
yarn generate-license
