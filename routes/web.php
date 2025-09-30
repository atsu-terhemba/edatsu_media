<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\OpportunityController;
use App\Http\Controllers\ToolShedController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\Dashboard;
use App\Http\Controllers\NewsFeedController;
use App\Http\Controllers\SubscriberController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CountryController;
use App\Http\Controllers\ContinentController;
use App\Http\Controllers\RegionController;
use App\Http\Controllers\BrandLabelController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\FeedsController;
use App\Http\Controllers\UserActivityController;
use App\Http\Controllers\App;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\RatingController;
use App\Http\Controllers\Event;
use App\Http\Controllers\ProductCategoryController;
use App\Http\Controllers\ProductFunctionalityController;
use App\Http\Controllers\ProductPricingController;
use App\Http\Controllers\RssFeedController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\Directory;
use App\Http\Controllers\TrendingController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Home route
Route::get('/', [App::class, 'initHomePage'])->name('home');

// Public pages
Route::get('/opportunities', [OpportunityController::class, 'initOpportunitiesPage'])->name('opportunities');
Route::get('/toolshed', [ToolShedController::class, 'initToolShedPage'])->name('toolshed');
Route::get('/money-guide', [ToolShedController::class, 'initMoneyGuidePage'])->name('money_guide');
Route::get('/subscribe', [SubscriptionController::class, 'index'])->name('subscribe');
Route::get('/feedback', [App::class, 'initFeedbackPage'])->name('feedback');
Route::get('/advertise', [App::class, 'initAdvertisePage'])->name('advertise');
Route::get('/platforms', [App::class, 'initPlatformsPage'])->name('platforms');
Route::get('/about-us', [App::class, 'initAboutPage'])->name('about');
Route::get('/terms', fn()=> Inertia::render('Terms'))->name('terms');
Route::get('/privacy-policy', [App::class, 'initPrivacyPage'])->name('privacy');
Route::get('/help', fn()=>Inertia::render('Help'))->name('help');
Route::get('/sponsorship', [App::class, 'initSponsorshipPage'])->name('sponsorship');
Route::get('/subscription', [SubscriptionController::class, 'show'])->name('subscription');
Route::get('/pricing', fn() => Inertia::render('Subscription'))->name('pricing');

// Search endpoints
Route::get('/search-opportunities', [App::class, 'searchOpportunities']);
Route::get('/search-products', [ProductController::class, 'searchProducts']);

// API endpoints
Route::get('/api/latest-opportunities', [OpportunityController::class, 'getLatestOpportunities']);
Route::middleware('auth')->get('/api/subscriber/details', [SubscriberController::class, 'getSubscriberDetails'])->name('api.subscriber.details');

// Dynamic content routes - matching ziggy routes
Route::get('/op/{id}/{title}', [OpportunityController::class, 'readOpportunity'])->name('read.opportunity');
Route::get('/product/{id}/{product_name}', [ProductController::class, 'readProductData'])->name('read.product_blog');
Route::get('/ev/{id}/{title}', [Event::class, 'show'])->name('read.ev');

// News and Events
Route::get('/news', [NewsFeedController::class, 'index'])->name('news');
Route::get('/news/{id}', [NewsFeedController::class, 'show'])->name('read.news');
Route::get('/events', [Event::class, 'index'])->name('events');
Route::get('/feeds', [FeedsController::class, 'displayFeeds'])->name('find.feeds');
Route::get('/news-feed', [RssFeedController::class, 'index'])->name('daily.feeds');

// Additional pages
Route::get('/business-wiki', [App::class, 'initBusinessWikiPage'])->name('business-wiki');
Route::get('/podcast', [App::class, 'initPodcastPage'])->name('podcast');

// Ratings and Comments
Route::post('/ratings', [RatingController::class, 'store'])->name('rating.store');
Route::post('/process-subscription', [SubscriptionController::class, 'process'])->name('subscription.process');
Route::post('/product/{id}/rate', [RatingController::class, 'rateProduct'])->name('product.rate');
Route::post('/product/{id}/comment', [CommentController::class, 'store'])->name('product.comment');
Route::post('/comment/{id}/reply', [CommentController::class, 'reply'])->name('comment.reply');
Route::get('/product/{id}/comments', [CommentController::class, 'getComments'])->name('product.comments');
Route::get('/product/{id}/ratings', [RatingController::class, 'getRatings'])->name('product.ratings');

// User registration
Route::get('/admin-register', [RegisteredUserController::class, 'create_admin'])->name('admin-register');
Route::get('/sign-up', [RegisteredUserController::class, 'create_user'])->name('user-register');
Route::post('/sign-up', [RegisteredUserController::class, 'store_user'])->name('sign-up');

Route::middleware('auth')->group(function () {
    // Dashboard
    Route::get('/dashboard', [Dashboard::class, 'accessControl'])->name('dashboard');
    
    // Subscriber/User routes
    Route::get('/subscriber-dashboard', [SubscriberController::class, 'index'])->name('subscriber.dashboard');
    Route::get('/bookmark', [SubscriberController::class, 'bookmarks'])->name('subscriber.bookmarks');
    Route::get('/bookmarked-opportunities', [SubscriberController::class, 'bookmarkedOpportunities'])->name('subscriber.bookmarked_opportunities');
    Route::get('/bookmarked-tools', [SubscriberController::class, 'bookmarkedTools'])->name('subscriber.bookmarked_tools');
    Route::get('/notifications', [SubscriberController::class, 'notifications'])->name('subscriber.notifications');
    Route::get('/messages', [SubscriberController::class, 'messages'])->name('subscriber.messages');
    Route::get('/notification-settings', [SubscriberController::class, 'notificationSettings'])->name('subscriber.notification_settings');
    Route::get('/preferences', [SubscriberController::class, 'preferences'])->name('subscriber.preferences');
    Route::post('/subscriber/preferences', [SubscriberController::class, 'updatePreferences'])->name('subscriber.update_preferences');
    Route::post('/subscriber/update-profile', [SubscriberController::class, 'updateProfile'])->name('subscriber.update-profile');
    
    // Bookmarking
    Route::post('/bookmark', [App::class, 'bookmark']); // General bookmark endpoint
    Route::post('/bookmark-opps', [App::class, 'bookmark']);
    Route::post('/bookmark-tools', [App::class, 'bookmark']);
    
    // User activity tracking
    Route::post('/track-activity', [UserActivityController::class, 'store']);
    
    // Profile management
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Admin routes
Route::middleware(['auth', 'role:admin'])->group(function () {
    // Admin Dashboard...
    Route::get('/admin-dashboard', [Dashboard::class, 'accessControl'])->name('admin.dashboard');
    Route::get('/all-users', [Dashboard::class, 'allUsers'])->name('admin.users');
    
    // Product management
    Route::get('/post-product', [ProductController::class, 'show'])->name('admin.products');
    Route::get('/all-products', [ProductController::class, 'showProducts'])->name('admin.all_products');
    Route::get('/fetch-all-products', [ProductController::class, 'fetchAllProducts']);
    Route::get('/admin-edit-product/{id}', [ProductController::class, 'edit'])->name('admin.edit_product');
    Route::post('/admin-store-product', [ProductController::class, 'store']);
    Route::post('/admin-update-product/{id}', [ProductController::class, 'update']);
    Route::get('/admin-delete-product/{id}', [ProductController::class, 'destroy']);
    
    // Opportunity management
    Route::get('/admin-post-opportunity', [OpportunityController::class, 'show'])->name('admin.opp');
    Route::get('/all-opp-post', [OpportunityController::class, 'showOpportunities'])->name('admin.all_opp_post');
    Route::get('/fetch-all-opp', [OpportunityController::class, 'fetchAllOpportunities']);
    Route::get('/admin-edit-opportunity/{id}', [OpportunityController::class, 'edit']);
    Route::post('/admin-store-opportunity', [OpportunityController::class, 'store']);
    Route::post('/admin-update-opportunity/{id}', [OpportunityController::class, 'update']);
    Route::get('/admin-delete-opportunity/{id}', [OpportunityController::class, 'destroy'])->name('admin.delete.opp');
    Route::post('/publish/{id}', [OpportunityController::class, 'publish']);
    Route::post('/draft/{id}', [OpportunityController::class, 'draft']);
    Route::post('/archive/{id}', [OpportunityController::class, 'archive']);
    
    // Event management
    Route::get('/admin-post-event', [Event::class, 'show'])->name('admin.ev');
    Route::get('/admin-edit-event/{id}', [Event::class, 'edit'])->name('admin.edit.ev');
    Route::post('/admin-update-event/{id}', [Event::class, 'update'])->name('admin.update.ev');
    Route::post('/admin-store-event', [Event::class, 'store'])->name('admin.store.ev');
    Route::get('/admin-delete-event/{id}', [Event::class, 'destroy'])->name('admin.delete.ev');
    
    // Category management
    Route::get('/categories', [CategoryController::class, 'categories'])->name('admin.categories');
    Route::post('/admin-store-category', [CategoryController::class, 'store']);
    Route::get('/admin-edit-category/{id}', [CategoryController::class, 'editCategory']);
    Route::post('/admin-delete-category', [CategoryController::class, 'deleteCategory']);
    
    // Product Category management
    Route::get('/product-categories', [ProductCategoryController::class, 'ProductCategory'])->name('admin.product_categories');
    Route::post('/admin-store-product-category', [ProductCategoryController::class, 'store']);
    
    // Product Functionality management
    Route::get('/product-functionality', [ProductFunctionalityController::class, 'index'])->name('admin.product_functionality');
    Route::post('/admin-store-functionality', [ProductFunctionalityController::class, 'store']);
    
    // Product Pricing management
    Route::get('/product-pricing', [ProductPricingController::class, 'index'])->name('admin.product_pricing');
    Route::post('/admin-store-pricing', [ProductPricingController::class, 'store']);
    
    // Country management
    Route::get('/country', [CountryController::class, 'Country'])->name('admin.countries');
    Route::post('/admin-store-country', [CountryController::class, 'store']);
    Route::get('/admin-edit-country/{id}', [CountryController::class, 'editCountry']);
    Route::post('/admin-delete-country', [CountryController::class, 'deleteCountry']);
    
    // Continent management
    Route::get('/continent', [ContinentController::class, 'continent'])->name('admin.continent');
    Route::post('/admin-store-continent', [ContinentController::class, 'store']);
    Route::get('/admin-edit-continent/{id}', [ContinentController::class, 'editContinent']);
    Route::post('/admin-delete-continent', [ContinentController::class, 'deleteContinent']);
    
    // Region management
    Route::get('/regions', [RegionController::class, 'regions'])->name('admin.regions');
    Route::post('/admin-store-region', [RegionController::class, 'store']);
    Route::get('/admin-edit-region/{id}', [RegionController::class, 'editRegion']);
    Route::post('/admin-delete-region', [RegionController::class, 'deleteRegion']);
    
    // Brand Label management
    Route::get('/brand-labels', [BrandLabelController::class, 'brandLabels'])->name('admin.brand-labels');
    Route::get('/label', [BrandLabelController::class, 'show'])->name('admin.label');
    Route::post('/admin-store-label', [BrandLabelController::class, 'store']);
    Route::post('/admin-edit-label/{id}', [BrandLabelController::class, 'editLabel']);
    Route::post('/admin-delete-label', [BrandLabelController::class, 'deleteLabel']);
    
    // Tag management
    Route::get('/tags', [TagController::class, 'tags'])->name('admin.tag');
    Route::post('/admin-store-tag', [TagController::class, 'store']);
    Route::get('/admin-edit-tag/{id}', [TagController::class, 'editTag']);
    Route::post('/admin-delete-tag', [TagController::class, 'deleteTag']);
    
    // Feeds management
    Route::get('/admin-post-feeds-category', [FeedsController::class, 'adminShow'])->name('admin.feeds.category');
    Route::get('/admin-edit-channel/{id}', [FeedsController::class, 'edit'])->name('admin.edit.channel');
    Route::post('/admin-update-channel/{id}', [FeedsController::class, 'update'])->name('admin.update.channel');
    Route::post('/admin-store-channel', [FeedsController::class, 'store'])->name('admin.store.channel');
    Route::get('/admin-delete-channel/{id}', [FeedsController::class, 'destroy'])->name('admin.delete.channel');
    
    // Directory
    Route::get('/admin-directory', [Directory::class, 'show'])->name('admin.directory');
    
    // Additional delete routes for frontend compatibility
    Route::post('/delete-label', [BrandLabelController::class, 'deleteLabel']);
    Route::post('/delete-tag', [TagController::class, 'deleteTag']);
    Route::post('/delete-country', [CountryController::class, 'deleteCountry']);
    Route::post('/delete-region', [RegionController::class, 'deleteRegion']);
    Route::post('/delete-continent', [ContinentController::class, 'deleteContinent']);
    Route::post('/delete-category', [CategoryController::class, 'deleteCategory']);
    Route::post('/delete-product-category', [ProductCategoryController::class, 'deleteProductCategory']);
    
    // Additional POST routes for edit/update operations (frontend compatibility)
    Route::post('/edit-tag/{id}', [TagController::class, 'store']);
    Route::post('/edit-country/{id}', [CountryController::class, 'store']);
    Route::post('/edit-region/{id}', [RegionController::class, 'store']);
    Route::post('/edit-continent/{id}', [ContinentController::class, 'store']);
    Route::post('/edit-category/{id}', [CategoryController::class, 'store']);
    Route::post('/edit-product-category/{id}', [ProductCategoryController::class, 'store']);
    Route::post('/edit-brand-label/{id}', [BrandLabelController::class, 'store']);
});

// Post interactions (public)
Route::post('/upvote', [PostController::class, 'upvote'])->name('post.upvote');
Route::get('/report/{id}', [PostController::class, 'report'])->name('post.report');

// Trending endpoints (public for display)
Route::get('/api/trending/opportunities', [TrendingController::class, 'getTrendingOpportunities'])->name('trending.opportunities');
Route::get('/api/trending/products', [TrendingController::class, 'getTrendingProducts'])->name('trending.products');

// Admin-only trending management
Route::middleware(['auth'])->group(function () {
    Route::post('/api/trending/set-status', [TrendingController::class, 'setTrendingStatus'])->name('trending.set-status');
    Route::post('/api/trending/update', [TrendingController::class, 'updateTrendingStatus'])->name('trending.update');
});

require __DIR__.'/auth.php';