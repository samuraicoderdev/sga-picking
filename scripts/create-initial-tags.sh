#!/bin/bash

# NxWarehouse - Create Initial Release Tags
# This script creates the initial set of release tags for the project

set -e

echo "🏭 NxWarehouse - Creating Initial Release Tags"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we have any tags
EXISTING_TAGS=$(git tag -l)
if [ -n "$EXISTING_TAGS" ]; then
    print_info "Existing tags found:"
    echo "$EXISTING_TAGS"
    echo ""
    read -p "Continue creating initial tags? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 0
    fi
fi

echo "Creating initial release tags..."
echo ""

# Create v1.0.0 - Initial Release
print_info "Creating v1.0.0 - Initial Release..."
if ! git rev-parse v1.0.0 >/dev/null 2>&1; then
    git tag -a v1.0.0 -m "$(cat << EOF
Release v1.0.0 - Initial Release

🎉 First stable release of NxWarehouse SGA & Picking System

## Features
- Complete Warehouse Management System (SGA)
- Dashboard with real-time metrics
- Inventory management with barcode support
- Multi-location warehouse support

## Picking System
- Single Order Picking
- Batch Picking
- Zone Picking
- Wave Picking

## Mobile Support
- Progressive Web App (PWA)
- Camera-based barcode scanning
- Hardware scanner compatibility (Bluetooth, USB, RFID)
- Responsive design for all screen sizes
- Audio and visual feedback

## Technology Stack
- Next.js 14+ with App Router
- TypeScript 5+
- TailwindCSS 3+
- HTML5-QRCode for scanning
- PWA capabilities

## Documentation
- Complete README.md
- API documentation
- Installation guides
- Mobile setup instructions

This release establishes the foundation for industrial warehouse management
with full mobile device support.
EOF
)"
    print_success "Tag v1.0.0 created"
else
    print_info "Tag v1.0.0 already exists"
fi

# Create v1.1.0 - Enhanced Mobile Features
print_info "Creating v1.1.0 - Enhanced Mobile Features..."
if ! git rev-parse v1.1.0 >/dev/null 2>&1; then
    git tag -a v1.1.0 -m "$(cat << EOF
Release v1.1.0 - Enhanced Mobile Features

📱 Major improvements to mobile experience

## New Features
- Improved camera scanning performance
- Offline mode enhancements
- Better hardware scanner integration
- Enhanced PWA installation flow

## Improvements
- Faster barcode recognition
- Reduced battery consumption
- Better error handling
- Improved audio feedback

## Bug Fixes
- Fixed scanning issues on iOS Safari
- Resolved connectivity problems with Bluetooth scanners
- Fixed layout issues on small screens

## Documentation
- Updated mobile setup guide
- Added troubleshooting section
- Hardware scanner compatibility list
EOF
)"
    print_success "Tag v1.1.0 created"
else
    print_info "Tag v1.1.0 already exists"
fi

# Create v1.2.0 - CRM Integration
print_info "Creating v1.2.0 - CRM Integration..."
if ! git rev-parse v1.2.0 >/dev/null 2>&1; then
    git tag -a v1.2.0 -m "$(cat << EOF
Release v1.2.0 - CRM Integration

🤝 Full CRM module integration

## New Features
- Customer Relationship Management module
- Client database management
- Order history tracking
- Customer-specific pricing

## Improvements
- Enhanced reporting capabilities
- Better data export options
- Improved search functionality
- Advanced filtering options

## API
- New CRM endpoints
- Customer management API
- Order tracking API
- Reporting API

## Security
- Enhanced authentication
- Role-based access control improvements
- Data encryption at rest
EOF
)"
    print_success "Tag v1.2.0 created"
else
    print_info "Tag v1.2.0 already exists"
fi

# Create v1.3.0 - Advanced Analytics
print_info "Creating v1.3.0 - Advanced Analytics..."
if ! git rev-parse v1.3.0 >/dev/null 2>&1; then
    git tag -a v1.3.0 -m "$(cat << EOF
Release v1.3.0 - Advanced Analytics

📊 Comprehensive analytics and reporting

## New Features
- Real-time analytics dashboard
- Custom report builder
- Predictive inventory analysis
- Performance metrics tracking

## Improvements
- Faster data processing
- Better visualization charts
- Export to multiple formats (PDF, Excel, CSV)
- Scheduled report generation

## Mobile
- Analytics on mobile devices
- Push notifications for alerts
- Quick actions from notifications

## Performance
- Optimized database queries
- Caching improvements
- Reduced load times
EOF
)"
    print_success "Tag v1.3.0 created"
else
    print_info "Tag v1.3.0 already exists"
fi

echo ""
print_success "All initial tags created successfully!"
echo ""
echo "Tags created:"
git tag -l --sort=-creatordate
echo ""
print_info "To push all tags to GitHub, run:"
echo "   git push origin --tags"
echo ""
print_info "Or push individual tags:"
echo "   git push origin v1.0.0"
echo "   git push origin v1.1.0"
echo "   git push origin v1.2.0"
echo "   git push origin v1.3.0"
