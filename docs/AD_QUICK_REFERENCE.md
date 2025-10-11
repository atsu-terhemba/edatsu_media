# Quick Reference: Adding Ads to Any Page

## Step 1: Import Component
```jsx
import AdBanner from '@/Components/AdBanner';
```

## Step 2: Add Placement
```jsx
<AdBanner slot="unique_slot_name" size="responsive" />
```

## Step 3: Configure in Admin
1. Go to `/admin/ads`
2. Click "Add New Ad Slot"
3. Fill in details matching your placement
4. Save (leave Ad Code empty for placeholder)

## Common Slot Naming Pattern
```
{page}_{position}_{type}

Examples:
- home_top_leaderboard
- toolshed_sidebar_ad
- news_feed_banner
- tool_view_mid
```

## Quick Size Reference
```jsx
// Desktop Header/Footer
<AdBanner slot="page_top" size="large-leaderboard" />

// Sidebar
<AdBanner slot="page_sidebar" size="medium-rectangle" />

// Between Content
<AdBanner slot="page_content" size="responsive" />

// Mobile Friendly
<AdBanner slot="page_mobile" size="mobile-banner" />
```

## Admin Panel Quick Actions
- **Master Toggle**: Top right switch - turns ALL ads on/off
- **Add Slot**: Green button top right
- **Edit**: Pencil icon in actions column
- **Toggle Active**: Eye icon - enable/disable specific slot
- **Delete**: Trash icon - remove slot

## Troubleshooting One-Liner
**Placeholder showing?** → Check: Master toggle ON → Slot active → Ad code added → Slot name matches

---
Access admin panel: **`/admin/ads`**
