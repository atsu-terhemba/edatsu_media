<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use App\Models\Category;
use App\Models\Region;
use App\Models\Continent;
use App\Models\Country;
use Inertia\Inertia;

class CategoryController extends Controller
{

    //edit category
    public function editCategory(Request $request, $id){
        $edits = Category::where('id', $id)->first();
        $categories = Category::all();
        return Inertia::render("Admin/ManageCategories", ['edit' => $edits, 'categories' => $categories]);
    }

    public function deleteCategory(Request $request)
    {
        // Access the 'id' from the request
        $id = $request->input('id');  // or $request->get('id')
        // Now you can use $id to find and delete the category
        $category = Category::find($id);
        if ($category) {
            $category->delete();  // Perform the delete operation
            return response()->json(["success" => true, "message" => "Post Deleted"]);
        } else {
            return response()->json(["success" => false, "message" => "Oops! something went wrong"]);
        }
    }

    //show category page
    public function categories(){
        $categories = Category::all();
        return Inertia::render("Admin/ManageCategories", ['deleted'=> true, 'categories' => $categories]);
    }

    //save or update category
    function store(Request $request){
        //validate the data...
        // Define custom validation rules
        $rules = [
        'name' => 'required|string|max:255',
        'description' => 'required|string',
        'slug' => 'required|string',
        ];

        // Validate the request
        $validator = Validator::make($request->all(), $rules);

        // Check if validation fails
        if ($validator->fails()) {
        // Get the first error message
        $firstError = $validator->errors()->first();

        // Return JSON response with the first validation error
        return response()->json([
        'success' => false,
        'message' => $firstError
        ], 422); // 422 Unprocessable Entity
        }

        $postId = $request->has('post_id') ? $request->post_id : null;
        $signature = $request->has('signature') ? $request->signature : null;
    
        // Verify the HMAC signature only if we're editing an existing category
        // if ($postId && !hash_equals($signature, hash_hmac('sha256', $postId, config('app.key')))) {
        //     return response()->json([
        //         'success' => false,
        //         'message' => 'Oops! Try again'
        //     ], 422);
        // }

        //check if user posted this article
        $db = ($postId)? Category::find($postId) : new Category();
        
        /**
         * check if request has file 
         */
        if ($request->hasFile('cover_img')) {
            if ($request->file('cover_img')->isValid()) {
                $file = $request->file('cover_img');
                $originalFileName = $file->getClientOriginalName();
                $fileExtension = $file->getClientOriginalExtension();
                // Generate a unique hash based on the original file name and current time
                $uniqueHash = hash('sha256', $originalFileName . time());

                // Combine the unique hash with the original file extension
                $hashedFileName = $uniqueHash . '.' . $fileExtension;

                // Store the file with the hashed name
                $file->storeAs('public/uploads/channels', $hashedFileName);

                // Save the hashed file name in the database
                $db->cover_img = $hashedFileName;
            }
        }
        
        //capture values 
        $name = $request->name;
        $slug  = $request->slug;
        $description = $request->description;

        //store the data in the data base
        $db->name = $name;
        $db->slug  = $slug;
        $db->description = $description;
        $db->save();

        if($postId){
            return response()->json(["success" => true, "message" => "Post Updated"]);
        }else{
            return response()->json(["success" => true, "message" => "Post Successful"]);
        }
    }


    /**
     * init category page 
     */
    public function initCategoriesPage($id)
    {

        $categories = Category::all();
        $regions = Region::all();
        $countries = Country::all();
        $continents = Continent::all();
    
        // Validate and sanitize the ID
        $validatedId = filter_var($id, FILTER_VALIDATE_INT);
        if ($validatedId) {
            // Fetch the category data safely using the validated ID
            $category_data = Category::where('id', $validatedId)->first();
        } else {
            // Handle invalid ID case, e.g., return a 404 or an error message
            abort(404, 'Category not found');
        }
        
        return view('categories', [
            "cat" => $category_data ?? null, // Ensure it's null if not found
            "categories" => $categories, 
            "regions" => $regions,
            "countries" => $countries,
            "continents" => $continents
        ]);

    }
    

    /**
     * product categories page
     */

         /**
     * init category page 
     */
    public function initProductCategoriesPage($id)
    {

        $categories = Category::all();
        $regions = Region::all();
        $countries = Country::all();
        $continents = Continent::all();
    
        // Validate and sanitize the ID
        $validatedId = filter_var($id, FILTER_VALIDATE_INT);
        if ($validatedId) {
            // Fetch the category data safely using the validated ID
            $category_data = Category::where('id', $validatedId)->first();
        } else {
            // Handle invalid ID case, e.g., return a 404 or an error message
            abort(404, 'Category not found');
        }
        
        return view('product-categories', [
            "cat" => $category_data ?? null, // Ensure it's null if not found
            "categories" => $categories, 
            "regions" => $regions,
            "countries" => $countries,
            "continents" => $continents
        ]);

    }

}
