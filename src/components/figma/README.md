# Figma Components

⚠️ **Status**: Demo/Testing Components

## Overview

This directory contains React components adapted from Figma designs. These components were created during the design system integration phase and are currently used primarily for:

1. **Demo purposes** - `/demo-figma` page for showcasing design implementations
2. **Design comparison** - Comparing Figma designs with actual implementation
3. **Historical reference** - Preserving the Figma integration workflow

## Components

- **FestivalCardFigma** - Card component for festival display (Figma adaptation)
- **ArtistCardFigma** - Artist/teacher card component (Figma adaptation)  
- **SearchFilterFigma** - Search and filter interface (Figma adaptation)

## Current Usage

These components are currently only used in:
- `/app/demo-figma/page.tsx` - Demo page for component showcase

## Cleanup Recommendation

🗑️ **Can be removed if:**
- Figma design integration is complete
- Main components (`/components/features/`) are preferred over Figma versions
- Demo page is no longer needed
- Design system is stable

## Cleanup Steps

To remove Figma components:
1. Remove `/app/demo-figma/` directory
2. Remove `/components/figma/` directory  
3. Remove corresponding component files in `/components/features/` with "Figma" suffix
4. Update navigation/routing if demo page is linked

## Integration Status

✅ **Completed**: Figma designs successfully adapted to React components  
✅ **Completed**: Design system integration  
🔄 **Optional**: Keep for reference or remove for cleanup