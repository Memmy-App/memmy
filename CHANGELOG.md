# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
_
## [Unreleased]

## [Version 1.1.4 (95)] - 2023-11-10T20:46:29Z

### Fixed

- A few authentication issues with 0.19
- Removing an account won't remove all accounts with the same name or same instance.

## [Version 1.1.4 (91)] - 2023-11-10T06:11:54Z

### Fixed

- Mark posts read (visibly) on scroll in compact

## [Version 1.1.3 (89)] - 2023-11-08T11:05:14Z

### Fixed

- Images on private instances not loading
- Some images being misaligned

## [Version 1.1.3 (88)] - 2023-11-07T19:52:24Z

### Fixed

- Native crash when rendering an SVG image in a feed

## [Version 1.1.2 (84)] - 2023-11-07T09:33:27Z

### Fixed

- Posts not being marked read on scroll
- Feed not refreshing when changing sort
- Improved pressability of ellipsis buttons (again)

## [Version 1.1.1 (81)] - 2023-11-06T09:55:51Z

### Added

- Added link to Lemmy-Status.org to check if there is an issue with your instance.
- Option to show full title in compact view

### Changes

- Migrate image viewer into an external library. Took the time to properly handle scaling up and downsizes, animations,
etc.
- Performance improvements for feeds

### Fixed

- Issues that allowed users to sign in with incorrect values for instance or username have been fixed.
- This should fix issues with images that don't properly load crashing the app.
- Images that are loaded in comments show an activity indicator
- Activity indicator for images in the feeds is animated properly
- Better login validation
- Fix issue where the wrong background color was displayed while opening the drawer or rotating the device
- False positive Lemmy links should now open (i.e. https://newsrepublic.com/post/1234 isn't a Lemmy post)
- Old change, but it seems that NSFW GIF/WebPs are now blurred properly
- Bold and image accessories will now position the cursor inside the stars if no text is selected. The current behavior
of placing the cursor at the end of the stars will happen if any text was selected.

## [Version 1.1.1 (79)] - 2023-11-05T02:21:26Z

### Added

- Opening notification takes you to the correct notification

## [Version 1.1 (78)] - 2023-11-03T10:23:59Z

### Added

- View saved posts
- Comment jump button

### Fixed

- Crash when trying to open an image that did not load (hopefully)
- Wrong font color used to display time when using `Display Total Score`
- Use correct image library for profile and community headers (should improve loading of these)
- Use the correct URL to share comments
- Post data will refresh when opening a post

### Added

- Share option added to swipe gestures
- JWTs are stored in secure storage (all current tokens will be migrated to your device's secure storage when you open the app)
- Downvotes will not be displayed when using an instance that does not allow them
- Added blocking options on comments and posts
- Mark posts on read when opening a link
- Option to disable user avatar animations (for GIF/WebP avatars)

## [Version 1.1 (76)] - 2023-11-02T11:50:50Z

### Added

- Push notifications are back. Will add more functionality to these in the coming days.

### Fixed

- Hit slop on swipeables (should not be hard to swipe to go back now)

## [Version 1.1 (74)] - 2023-11-01T11:10:21Z

### Changes

- Another performance boost. Swipeables have been reworked considerably in the background, resulting in better scroll
performance. Another update to markdown rendering should offer some additional improvements in the comments
section (as well as animations).
- Upgraded expo-image version to provide better and more performant rendering of WebP and other animated images
- Images now scale up from their original position and size. Performance of the scaling images should be optimal now.

### Fixed

- Crash when viewing privacy policy

## [Version 1.1 (72)] - 2023-11-01T10:36:28Z

## [Version 1.1 (69)] - 2023-10-31T00:35:16Z

### Fixed

- Opening posts from compact view now marks them as read (if enabled)
- Ignores depth whenever viewing particular comment chains (so images are not hidden, i.e. when viewing from inbox)
- Viewing a top level comment from inbox now takes you to the comment

### Added

- Informative error when unable to find a post (in case it was deleted)

## [Version 1.1 (68)] - 2023-10-30T06:19:50Z

### Changes

- Prefetch thumbnail images to reduce empty loading spaces

### Fixed

- Add subtitle to account switch context menu

## [Version 1.1 (63)] - 2023-10-28T09:59:45Z

### Fixed

- Hotfix to revert change that made keyboard accessory view not pressable
- Fix issue where profile could not be pressed

## [Version 1.1 (61)] - 2023-10-28T05:11:20Z

### Fixed

- Drawer not going to community
- The hitbox of an image is no longer 100% of the width of the screen
- Comment reply button replies to the correct comment
- Reply and post screens no longer flicker when scrolling due to increasing input field size

### Changes

- Prevent accidental pushes to the next screen when trying to use context menu (again...)

## [Version 1.0 (58)] - 2023-10-27T10:59:52Z

### Fixed

- Issue where user was unable to enable the display of username in the tab bar
- Issue where posts with one comment would say "1 Commen"

### Added

- Imgur image upload fallback
- Full width swipes
- Reply button in comments if you have them enabled

## [Version 1.0 (56)] - 2023-10-27T08:40:00Z

### Fixed

- Some images in comments not rendering correctly
- Stutter in new post screen when scrolling

### Added

- Upload pictures to instance
- Add uploading to keyboard accessory

## [Version 1.0 (55)] - 2023-10-27T01:11:18Z

### Fixed

- Adjusted color of subscribe and new post buttons
- Adjusted post and comment context menu hit slops
- Comment report options are now visible

### Added

- Options to display or hide avatars and community icons in the feeds and post screens.
- Block community options
- Community moderator list
- Community info screen
- Icons will now fill when needed
- Person blocking
- Screens listing community and user blocks with the ability to remove those blocks

### Internal

- Refactored names for more clarity

## [Version 1.0 (54)] - 2023-10-26T11:09:48Z

### Added

- All Lemmy links will *attempt* to go to their respective post/comment/community/user. This includes links that are
outside the user's instance. Linking to outside comments and posts is experimental however in testing the results did
produce any false negatives.
- OP and admin badges

### Changes

- Profile header is now less "jarring" when animating
- Community header is also now less jarring.
- Simplified onboarding screen

## [Version 1.0 (53)] - 2023-10-25T09:24:16Z

### Fixed

- Fixed typo in checking whether to show the community name in comments
- Fixed text formatting buttons not working.
- Fixed error not displaying whenever trying to post or vote on a community you are banned on.
- Save post button works

### Changes

- Toast added to both reply and post screen

### Added

- Added edit comments
- Added edit posts
- Option to show buttons instead of using swipe actions for comments
- Added option to save comment to context menu
- Go directly to user or community in search. More search changes to come.

## [Version 1.0 (46)] - 2023-10-23T11:20:39Z

### Fixed

- Fix comment sorting
- Issue where images could not be viewed
- Error when post has no comments

### Changes

- Improved feed performance
- Remove line from header of post
- Effectively handle loading a post with a specific comment ID
- Can supply a color token to toast
- Post share button provides you with the option to share the Lemmy post URL, post's link, or the post's image.
- Same options are now under the post ellipsis context menu
- Improved layout of username/instance in comments
- Added margin to the comment ellipsis button
- Improved pressability of context menu buttons
- Added image scaling from their original position. However, currently there is an open issue with Expo regarding 
a memory leak when resizing images with Reanimated. For now, going to keep the feature disabled as a PR has already been
submitted as a fix. This was significant enough in testing for iOS to terminate the app.
- Images for now move into the view from their original position.
- Improve showing additional comments

### Added

- Going to a post now only loads the comments of the parent ID. Press show all to see all comments.
- Post can be collapsed
- All Lemmy errors are now toastable
- Option to show or hide user instances in comments
- Added clamp to image viewer so that it cannot leave the screen.
- Pressing a comment in the profile comments list takes you to the comment
- Show username in compact (not a fan of how this looks, will play around with it later)

## [Version 1.0 (44)] - 2023-10-22T12:33:47Z

### Fixed

- Keyword filters

## [Version 1.0 (43)] - 2023-10-22T12:11:01Z

### Added

- Keyword and instance filtering for posts

### Fixed

- Post and comment timestamps properly rendered
- Blur NSFW option working

### Changed

- Loading screens now have an option for whether to display mouse animation (default normal spinner).
- Markdown quotes render better now

## [Version 1.0.42 (42)] - 2023-10-22T09:52:35Z

### Added

- Mark posts read on scroll
- Mark posts read on image view
- Mark posts read on vote
- Mark posts read on view
- Use show read posts from your Lemmy user settings. This changes based on your account.
- Use show NSFW content from Lemmy. Same as above, changes based on your account

### Fixed

- Crash when using hide swipe option (disabled for now while I figure out how to make that work)
- Inbox now takes you to the comment you press on. Still needs some tweaks for deeply nested comments.
