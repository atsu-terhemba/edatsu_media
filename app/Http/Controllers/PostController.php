<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PostUpvote;
use Illuminate\Support\Carbon;


class PostController extends Controller
{
        //
    function upvote(Request $request){
            
        //    return response()->json(['data' => $request->input('post_id')]);
        //check if the user is authenticated 
        if(Auth::check()){
            //if the user is authenticated updated the database. 
            $posts = new PostUpvote;

            //send response message after update

        }else{
            //return message that this action requires authentication
        }
    }


    function report(Request $request, $id){
        //validate all input life form_id and media_type
        //capture user id 
        return view('report', ['post_id' => $id]);
    }

}
