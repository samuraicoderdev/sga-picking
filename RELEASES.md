# NxWarehouse Release Management

This document explains how to manage releases and tags for the NxWarehouse SGA & Picking System.

## 📋 Overview

The project includes two main scripts for release management:

1. **`scripts/create-initial-tags.sh`** - Creates initial set of version tags (v1.0.0, v1.1.0, etc.)
2. **`scripts/create-release.sh`** - Interactive script for creating new releases

## 🚀 Quick Start

### Creating Initial Tags

To create the initial set of release tags:

```bash
# Make sure you're in the project root
cd /workspace

# Run the initial tags script
./scripts/create-initial-tags.sh

# Push all tags to GitHub
git push origin --tags
```

This will create:
- `v1.0.0` - Initial Release
- `v1.1.0` - Enhanced Mobile Features
- `v1.2.0` - CRM Integration
- `v1.3.0` - Advanced Analytics

### Creating a New Release

For future releases, use the interactive script:

```bash
./scripts/create-release.sh
```

The script will guide you through:
1. Selecting release type (Major, Minor, Patch, or Custom)
2. Generating a changelog
3. Creating an annotated tag
4. Pushing to GitHub (optional)

## 🏷️ Semantic Versioning

This project follows [Semantic Versioning](https://semver.org/):

- **MAJOR** version (X.0.0) - Breaking changes
- **MINOR** version (1.X.0) - New features, backward compatible
- **PATCH** version (1.0.X) - Bug fixes, backward compatible

### Version Number Format

```
vMAJOR.MINOR.PATCH
Example: v1.2.3
```

## 📝 Tag Types

### Annotated Tags (Recommended)

All release tags are annotated tags, which include:
- Tagger name and email
- Date
- Tag message

```bash
# Create an annotated tag
git tag -a v1.0.0 -m "Release v1.0.0 - Description"
```

### Lightweight Tags

For internal use only:

```bash
git tag v1.0.0-beta
```

## 🔧 Manual Tag Operations

### View Existing Tags

```bash
# List all tags
git tag -l

# List tags sorted by date
git tag -l --sort=-creatordate

# Show tag details
git show v1.0.0
```

### Create a Tag Manually

```bash
# Annotated tag
git tag -a v1.0.0 -m "Release message"

# Lightweight tag
git tag v1.0.0-beta
```

### Delete a Tag

```bash
# Delete local tag
git tag -d v1.0.0

# Delete remote tag
git push origin :refs/tags/v1.0.0
```

### Push Tags

```bash
# Push specific tag
git push origin v1.0.0

# Push all tags
git push origin --tags
```

### Checkout a Tag

```bash
# Checkout a specific version
git checkout v1.0.0
```

## 📄 GitHub Releases

### Creating a Release on GitHub

1. Go to your repository on GitHub
2. Navigate to **Releases** → **Draft a new release**
3. Select or create a tag
4. Add release title and description
5. Attach binaries if needed
6. Click **Publish release**

### Using the Changelog

The `create-release.sh` script automatically generates a changelog file:

```
CHANGELOG_v1.0.0.md
```

Copy the content from this file to your GitHub release notes.

### GitHub Release Template

```markdown
## 🎉 What's New

[Brief description of the release]

## ✨ New Features

- Feature 1
- Feature 2

## 🐛 Bug Fixes

- Fix 1
- Fix 2

## 📱 Mobile Support

- Mobile improvement 1
- Mobile improvement 2

## 📦 Installation

```bash
npm install
# or
bun install
```

## 📚 Documentation

See README.md for complete documentation.

## 🔗 Links

- [Documentation](link)
- [Issue Tracker](link)
```

## 🔄 Release Workflow

### Standard Release Process

1. **Prepare Release**
   ```bash
   # Update version in package.json
   npm version patch  # or minor, or major
   
   # Commit changes
   git commit -am "chore: release v1.0.1"
   ```

2. **Create Tag**
   ```bash
   ./scripts/create-release.sh
   # Follow the prompts
   ```

3. **Push to GitHub**
   ```bash
   git push origin main
   git push origin v1.0.1
   ```

4. **Create GitHub Release**
   - Go to GitHub Releases page
   - Create release from tag
   - Add release notes from CHANGELOG file
   - Publish

5. **Post-Release**
   - Test deployment
   - Update documentation if needed
   - Notify stakeholders

## 📊 Release Schedule

### Planned Releases

| Version | Target Date | Focus Area |
|---------|-------------|------------|
| v1.0.0  | ✅ Released | Initial Release |
| v1.1.0  | ✅ Released | Mobile Enhancements |
| v1.2.0  | ✅ Released | CRM Integration |
| v1.3.0  | ✅ Released | Analytics |
| v2.0.0  | TBD | Major Architecture Update |

### Release Cadence

- **Patch releases**: As needed for bug fixes
- **Minor releases**: Monthly for new features
- **Major releases**: Quarterly for breaking changes

## 🔍 Troubleshooting

### Tag Already Exists

```bash
# Delete and recreate
git tag -d v1.0.0
git tag -a v1.0.0 -m "New message"
```

### Push Failed

```bash
# Check remote configuration
git remote -v

# Add remote if missing
git remote add origin https://github.com/username/repo.git

# Try pushing again
git push origin v1.0.0
```

### Wrong Tag Message

```bash
# Delete and recreate with correct message
git tag -d v1.0.0
git tag -a v1.0.0 -m "Correct message"
git push origin --force v1.0.0
```

## 📱 Mobile-Specific Releases

When releasing mobile-related updates, consider:

1. **PWA Updates**
   - Update service worker version
   - Test offline functionality
   - Verify manifest.json

2. **Scanner Compatibility**
   - Test with various devices
   - Verify camera permissions
   - Check hardware scanner integration

3. **App Store Considerations**
   - If wrapping as native app, update store listings
   - Update screenshots if UI changed
   - Test on iOS and Android

## 🤝 Contributing to Releases

### For Contributors

1. Use conventional commits:
   ```
   feat: add new picking mode
   fix: resolve scanning issue on iOS
   docs: update installation guide
   ```

2. Tag relevant issues in PR descriptions

3. Test on mobile devices before merge

### For Maintainers

1. Review changelog before release
2. Test critical paths on mobile
3. Verify all CI/CD pipelines pass
4. Create release notes
5. Communicate release to users

## 📞 Support

For questions about releases:
- Open an issue on GitHub
- Check existing documentation
- Contact the development team

---

*Last updated: 2024*
*NxWarehouse SGA & Picking System*
