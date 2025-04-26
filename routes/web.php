<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\Dashboard;
use App\Http\Controllers\ProductCategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductFunctionalityController;
use App\Http\Controllers\ProductPricingController;
use App\Http\Controllers\OpportunityController;
use App\Http\Controllers\Event;
use App\Http\Controllers\App;
use App\Http\Controllers\Directory;
use App\Http\Controllers\FeedsController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\TagController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use App\Http\Controllers\SubscriberController;
use App\Http\Controllers\FeedsChannel;
use App\Http\Controllers\RssFeedController;
use App\Http\Controllers\Category;
use App\Http\Controllers\BrandLabelController;
use App\Http\Controllers\RegionController;
use App\Http\Controllers\ContinentController;
use App\Http\Controllers\CountryController;
use App\Http\Controllers\UserActivityController;
use App\Http\Controllers\CommentController;
use Mews\Purifier\Facades\Purifier;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;
use App\Http\Controllers\ToolShedController;
use App\Http\Controllers\RatingController;
use App\Http\Middleware\Role; 
use App\Http\Controllers\NewsFeedController;

Route::get('/clean', function() {
    Artisan::call('cache:clear');
    Artisan::call('view:clear');
    Artisan::call('route:clear');
    Artisan::call('config:cache');
    Artisan::call('storage:link');
    dd('CACHE-CLEARED, VIEW-CLEARED, ROUTE-CLEARED & CONFIG-CACHED SUCCESSFUL!');
});
Route::get('/', function () {
    return redirect()->intended(route('oppty', absolute: false));
});

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/
Route::post('/store-activity', [UserActivityController::class, 'store']);
Route::get('/comments/{post_id}', [CommentController::class, 'getComments']);
Route::get('/op/categories/{id}/{slug}', [CategoryController::class, 'initCategoriesPage']);
Route::get('/ts/categories/{id}/{slug}', [CategoryController::class, 'initProductCategoriesPage']);
Route::post('/comments/reply', [CommentController::class, "storeReply"]);
Route::get('/opportunities', [OpportunityController::class, 'initOpportunitiesPage'])->name('oppty');
Route::get('/toolshed', [ToolShedController::class, 'initToolShedPage'])->name('toolshed');
Route::get('/money-guide', [ToolShedController::class, 'initMoneyGuidePage'])->name('money_guide');

Route::get('/subscribe', fn() => Inertia::render('Subscribe'))->name('subscribe');
Route::get('/feedback', fn() => Inertia::render('Feedback'))->name('feedback');
Route::get('/advertise', fn() => Inertia::render('Advertise'))->name('advertise');
Route::get('/platforms', fn() => Inertia::render('Platforms'))->name('platforms');
Route::get('/about-us', fn() => Inertia::render('About'))->name('about');
Route::get('/terms', fn() => Inertia::render('Terms'))->name('terms');
Route::get('/privacy-policy', fn() => Inertia::render('Privacy'))->name('privacy');
Route::get('/help', fn() => Inertia::render('Help'))->name('help');
Route::get('/sponsorship', fn() => Inertia::render('Sponsorship'))->name('sponsorship');


Route::middleware(['auth'])->group(function(){
    Route::post('/add-comment', [CommentController::class, 'store']);
    Route::post('/ratings', [RatingController::class, 'store'])->name('rating.store');
});

Route::get('news', [NewsFeedController::class, 'index'])->name('news');
Route::get('news/{id}', [NewsFeedController::class, 'readNews'])->name('read.news');
Route::get('feed', [RssFeedController::class, 'index']);
Route::get('/opp-feeds', [App::class, 'getOppFeed']);
Route::get('/event-feeds', [App::class, 'getEventFeed']);
Route::get('/events', [App::class, 'displayEvents'])->name("events");
Route::get('/feeds', [FeedsController::class, 'fetchFeeds'])->name("find.feeds");
Route::get('/news-feed', [FeedsController::class, 'displayFeeds'])->name("daily.feeds");
Route::get('op/{id}/{title}', [OpportunityController::class, 'readOpportunity'])->name('read.blog');
Route::get('ts/{id}/{product_name}', [App::class, 'readProductData'])->name('read.product_blog');
Route::get('ev/{id}/{title}', [App::class, 'readEvent'])->name('read.ev');
Route::get('/search-opportunities', [App::class, 'searchOpportunities']);
Route::get('/search-toolshed', [App::class, 'searchToolshed']);
Route::get('/search-opportunities-categories/{id}', [App::class, 'searchCategories']);
Route::get('/search-events', [App::class, 'searchEvents']);
Route::get('/business-wiki', function(){return view('business-wiki');})->name("business-wiki");
Route::post('/bookmark-feed', [SubscriberController::class, 'bookmarkFeed']);
Route::post('/bookmark-opportunity', [OpportunityController::class, 'bookmarkOpportunity']);
Route::post('/bookmark-tools', [ToolShedController::class, 'bookmarkTools']);
Route::post('/bookmark-event', [Event::class, 'bookmarkEvent']);
Route::get('/podcast', function(){return Inertia::render('podcasts');})->name('podcast');


/**Login access control */
Route::get('/dashboard', [Dashboard::class, "accessControl"])
->middleware(['auth', 'verified'])->name('dashboard');

/**Public Routes */
Route::post('/upvote-post', [PostController::class, 'upvote']);
Route::get('/report/{id}',  [PostController::class, 'report']);
/**admin routes */
Route::middleware(['auth', Role::class . ':admin'])->group(function(){
    //generic routes
    Route::get('/admin-dashboard', [Dashboard::class, "accessControl"])->name('admin.dashboard');
    
    Route::get('/all-users', [Dashboard::class, "allUsers"])->name('admin.users');
    Route::get('/categories', [CategoryController::class, "categories"])->name('admin.categories');
    Route::get('/product-categories', [ProductCategoryController::class, "ProductCategory"])->name('admin.product_categories');
    Route::get('/product-functionality', [ProductFunctionalityController::class, "productFunctionality"])->name('admin.product_functionality');
    Route::get('/product-pricing', [ProductPricingController::class, "ProductPricing"])->name('admin.product_pricing');
    Route::get('/brand-labels', [BrandLabelController::class, "brandLabels"])->name('admin.brand-labels');
    Route::get('/tags', [TagController::class, "tags"])->name('admin.tags');
    //handle event
    Route::get('/admin-post-event', [Event::class, "show"])->name('admin.ev');
    Route::get('/admin-edit-event/{id}', [Event::class, "edit"])->name('admin.edit.ev');
    Route::post('/admin-update-event/{id}', [Event::class, "update"])->name('admin.update.ev');
    Route::post('/admin-store-event', [Event::class, "store"])->name('admin.store.ev');
    Route::get('/admin-delete-event/{id}', [Event::class, "delete"])->name('admin.delete.ev');
    //post categories
    Route::post('/admin-store-category', [CategoryController::class, 'store']);
    Route::get('/categories', [CategoryController::class, "categories"])->name('admin.categories');
    Route::get('/edit-category/{id}', [CategoryController::class, "editCategory"]);
    Route::post('/delete-category', [CategoryController::class, "deleteCategory"]);
    //product category
    Route::post('/admin-store-product-category', [ProductCategoryController::class, 'store']);
    Route::get('/edit-product-category/{id}', [ProductCategoryController::class, "editProductCategory"]);
    Route::post('/delete-product-category', [ProductCategoryController::class, "deleteProductCategory"]);
    //post functionality
    Route::post('/admin-store-product-functionality', [ProductFunctionalityController::class, 'store']);
    Route::get('/edit-product-functionality/{id}', [ProductFunctionalityController::class, "editProductFunctionality"]);
    Route::post('/delete-product-functionality', [ProductFunctionalityController::class, "deleteProductFunctionality"]);
    //post pricing
    Route::post('/admin-store-product-pricing', [ProductPricingController::class, 'store']);
    Route::get('/edit-product-pricing/{id}', [ProductPricingController::class, "editProductPricing"]);
    Route::post('/delete-product-pricing', [ProductPricingController::class, "deleteProductPricing"]);
    //post Tags
    Route::post('/admin-store-tag', [TagController::class, 'store']);
    Route::get('/tags', [TagController::class, "tags"])->name('admin.tag');
    Route::get('/edit-tag/{id}', [TagController::class, "editTag"]);
    Route::post('/delete-tag', [TagController::class, "deleteTag"]);
    //post Brand Label
    Route::post('/admin-store-label', [BrandLabelController::class, 'store']);
    Route::get('/label', [BrandLabelController::class, "label"])->name('admin.label');
    Route::get('/edit-label/{id}', [BrandLabelController::class, "editLabel"]);
    Route::post('/delete-label', [BrandLabelController::class, "deleteLabel"]);
    //post Brand Region
    Route::post('/admin-store-region', [RegionController::class, 'store']);
    Route::get('/regions', [RegionController::class, "regions"])->name('admin.regions');
    Route::get('/edit-region/{id}', [RegionController::class, "editRegion"]);
    Route::post('/delete-region', [RegionController::class, "deleteRegion"]);
    //post Brand Label
    Route::post('/admin-store-continent', [ContinentController::class, 'store']);
    Route::get('/continent', [ContinentController::class, "Continent"])->name('admin.continent');
    Route::get('/edit-continent/{id}', [ContinentController::class, "editContinent"]);
    Route::post('/delete-continent', [ContinentController::class, "deleteContinent"]);
    Route::post('/admin-store-country', [CountryController::class, 'store']);
    Route::get('/country', [CountryController::class, "country"])->name('admin.countries');
    Route::get('/edit-country/{id}', [CountryController::class, "editCountry"]);
    Route::post('/delete-country', [CountryController::class, "deleteCountry"]);
    //handle products 
    Route::get('/post-product', [ProductController::class, 'show'])->name('admin.products');
    Route::get('/all-products', [ProductController::class, 'showProducts'])->name('admin.all_products');
    Route::post('/admin-store-software-product', [ProductController::class, "store"]);
    // Route::get('/post-types', [Opportunity::class, 'CreatePostTypes'])->name('admin.post-types');
    Route::get('/all-opp-post', [OpportunityController::class, 'showOpportunities'])->name('admin.all_opp_post');
    Route::get('/fetch-all-opp', [OpportunityController::class, 'fetchAllOpportunities']);
    // Route::get('/post-types', [Opportunity::class, 'CreatePostTypes'])->name('admin.post-types');
    // Route::get('/post-types', [Opportunity::class, 'CreatePostTypes'])->name('admin.post-types');
    //handle channels
    Route::post('/admin-update-channel/{id}', [FeedsChannel::class, "store"])->name('admin.update.channel');
    Route::get('/admin-delete-channel/{id}', [FeedsChannel::class, "delete"])->name('admin.delete.channel');
    Route::get('/admin-edit-channel/{id}', [FeedsChannel::class, "edit"])->name('admin.edit.channel');
    Route::post('/admin-store-channel', [FeedsChannel::class, "store"])->name('admin.store.channel');
    //handle opportunities 
    Route::get('/admin-post-opportunity', [OpportunityController::class, "show"])->name('admin.opp');
    Route::get('/admin-post-feeds-category', [FeedsChannel::class, "showFeedsCategory"])->name('admin.feeds.category');
    /**modify posted opportunities */
    Route::get('/admin-edit-opportunity/{id}', [OpportunityController::class, "edit"]);
    Route::get('/admin-draft-opportunity/{id}', [OpportunityController::class, "draft"]);
    Route::get('/admin-publish-opportunity/{id}', [OpportunityController::class, "publish"]);
    Route::get('/admin-archive-opportunity/{id}', [OpportunityController::class, "archive"]);
    Route::post('/admin-store-opportunity', [OpportunityController::class, "store"]);
    Route::get('/admin-delete-opportunity/{id}', [OpportunityController::class, "delete"])->name('admin.delete.opp');
    //handle business directory
    Route::get('/admin-directory', [Directory::class, "show"])->name('admin.directory');
});

/**subscriber routes */
Route::middleware(['auth', 'verified', Role::class . ':subscriber'])->group(function(){
   
    Route::get('/subscriber-dashboard', [SubscriberController::class, 'index'])->name('subscriber.dashboard');
    
    Route::get('/bookmark', [SubscriberController::class, 'bookmark'])->name("subscriber.bookmarks");
    Route::get('/notifications', [SubscriberController::class, 'notifications'])->name("subscriber.notifications");
    Route::get('/notification-settings', [SubscriberController::class, 'notificationSettings'])->name("subscriber.notification_settings");

    Route::get('/fetch-opportunity-bookmark', [SubscriberController::class, 'listBookmarkedOpportunites'] );
    Route::get('/fetch-event-bookmark', [SubscriberController::class, 'listBookmarkedEvents']);
    Route::get('/fetch-bookmark', [SubscriberController::class, 'fetchAllBookmark']);
    Route::put('/remove-bookmark-feed', [SubscriberController::class, 'removeBookmark']);
    Route::get('/profile', [SubscriberController::class, 'initProfile'])->name('subscriber.profile');
    Route::post('/subscriber/update-profile', [SubscriberController::class, 'updateProfile'])->name('subscriber.update-profile');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';