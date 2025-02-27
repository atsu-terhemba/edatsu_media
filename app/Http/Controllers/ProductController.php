<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\BrandLabel;
use App\Models\Tag;
use App\Models\Region;
use App\Models\Continent;
use App\Models\Country;
use App\Models\ProductCategory;
use App\Models\ProductFunctionality;
use App\Models\ProductPricing;
use Illuminate\Support\Carbon;
use App\Models\Bookmark;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;
use App\Models\Product;

class ProductController extends Controller
{
    //

    public function show(Request $request){
            $categories = ProductCategory::all();
            $brand_label = BrandLabel::all();
            $tags = Tag::all();
            $regions = Region::all();
            $countries = Country::all();
            $continents = Continent::all();
            $functionality = ProductFunctionality::all();
            $product_pricing = ProductPricing::all();
    
            return view("admin.products", [
                "categories" => $categories, 
                "brand_label" => $brand_label,
                "tags" => $tags,
                "regions" => $regions,
                "countries" => $countries,
                "continents" => $continents,
                "functionality" => $functionality,
                "pricing" => $product_pricing
            ]);
    }


    
    function store(Request $request)
    {
        // Define custom validation rules
        $rules = [
            'product_name' => 'required|string|max:255',
            'product_description' => 'required|string',
            'source_url' => 'required|url|max:255',
            'regions' => 'nullable|string',
            'country' => 'nullable|string',
            'continent' => 'nullable|string',
            'category' => 'nullable|string',
            'meta_description' => 'nullable|string',
            'meta_keywords' => 'nullable|string',
            'post_type' => 'nullable|string',
            'cover_img' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'post_id' => 'nullable|integer|exists:opportunities,id',
            'signature' => 'required_with:post_id|string'
        ];

        // Validate the request
        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first()
            ], 422);
        }

        $postId = $request->input('post_id');
        $signature = $request->input('signature');
        $isEditing = false;

        // Verify the HMAC signature if post_id is provided
        if ($postId && !hash_equals($signature, hash_hmac('sha256', $postId, config('app.key')))) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid signature'
            ], 422);
        }

        $op = $postId ? Product::findOrFail($postId) : new Product();

        // Check user authorization for existing posts
        if ($postId && $op->u_id !== Auth::id()) {
            $isEditing = true;
            return response()->json(["success" => false, "message" => "Unauthorized Access"], 403);
        }

        // Handle file upload
        if ($request->hasFile('cover_img') && $request->file('cover_img')->isValid()) {
            $file = $request->file('cover_img');
            $hashedFileName = $this->generateUniqueFileName($file);
            $file->storeAs('public/uploads/channels', $hashedFileName);
            $op->cover_img = $hashedFileName;
        }

        // Populate model attributes
        $op->u_id = Auth::id();
        $op->user_role = Auth::user()->role;
        $op->slug = $this->createSlug($request->product_name);

        // Store the data in the database
        $op->u_id = $request->user()->id;
        $op->user_role = $request->user()->role;
        $op->product_name = $request->product_name;
        $op->product_description = $request->product_description;
        $op->source_url = $request->source_url;
        $op->meta_description = $request->meta_description;
        $op->meta_keywords = $request->meta_keywords;
        $op->post_type = $request->post_type;

        $op->save();

        // Get the ID of the newly created or updated post
        $postId = $op->id;

        // Helper function to delete and insert relational data
        $manageRelationalData = function ($table, $columnName, $data) use ($postId, $request) {
            // First, delete existing records for the post in this table
            DB::table($table)->where('post_id', $postId)->delete();

            // Insert new data
            if (empty($data)) return;

            // Decode JSON string and extract IDs
            $decodedData = json_decode($data, true);
            $insertData = [];
            foreach ($decodedData as $item) {
                if (isset($item['id']) && !empty($item['id'])) {
                    $insertData[] = [
                        'user_id' => $request->user()->id,
                        'post_id' => $postId,
                        $columnName => $item['id'], // Use 'id' from the new format
                        'post_type' => 'products',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            }
            if (!empty($insertData)) {
                DB::table($table)->insert($insertData);
            }
        };

        // Manage relational data for each attribute
        $relationalData = [
            'category_selections' => ['category_id', $request->input('category')],
            'brand_labels_selections' => ['brand_label_id', $request->input('brand_labels')],
            'tags_selections' => ['tag_id', $request->input('tags')],
            'region_selections' => ['region_id', $request->input('region')],
            'country_selections' => ['country_id', $request->input('country')],
            'continent_selections' => ['continent_id', $request->input('continent')],
            'product_func_selections' => ['product_func_id', $request->input('product-functionality')],
            'product_pricing_selections' => ['pricing_id', $request->input('product-pricing')],
        ];

        // Loop through each relational data table and update it
        foreach ($relationalData as $table => $data) {
            $manageRelationalData($table, $data[0], $data[1]);
        }

        if($isEditing){
            $post_message = "Post Updated Successful";
        }else{
            $post_message = "Post Successful";
        }
        return response()->json([
            "success" => true,
            "message" => $post_message,
        ]);
    }



    // Helper function to generate a unique file name
    private function generateUniqueFileName($file)
    {
        $originalFileName = $file->getClientOriginalName();
        $fileExtension = $file->getClientOriginalExtension();
        $uniqueHash = hash('sha256', $originalFileName . time());
        return $uniqueHash . '.' . $fileExtension;
    }

    function createSlug($title) {
        // Convert to lowercase
        $slug = strtolower($title);
        // Replace non-alphanumeric characters with hyphens
        $slug = preg_replace('/[^a-z0-9-]/', '-', $slug);
        // Remove consecutive hyphens
        $slug = preg_replace('/-+/', '-', $slug);
        // Trim hyphens from the beginning and end
        $slug = trim($slug, '-');
        return $slug;
    }

   


}
