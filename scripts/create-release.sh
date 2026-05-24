#!/bin/bash

# NxWarehouse - Release and Tag Management Script
# This script creates semantic version tags and prepares GitHub releases

set -e

echo "🏭 NxWarehouse - Release Management System"
echo "==========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored messages
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if git is initialized
if [ ! -d ".git" ]; then
    print_error "Git repository not found. Please initialize git first."
    exit 1
fi

# Check if remote is configured
if ! git remote get-url origin > /dev/null 2>&1; then
    print_warning "No remote 'origin' configured."
    print_info "Please add your GitHub remote:"
    echo "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
    echo ""
    read -p "Do you want to continue without pushing? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Get current version from package.json if exists
if [ -f "package.json" ]; then
    CURRENT_VERSION=$(grep -o '"version": "[^"]*"' package.json | cut -d'"' -f4)
    print_info "Current version in package.json: $CURRENT_VERSION"
else
    CURRENT_VERSION="1.0.0"
    print_warning "No package.json found. Starting with version 1.0.0"
fi

# Get latest tag
LATEST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "")
if [ -n "$LATEST_TAG" ]; then
    print_info "Latest tag: $LATEST_TAG"
else
    print_info "No existing tags found"
fi

echo ""
echo "Select release type:"
echo "  1) 🚀 Major (breaking changes) - v2.0.0"
echo "  2) ✨ Minor (new features) - v1.1.0"
echo "  3) 🐛 Patch (bug fixes) - v1.0.1"
echo "  4) 🏷️  Custom version"
echo "  5) 📋 Show existing tags"
echo "  6) ❌ Exit"
echo ""
read -p "Choose option (1-6): " choice

case $choice in
    1)
        # Major release
        if [ -n "$LATEST_TAG" ]; then
            MAJOR=$(echo $LATEST_TAG | cut -d'.' -f1 | tr -d 'v')
            NEW_VERSION="$((MAJOR + 1)).0.0"
        else
            NEW_VERSION="1.0.0"
        fi
        TAG_NAME="v$NEW_VERSION"
        ;;
    2)
        # Minor release
        if [ -n "$LATEST_TAG" ]; then
            MINOR=$(echo $LATEST_TAG | cut -d'.' -f2)
            PATCH=$(echo $LATEST_TAG | cut -d'.' -f3)
            NEW_VERSION="$(echo $LATEST_TAG | cut -d'.' -f1).$((MINOR + 1)).0"
        else
            NEW_VERSION="1.0.0"
        fi
        TAG_NAME="v$NEW_VERSION"
        ;;
    3)
        # Patch release
        if [ -n "$LATEST_TAG" ]; then
            PATCH=$(echo $LATEST_TAG | cut -d'.' -f3)
            NEW_VERSION="$(echo $LATEST_TAG | cut -d'.' -f1-2).$((PATCH + 1))"
        else
            NEW_VERSION="1.0.0"
        fi
        TAG_NAME="v$NEW_VERSION"
        ;;
    4)
        read -p "Enter custom version (e.g., 1.2.3): " CUSTOM_VERSION
        TAG_NAME="v$CUSTOM_VERSION"
        ;;
    5)
        print_info "Existing tags:"
        git tag -l --sort=-creatordate
        exit 0
        ;;
    6)
        print_info "Exiting..."
        exit 0
        ;;
    *)
        print_error "Invalid option"
        exit 1
        ;;
esac

echo ""
print_info "Creating tag: $TAG_NAME"

# Generate changelog for this release
echo ""
print_info "Generating changelog for $TAG_NAME..."

# Get commits since last tag
if [ -n "$LATEST_TAG" ]; then
    COMMITS=$(git log --oneline $LATEST_TAG..HEAD)
else
    COMMITS=$(git log --oneline)
fi

# Create changelog file
CHANGELOG_FILE="CHANGELOG_$TAG_NAME.md"

cat > $CHANGELOG_FILE << EOF
# Changelog - $TAG_NAME

## Release Information
- **Version**: $TAG_NAME
- **Date**: $(date +"%Y-%m-%d")
- **Project**: NxWarehouse - SGA & Picking System

## Changes in this Release

EOF

if [ -n "$COMMITS" ]; then
    echo "$COMMITS" | while read -r commit; do
        echo "- $commit" >> $CHANGELOG_FILE
    done
else
    echo "- Initial release" >> $CHANGELOG_FILE
fi

cat >> $CHANGELOG_FILE << EOF

## Features Included

### Warehouse Management (SGA)
- Dashboard with real-time metrics
- Inventory management with barcode support
- Multi-location warehouse support
- Stock tracking and alerts

### Picking System
- 4 picking modes: Single, Batch, Zone, Wave
- Mobile-optimized interface
- Camera-based barcode scanning
- Audio and visual feedback
- Offline-capable PWA

### Additional Modules
- CRM integration
- Reporting and analytics
- User management
- API endpoints

## Installation

\`\`\`bash
npm install
# or
bun install
\`\`\`

## Mobile Support

This release includes full mobile device support:
- Progressive Web App (PWA)
- Camera barcode scanning
- Hardware scanner compatibility
- Responsive design

## Documentation

See README.md for complete documentation.

---
*Generated automatically by NxWarehouse Release Script*
EOF

print_success "Changelog generated: $CHANGELOG_FILE"

echo ""
read -p "Do you want to create this tag? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_info "Tag creation cancelled"
    rm -f $CHANGELOG_FILE
    exit 0
fi

# Create annotated tag
git tag -a $TAG_NAME -m "Release $TAG_NAME - NxWarehouse SGA & Picking System"

print_success "Tag $TAG_NAME created successfully!"

echo ""
print_info "Tag details:"
git show $TAG_NAME --quiet

echo ""
read -p "Do you want to push the tag to GitHub? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if git remote get-url origin > /dev/null 2>&1; then
        print_info "Pushing tag to GitHub..."
        git push origin $TAG_NAME
        print_success "Tag pushed successfully!"
        
        echo ""
        print_info "GitHub Release URL:"
        REPO_URL=$(git remote get-url origin | sed 's/\.git$//' | sed 's/git@github.com:/https:\/\/github.com\//')
        echo "   $REPO_URL/releases/new?tag=$TAG_NAME"
        echo ""
        print_info "To create a GitHub release with notes:"
        echo "   1. Visit the URL above"
        echo "   2. Copy content from $CHANGELOG_FILE"
        echo "   3. Click 'Publish release'"
    else
        print_warning "No remote configured. Cannot push."
    fi
else
    print_info "Tag not pushed. To push later, run:"
    echo "   git push origin $TAG_NAME"
fi

echo ""
print_success "Release process completed!"
echo ""
echo "Next steps:"
echo "  1. Review $CHANGELOG_FILE"
echo "  2. Push tag: git push origin $TAG_NAME"
echo "  3. Create GitHub release at: https://github.com/YOUR_USERNAME/YOUR_REPO/releases"
echo "  4. Update package.json version if needed"
