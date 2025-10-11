# Image Upload Quick Reference Guide

## For Backend (PHP Controllers)

### Storing Images
```php
// For Products/Tools (NO third parameter!)
$file->storeAs('public/uploads/prod', $hashedFileName);

// For Opportunities (NO third parameter!)
$file->storeAs('public/uploads/opp', $hashedFileName);

// ⚠️ DO NOT DO THIS - It creates nested public directory:
$file->storeAs('public/uploads/prod', $hashedFileName, 'public'); // WRONG!
```

### Deleting Old Images
```php
// For Products/Tools (note the nested 'public')
if (file_exists(storage_path('app/public/public/uploads/prod/' . $filename))) {
    unlink(storage_path('app/public/public/uploads/prod/' . $filename));
}

// For Opportunities (note the nested 'public')
if (file_exists(storage_path('app/public/public/uploads/opp/' . $filename))) {
    unlink(storage_path('app/public/public/uploads/opp/' . $filename));
}
```

## For Frontend (React/JSX)

### Displaying Images
```jsx
// For Products/Tools (includes /public/ in path)
<img src={`/storage/public/uploads/prod/${product.cover_img}`} alt="Product" />

// For Opportunities (includes /public/ in path)
<img src={`/storage/public/uploads/opp/${opportunity.cover_img}`} alt="Opportunity" />
```

### With Error Handling
```jsx
<img 
    src={`/storage/public/uploads/prod/${product.cover_img}`}
    alt="Product"
    onError={(e) => {
        e.target.src = '/img/logo/main_2.png'; // Fallback image
    }}
/>
```

## Directory Structure (Current Setup)
```
project/
├── storage/
│   └── app/
│       ├── private/
│       └── public/
│           ├── public/      ← Nested 'public' directory (actual storage location)
│           │   └── uploads/
│           │       ├── prod/    ← Product/Tool images stored here
│           │       └── opp/     ← Opportunity images stored here
│           └── uploads/     ← Empty, not used
│
└── public/
    ├── storage/ → ../storage/app/public/  ← Symbolic link
    ├── img/
    └── build/
```

**How files are accessed:**
- File saved to: `storage/app/public/public/uploads/prod/image.jpg`
- Symlink creates: `public/storage/ → storage/app/public/`
- Browser accesses: `/storage/public/uploads/prod/image.jpg` ✅

## Important Rules

### ✅ DO THIS:
- Store with: `storeAs('public/uploads/prod', $filename)` (2 parameters only)
- Display with: `/storage/public/uploads/prod/${filename}`
- Delete from: `storage/app/public/public/uploads/prod/`
- Always provide fallback image
- Use consistent paths across backend and frontend

### ❌ DON'T DO THIS:
- Don't use 3 parameters: `storeAs('public/uploads/prod', $file, 'public')` ❌
- Don't forget the nested `public` in delete paths
- Don't mix up prod/opp directories
- Don't hardcode full server paths in frontend

## Why the Nested 'public' Directory?

When you call `storeAs('public/uploads/prod', $filename)` without specifying a disk:
1. Laravel uses the default disk (usually 'local')
2. The 'local' disk root is `storage/app/private`
3. BUT when the path starts with `'public/'`, Laravel saves to `storage/app/public/`
4. So the full path becomes: `storage/app/public/` + `public/uploads/prod/` = `storage/app/public/public/uploads/prod/`

This is why we have a nested `public` directory!

## Setup Commands

### Create Symbolic Link (Run once per environment)
```bash
php artisan storage:link
```

### Create Upload Directories (Already exist, but if needed)
```powershell
# PowerShell
New-Item -ItemType Directory -Path "storage/app/public/public/uploads/prod" -Force
New-Item -ItemType Directory -Path "storage/app/public/public/uploads/opp" -Force
```

## Testing
1. Upload a product image
2. Check file exists: `storage/app/public/public/uploads/prod/{filename}`
3. Access via URL: `http://localhost:8000/storage/public/uploads/prod/{filename}`
4. Verify image displays on product page

## Troubleshooting

### Images not showing?
1. Check path includes `/public/` in URL: `/storage/public/uploads/prod/`
2. Verify file exists in: `storage/app/public/public/uploads/prod/`
3. Check symbolic link: `ls -la public/storage` or `dir public\storage`
4. Clear browser cache

### 404 on images?
- Ensure URL includes: `/storage/public/uploads/{type}/`
- Verify file exists in correct nested directory
- Check .htaccess rules (Apache)
- Verify symlink is correct

### Wrong directory when uploading?
- Remove third parameter from `storeAs()`
- Use only 2 parameters: path and filename
- Laravel will handle the rest

## Quick Reference

| Action | Correct Code |
|--------|-------------|
| **Store Product Image** | `$file->storeAs('public/uploads/prod', $filename);` |
| **Store Opportunity Image** | `$file->storeAs('public/uploads/opp', $filename);` |
| **Delete Product Image** | `unlink(storage_path('app/public/public/uploads/prod/' . $filename));` |
| **Delete Opportunity Image** | `unlink(storage_path('app/public/public/uploads/opp/' . $filename));` |
| **Display Product Image** | `<img src="/storage/public/uploads/prod/${filename}" />` |
| **Display Opportunity Image** | `<img src="/storage/public/uploads/opp/${filename}" />` |
