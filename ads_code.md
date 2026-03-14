# Edatsu Media - AdSense Configuration

## Ad Units (Google AdSense)

**Publisher ID:** `ca-pub-7365396698208751`

### HORIZONTAL ADS (Slot: 7889919728)
- Format: auto, full-width responsive
- Best for: leaderboard positions, between sections, below content

### INFEED ADS (Slot: 7226228488)
- Format: fluid, layout-key: -h6+1+2-i+l
- Best for: between list items in feeds (not yet deployed - reserved for future use)

### SQUARE ADS (Slot: 1848837203)
- Format: auto, full-width responsive
- Best for: sidebars, in-content placements

---

## Current Ad Placements

All ads are hardcoded via the `AdUnit` component (`resources/js/Components/AdUnit.jsx`).
Each ad is wrapped in a professional container with a "Sponsored" label, rounded corners,
and subtle border to distinguish it from content.

### Home Page (`resources/js/Pages/Home.jsx`)

| # | Position | Ad Type | Location |
|---|----------|---------|----------|
| 1 | Between Hero & Features | Horizontal | After HomeBanner, before SuccessSection |
| 2 | After Features Section | Horizontal | Below SuccessSection, above SubFooter |

### Opportunities Page (`resources/js/Pages/Opportunities.jsx`)

| # | Position | Ad Type | Location |
|---|----------|---------|----------|
| 3 | Top of Results | Horizontal | Above the results card, main content area |
| 4 | Below Results | Horizontal | After pagination, bottom of main content |
| 5 | Sidebar (Desktop) | Square | Below Quick Links in the filter sidebar |

### Toolshed Page (`resources/js/Pages/Toolshed.jsx`)

| # | Position | Ad Type | Location |
|---|----------|---------|----------|
| 6 | Top of Results | Horizontal | Above the results card, main content area |
| 7 | Below Results | Horizontal | After pagination, bottom of main content |
| 8 | Sidebar (Desktop) | Square | Below Quick Links in the filter sidebar |

### Opportunity Detail Page (`resources/js/Pages/Opp-view.jsx`)

| # | Position | Ad Type | Location |
|---|----------|---------|----------|
| 9 | Mid-Article | Horizontal | Between article content and action buttons |
| 10 | Sidebar (Desktop) | Square | Above the Newsletter subscribe box |

### Tool Detail Page (`resources/js/Pages/Tool-view.jsx`)

| # | Position | Ad Type | Location |
|---|----------|---------|----------|
| 11 | Mid-Content | Horizontal | Between About section and Tags section |
| 12 | Sidebar (Desktop) | Square | Above Quick Info card in sidebar |

---

## Total: 12 Ad Placements across 5 pages

---

## Recommendations for Improvement

### High Priority
1. **Add Infeed Ads in Listing Pages** - Insert infeed ads (slot 7226228488) every 5-6 items
   in the Opportunities and Toolshed result grids. These blend naturally with content and have
   high CTR. Requires modifying `DisplayOpportunities.jsx` and `Toolshed.jsx` (display component).

2. **Add Anchor/Sticky Ad on Mobile** - Create a fixed bottom banner ad (320x50 or 320x100)
   that appears on mobile only. High visibility, standard mobile monetization pattern.
   Place it in `GuestLayout.jsx` with a dismiss button.

3. **Add Ad to Pricing/Subscription Page** - Users on the pricing page are engaged and
   considering purchases. A horizontal ad here can perform well.

### Medium Priority
4. **Add Ads to Dashboard (Authenticated Users)** - Free-tier users who are logged in
   spend significant time on dashboards. Add a horizontal ad to the authenticated dashboard.

5. **Add Ad Before SubFooter (Global)** - Place a horizontal ad in `GuestLayout.jsx` just
   above the SubFooter CTA section. This would appear on every guest page automatically.

6. **Lazy Load Ads Below the Fold** - For ads not visible on initial page load (mid-content,
   below pagination), use Intersection Observer to load them only when scrolled into view.
   Improves page speed and Core Web Vitals.

### Low Priority / Future
7. **A/B Test Ad Sizes** - Try `large-rectangle` (336x280) vs `square` (300x250) in sidebars
   to see which earns more. Larger ad units typically have better RPM.

8. **Create a Dedicated "Sponsored Content" Section** - On the home page, add a section
   that showcases sponsored tools or opportunities (native ads). These earn significantly
   more than display ads.

9. **Add Ads to 404/Error Pages** - Users who land on error pages still generate impressions.
   A simple horizontal ad on the 404 page can capture otherwise lost revenue.

10. **Monitor AdSense Reports** - After 2 weeks, check which placements have the best
    RPM and CTR. Remove underperforming placements (hurting UX for no revenue) and
    double down on high performers.

### Policy Reminders
- Maximum 3 AdSense ad units per page view is no longer enforced, but avoid excessive ads
  that hurt user experience - Google's auto-ads policy penalizes poor ad density ratios
- Ensure ads don't cover or overlap interactive elements on mobile
- Never place ads where they might receive accidental clicks (near buttons, navigation)
- Ads must be clearly distinguishable from site content (the "Sponsored" label handles this)

---

## Raw Ad Codes (Reference)

### HORIZONTAL ADS
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7365396698208751"
     crossorigin="anonymous"></script>
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-7365396698208751"
     data-ad-slot="7889919728"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
```

### INFEED ADS
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7365396698208751"
     crossorigin="anonymous"></script>
<ins class="adsbygoogle"
     style="display:block"
     data-ad-format="fluid"
     data-ad-layout-key="-h6+1+2-i+l"
     data-ad-client="ca-pub-7365396698208751"
     data-ad-slot="7226228488"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
```

### SQUARE ADS
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7365396698208751"
     crossorigin="anonymous"></script>
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-7365396698208751"
     data-ad-slot="1848837203"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
```
