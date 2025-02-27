<?php

namespace App\Http\Controllers;

use App\Models\ProductFunctionality;
use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\BrandLabel;
use App\Models\Region;
use App\Models\Continent;
use App\Models\ProductCategory;
use App\Models\Tag;
use App\Models\Country;
use App\Models\ProductPricing;
use App\Models\Bookmark;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;


class ToolShedController extends Controller
{
    //

    public function initToolShedPage(){
        $categories = ProductCategory::all();
        $regions = Region::all();
        $countries = Country::all();
        $continents = Continent::all();
        $tags = Tag::all();
        $brand_label = BrandLabel::all();
        $pricing = ProductPricing::all();
        $product_functionality  = ProductFunctionality::all();

        return view("toolshed", [
            "categories" => $categories, 
            "regions" => $regions,
            "countries" => $countries,
            "continents" => $continents, 
            "tags" => $tags,
            "brand_label" => $brand_label, 
            "pricing" => $pricing, 
            "product_functionality" => $product_functionality
        ]);
    }


        /***
     * bookmark tools
     */
    public function bookmarkTools(Request $request){
        if(Auth::check()){
            $opp_id = $request->post('id'); 
            $user_id = $request->user()->id;
            //validate entries 
            $validator = Validator::make($request->all(), [
                'id' => 'required|integer', 
                "type" => "required",
            ]);
            //handle validation errors
            if($validator->fails()){
                return response()->json(
                    ['status' => 'error', 'message'=> 'Oops! Something went wrong']
                );
            }
            //init bookmark
            $bookmark = new Bookmark;

            //check if post_id already exist in database. 
            if($bookmark->where('post_id', $opp_id)
            ->where('user_id', $user_id)
            ->where('post_type', '=', 'tool')
            ->exists()){
                //check if its removed, if removed, update deleted to 0 to add it back
                $is_deleted = $bookmark->where('post_id', $opp_id)
                ->where('user_id', $user_id)
                ->where('post_type', '=', 'tool')
                ->where('deleted', 1);

                if($is_deleted->count() > 0){
                    //update record
                    $restore_bookmark = $bookmark->where('post_id', $opp_id)
                    ->where('user_id', $user_id)
                    ->where('post_type', '=', 'tool')
                    ->update(['deleted' => 0]);

                    if($restore_bookmark > 0){
                        return response()->json(['status' => 'success', 'message' => "Bookmarked"]);
                    }
                }
                return response()->json(['status' => 'error', 'message'=> 'Already Bookmarked']);
            }

            //save data...
            $bookmark->user_id = $user_id;
            $bookmark->post_id = $opp_id;
            $bookmark->post_type = 'tool';
            $bookmark->save();
            
            return response()->json(['status' => 'success', 'message' => "Bookmarked"]);
        }else{
            return response()->json(['status' => 'warning', 'message' => "Login to Bookmark"]);
        }
     }






}
