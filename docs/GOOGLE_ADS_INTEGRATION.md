# Google Ads Integration Guide

## Overview
This system provides a complete solution for managing Google AdSense ads across your website with strategic placements and an admin panel for easy management.

## System Components

### 1. Database Tables
- **ad_settings** - Stores individual ad slot configurations
- **ad_global_settings** - Master on/off switch and global settings

### 2. Models
- **App\Models\AdSetting** - Manages individual ad slots
- **App\Models\AdGlobalSetting** - Manages global ad settings

### 3. Components
- **AdBanner.jsx** - Reusable ad component with placeholder support
- **Admin/AdManagement.jsx** - Admin panel for managing ads

### 4. Controller
- **App\Http\Controllers\Admin\AdManagementController** - Handles all ad management operations

## Admin Panel Usage

### Accessing Ad Management
Navigate to: `/admin/ads`

### Global Settings
1. **Master Toggle**: Turn all ads on/off across the entire site instantly
2. **Publisher ID**: Enter your Google AdSense publisher ID (ca-pub-XXXXXXXXXXXXXXXX)

### Managing Ad Slots
Each ad slot has:
- **Slot Name**: Unique identifier (e.g., `home_top_leaderboard`)
- **Page**: Which page(s) to display on (`home`, `toolshed`, `all`, etc.)
- **Position**: Where on the page (`top`, `sidebar`, `in-content`, etc.)
- **Size**: Ad dimensions (responsive, leaderboard, rectangle, etc.)
- **Ad Code**: Paste your Google AdSense code here
- **Status**: Active/Inactive toggle
- **Order**: Display priority

### Adding a New Ad Slot
1. Click "Add New Ad Slot"
2. Fill in the slot details
3. Leave "Ad Code" empty to show placeholder
4. Save

### Updating Ad Code
1. Get your AdSense code from Google
2. Edit the ad slot
3. Paste the code in "Ad Code" field
4. Save

## Using AdBanner Component in Pages

### Import
```jsx
import AdBanner from '@/Components/AdBanner';
```

### Basic Usage
```jsx
<AdBanner slot="home_top_leaderboard" size="large-leaderboard" />
```

### Props
- **slot** (required): Unique slot identifier matching database
- **size** (optional): Ad size preset (default: 'responsive')
- **className** (optional): Additional CSS classes
- **style** (optional): Inline styles

### Available Sizes
- `responsive` - Auto-adjusting (recommended)
- `leaderboard` - 728x90
- `large-leaderboard` - 970x90
- `medium-rectangle` - 300x250
- `large-rectangle` - 336x280
- `wide-skyscraper` - 160x600
- `half-page` - 300x600
- `mobile-banner` - 320x50
- `large-mobile-banner` - 320x100

## Strategic Ad Placements by Page

### Home Page (`/`)
**Implemented placements:**
- `home_top_leaderboard` - Below header (large-leaderboard)
- `home_middle_banner` - Between sections (responsive)
- `home_bottom_banner` - Before footer (medium-rectangle)

### Toolshed Page (`/toolshed`)
**Recommended placements:**
```jsx
{/* Add to imports */}
import AdBanner from '@/Components/AdBanner';

{/* Top of page - after header */}
<div className="container my-4">
    <AdBanner slot="toolshed_top" size="large-leaderboard" />
</div>

{/* Sidebar - if layout has sidebar */}
<aside>
    <AdBanner slot="toolshed_sidebar" size="wide-skyscraper" />
</aside>

{/* Between tool grid rows - every 6-8 items */}
<div className="my-4">
    <AdBanner slot="toolshed_in_content" size="responsive" />
</div>

{/* Bottom of page */}
<div className="container my-4">
    <AdBanner slot="toolshed_bottom" size="medium-rectangle" />
</div>
```

### Tool View Page (`/tool/{id}`)
**Recommended placements:**
```jsx
{/* Top */}
<AdBanner slot="tool_view_top" size="leaderboard" />

{/* Right sidebar */}
<AdBanner slot="tool_view_sidebar" size="medium-rectangle" />

{/* After description, before features */}
<AdBanner slot="tool_view_mid_content" size="responsive" />

{/* After reviews, before comments */}
<AdBanner slot="tool_view_after_reviews" size="large-rectangle" />

{/* Bottom */}
<AdBanner slot="tool_view_bottom" size="leaderboard" />
```

### Opportunities Page (`/opportunities`)
**Recommended placements:**
```jsx
{/* Top */}
<AdBanner slot="opportunities_top" size="large-leaderboard" />

{/* Between opportunity cards - every 5 items */}
<AdBanner slot="opportunities_feed" size="responsive" />

{/* Sidebar */}
<AdBanner slot="opportunities_sidebar" size="wide-skyscraper" />

{/* Bottom */}
<AdBanner slot="opportunities_bottom" size="medium-rectangle" />
```

### Opportunity View Page (`/opp/{id}`)
**Recommended placements:**
```jsx
{/* Top */}
<AdBanner slot="opp_view_top" size="leaderboard" />

{/* Sidebar */}
<AdBanner slot="opp_view_sidebar" size="half-page" />

{/* After content */}
<AdBanner slot="opp_view_bottom" size="responsive" />
```

### News Page (`/news`)
**Recommended placements:**
```jsx
{/* Top */}
<AdBanner slot="news_top" size="large-leaderboard" />

{/* Between articles */}
<AdBanner slot="news_feed" size="responsive" />

{/* Sidebar */}
<AdBanner slot="news_sidebar" size="wide-skyscraper" />
```

### Podcast Page (`/podcast`)
**Recommended placements:**
```jsx
{/* Top */}
<AdBanner slot="podcast_top" size="leaderboard" />

{/* Sidebar */}
<AdBanner slot="podcast_sidebar" size="medium-rectangle" />

{/* Between episodes */}
<AdBanner slot="podcast_feed" size="responsive" />
```

### About/Static Pages
**Recommended placements:**
```jsx
{/* Top */}
<AdBanner slot="static_top" size="leaderboard" />

{/* Sidebar */}
<AdBanner slot="static_sidebar" size="medium-rectangle" />

{/* Bottom */}
<AdBanner slot="static_bottom" size="leaderboard" />
```

## Best Practices

### Ad Placement Strategy
1. **Above the fold**: Place one high-value ad (leaderboard) at the top
2. **In-content**: Insert responsive ads between content sections
3. **Sidebar**: Use skyscrapers or rectangles for persistent visibility
4. **Between items**: Add ads every 5-8 list items for optimal balance
5. **Bottom**: End-of-content ads catch engaged users

### Mobile Optimization
- Use `responsive` size for mobile-friendly auto-adjustment
- Consider mobile-specific slots: `mobile-banner` (320x50)
- Avoid wide formats (leaderboards) on mobile

### Performance
- Lazy load ads below the fold
- Limit ads per page to 3-5 for user experience
- Test different placements with Google Analytics

### Compliance
- Follow Google AdSense policies
- Maintain proper spacing around ads
- Don't obscure content with ads
- Clearly distinguish ads from content

## Configuration Files

### Routes (`routes/web.php`)
Admin routes are protected with `auth` and `role:admin` middleware:
- GET `/admin/ads` - View ad management panel
- POST `/admin/ads` - Create new ad slot
- PUT `/admin/ads/{id}` - Update ad slot
- DELETE `/admin/ads/{id}` - Delete ad slot
- POST `/admin/ads/{id}/toggle` - Toggle ad active status
- POST `/admin/ads/toggle` - Toggle all ads on/off
- POST `/admin/ads/global-settings` - Update global settings

### Service Provider (`app/Providers/AppServiceProvider.php`)
Ad settings are automatically shared with all Inertia views via the `adSettings` prop.

## Quick Start for Adding Ads to a New Page

1. **Import the component:**
   ```jsx
   import AdBanner from '@/Components/AdBanner';
   ```

2. **Add placeholders where you want ads:**
   ```jsx
   <AdBanner slot="unique_slot_name" size="responsive" />
   ```

3. **In admin panel**, create matching ad slots with proper configuration

4. **Test**: Refresh the page - you'll see placeholders initially

5. **Add real ads**: Paste Google AdSense code in admin panel

6. **Enable**: Toggle the global switch to show real ads

## Troubleshooting

### Placeholders showing instead of ads
- Check global toggle is ON in admin panel
- Verify ad slot name matches exactly
- Confirm ad code is pasted correctly
- Check slot is marked as "Active"

### Ads not displaying
- Clear browser cache
- Check browser console for errors
- Verify Google AdSense account is approved
- Ensure ad code is valid

### Admin panel not accessible
- Verify you're logged in as admin
- Check role permissions
- Review route middleware

## Database Seeder (Optional)

Create pre-configured ad slots:

```php
// database/seeders/AdSettingsSeeder.php
DB::table('ad_settings')->insert([
    [
        'slot_name' => 'home_top_leaderboard',
        'page' => 'home',
        'position' => 'top',
        'size' => 'large-leaderboard',
        'is_active' => true,
        'order' => 1
    ],
    // Add more slots...
]);
```

## Future Enhancements

- A/B testing for ad placements
- Analytics integration
- Revenue reporting
- Auto-rotation of ad codes
- Geolocation-based ad targeting
- Time-based ad scheduling

---

**Documentation created:** October 11, 2025
**System version:** 1.0.0
