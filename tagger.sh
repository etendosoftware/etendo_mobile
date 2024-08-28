#!/bin/bash

# Function to update the version in Android
update_android_version() {
    local new_version=$1
    local gradle_file="android/app/build.gradle"
    
    sed -i.bak "s/versionName \".*\"/versionName \"$new_version\"/" "$gradle_file" && rm "${gradle_file}.bak"
    echo "Android version updated to $new_version in $gradle_file"
}

# Function to update the version in iOS
update_ios_version() {
    local new_version=$1
    local plist_file="ios/Etendo_Mobile/Info.plist"
    
    # Update CFBundleShortVersionString
    sed -i.bak "/<key>CFBundleShortVersionString<\/key>/,/<string>/ s/<string>.*<\/string>/<string>$new_version<\/string>/" "$plist_file"
    
    # Update CFBundleVersion
    sed -i.bak "/<key>CFBundleVersion<\/key>/,/<string>/ s/<string>.*<\/string>/<string>$new_version<\/string>/" "$plist_file"

    rm "${plist_file}.bak"
    echo "iOS version updated to $new_version in $plist_file"
}

# Check if a version argument was provided
if [ $# -eq 0 ]; then
    echo "Error: You must specify a version number as an argument"
    echo "Usage: $0 <version_number>"
    exit 1
fi

# Get the new version from the argument
new_version=$1

# Validate the version format (you can adjust this regex as needed)
if ! [[ $new_version =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "Error: Invalid version format. Please use the format X.Y.Z (e.g., 1.2.3)"
    exit 1
fi

# Update versions
update_android_version "$new_version"
update_ios_version "$new_version"
