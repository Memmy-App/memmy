# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
