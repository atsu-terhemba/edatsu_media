# Microsoft Flat Button Theme - Implementation Guide

## Overview
This guide explains how to implement the Microsoft flat design button theme across the entire Edatsu Media website. The theme provides consistent, modern, and accessible buttons that follow Microsoft's design principles.

## 1. CSS Classes Available

### Base Flat Button Classes
- `.btn-flat` - Base class for all flat buttons
- `.btn-flat-{variant}` - Color variants
- `.btn-flat-{size}` - Size variations

### Color Variants
- `.btn-flat-primary` - Blue primary button (#0078d4)
- `.btn-flat-secondary` - Light gray secondary button
- `.btn-flat-success` - Green success button (#107c10)
- `.btn-flat-danger` - Red danger button (#d13438)
- `.btn-flat-warning` - Yellow warning button (#ffb900)
- `.btn-flat-info` - Blue info button
- `.btn-flat-light` - White light button
- `.btn-flat-dark` - Dark gray/black button
- `.btn-flat-outline-primary` - Outlined blue button
- `.btn-flat-outline-secondary` - Outlined gray button

### Size Variations
- `.btn-flat-sm` - Small button
- Default size (no extra class)
- `.btn-flat-lg` - Large button

## 2. React Component Usage

### Import the Component
```jsx
import FlatButton from '@/Components/FlatButton';

// Or import specific variants
import { 
    PrimaryFlatButton, 
    SecondaryFlatButton, 
    DangerFlatButton 
} from '@/Components/FlatButton';
```

### Basic Usage Examples

#### As a regular button
```jsx
<FlatButton variant="primary" onClick={handleClick}>
    Click Me
</FlatButton>
```

#### As a navigation link
```jsx
<FlatButton href="/dashboard" variant="secondary">
    Go to Dashboard
</FlatButton>
```

#### With loading state
```jsx
<FlatButton variant="success" loading={isLoading}>
    Save Changes
</FlatButton>
```

#### With custom size
```jsx
<FlatButton variant="primary" size="lg">
    Large Button
</FlatButton>
```

#### Disabled state
```jsx
<FlatButton variant="danger" disabled>
    Delete Item
</FlatButton>
```

### Pre-configured Variants
```jsx
// Instead of <FlatButton variant="primary">
<PrimaryFlatButton onClick={handleSubmit}>
    Submit
</PrimaryFlatButton>

// Instead of <FlatButton variant="secondary">
<SecondaryFlatButton href="/cancel">
    Cancel
</SecondaryFlatButton>

// Instead of <FlatButton variant="danger">
<DangerFlatButton onClick={handleDelete}>
    Delete
</DangerFlatButton>
```

## 3. HTML/CSS Only Usage

For pages without React components, use the CSS classes directly:

```html
<!-- Primary button -->
<button class="btn-flat btn-flat-primary">
    Primary Action
</button>

<!-- Secondary link button -->
<a href="/page" class="btn-flat btn-flat-secondary">
    Secondary Action
</a>

<!-- Small success button -->
<button class="btn-flat btn-flat-success btn-flat-sm">
    Small Success
</button>

<!-- Large outline button -->
<button class="btn-flat btn-flat-outline-primary btn-flat-lg">
    Large Outline
</button>
```

## 4. Migration Strategy

### Step 1: Update Core Components
Replace existing button components one by one:

1. **Navigation buttons** - Header, footer, mobile nav
2. **Form buttons** - Submit, cancel, reset buttons
3. **Action buttons** - Delete, edit, save buttons
4. **Call-to-action buttons** - Sign up, learn more, etc.

### Step 2: Page-by-Page Updates
Update buttons in this order of priority:

1. **Homepage** - Most visible to users
2. **Authentication pages** - Login, register, password reset
3. **Dashboard pages** - Admin and user dashboards
4. **Product pages** - Opportunities, tools, etc.
5. **Profile pages** - User settings, preferences
6. **Secondary pages** - About, contact, etc.

### Step 3: Replace Bootstrap Button Classes
Find and replace these patterns:

```jsx
// Old Bootstrap patterns
className="btn btn-primary"          → className="btn-flat btn-flat-primary"
className="btn btn-secondary"        → className="btn-flat btn-flat-secondary"
className="btn btn-outline-primary"  → className="btn-flat btn-flat-outline-primary"
className="btn btn-sm"               → className="btn-flat btn-flat-sm"
className="btn btn-lg"               → className="btn-flat btn-flat-lg"
```

## 5. Dark Mode Support

The theme automatically supports dark mode:

```css
[data-bs-theme="dark"] .btn-flat-secondary,
.dark-mode .btn-flat-secondary {
    /* Dark mode styles automatically applied */
}
```

## 6. Accessibility Features

- **Focus states**: Clear focus indicators for keyboard navigation
- **Color contrast**: WCAG compliant color combinations
- **Screen readers**: Proper ARIA attributes supported
- **Disabled states**: Clear visual and functional disabled states

## 7. Best Practices

### Button Hierarchy
1. **Primary**: Use for main actions (Submit, Save, Continue)
2. **Secondary**: Use for secondary actions (Cancel, Back, Edit)
3. **Success**: Use for positive confirmations (Approve, Accept)
4. **Danger**: Use for destructive actions (Delete, Remove)
5. **Warning**: Use for caution actions (Warning confirmations)
6. **Outline**: Use for less prominent actions

### Sizing Guidelines
- **Small (sm)**: Use in tight spaces, secondary actions
- **Default**: Use for most buttons
- **Large (lg)**: Use for primary CTAs, hero sections

### Layout Considerations
```jsx
// Good: Consistent button alignment
<div className="d-flex gap-3 justify-content-end">
    <FlatButton variant="secondary">Cancel</FlatButton>
    <FlatButton variant="primary">Save</FlatButton>
</div>

// Good: Full-width buttons in mobile
<div className="d-grid gap-2">
    <FlatButton variant="primary">Sign Up</FlatButton>
    <FlatButton variant="outline-primary">Learn More</FlatButton>
</div>
```

## 8. Examples from Current Codebase

### Before (Current)
```jsx
<Link
    href="/opportunities"
    className="btn btn-dark text-white fw-bold px-4 py-2 text-decoration-none"
>
    Access Opportunities
</Link>
```

### After (Flat Theme)
```jsx
<FlatButton href="/opportunities" variant="primary">
    Access Opportunities
</FlatButton>
```

## 9. Component Props Reference

### FlatButton Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | string | 'primary' | Button color variant |
| size | string | '' | Button size (sm, lg) |
| disabled | boolean | false | Disable the button |
| loading | boolean | false | Show loading spinner |
| href | string | null | Render as Link if provided |
| type | string | 'button' | Button type attribute |
| onClick | function | undefined | Click handler |
| className | string | '' | Additional CSS classes |
| children | node | undefined | Button content |

## 10. Testing Checklist

After implementing the flat button theme:

- [ ] All buttons have consistent appearance
- [ ] Hover states work correctly
- [ ] Focus states are visible for accessibility
- [ ] Dark mode styling applies correctly
- [ ] Loading states display properly
- [ ] Disabled states prevent interaction
- [ ] Buttons work in all supported browsers
- [ ] Mobile responsiveness is maintained

## 11. Maintenance

The theme is defined in `resources/css/style.css` under the "MICROSOFT FLAT BUTTON THEME" section. Updates to colors, sizing, or behavior should be made there to affect all buttons site-wide.

The React component is located at `resources/js/Components/FlatButton.jsx` and can be extended with additional variants or functionality as needed.