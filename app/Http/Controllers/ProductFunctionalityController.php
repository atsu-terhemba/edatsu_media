<?php

namespace App\Http\Controllers;

use App\Models\ProductFunctionality;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProductFunctionalityController extends Controller
{
    //

    
    public function editProductFunctionality(Request $request, $id){
        $edits = ProductFunctionality::where('id', $id)->first();
        $categories = ProductFunctionality::all();
        return view("admin.categories", ['edit' => $edits, 'categories' => $categories]);
    }

    public function deleteProductFunctionality(Request $request)
    {
        // Access the 'id' from the request
        $id = $request->input('id');  // or $request->get('id')
        // Now you can use $id to find and delete the category
        $category = ProductFunctionality::find($id);
        if ($category) {
            $category->delete();  // Perform the delete operation
            return response()->json(["success" => true, "message" => "Post Deleted"]);
        } else {
            return response()->json(["success" => false, "message" => "Oops! something went wrong"]);
        }
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
    
        // Verify the HMAC signature
        // Verify the HMAC signature only if we're editing an existing product functionality
        if ($postId && !hash_equals($signature, hash_hmac('sha256', $postId, config('app.key')))) {
            return response()->json([
                'success' => false,
                'message' => 'Oops! Try again'
            ], 422);
        }

        //check if user posted this article
        $db = ($postId)? ProductFunctionality::find($postId) : new ProductFunctionality();
        
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

    
    public function ProductFunctionality(){
        $functionalities = ProductFunctionality::all();
        return view("admin.product_functionality", ['deleted'=> true, 'product_functions' => $functionalities]);
    }
}
