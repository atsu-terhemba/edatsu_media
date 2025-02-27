<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FeedsChannel as FeedsChannelDB;
use Validator;
use Storage;
use Illuminate\Support\Facades\Auth;


class FeedsChannel extends Controller
{

    /**show feeds */
    public function showFeedsCategory(){
        $all_channels = FeedsChannelDB::select('*')->where('is_deleted', 0)->get();
        return view("admin.feeds_channel", ['data' => $all_channels]);
    }
    
    
    function store(Request $request, $id = null){

        //validate the data 
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'country' => 'required|string|max:255',
            'region' => 'required|string|max:255',
            'channel_url' => 'required|url|max:255',
        ]);

        $fc = ($id)? FeedsChannelDB::find($id) :  new FeedsChannelDB();

        /**
         * check if request has file 
         */
        if($request->hasFile('channel_img')){
            if($request->file('channel_img')->isValid()){
                $file = $request->file('channel_img');
                $originalFileName = $file->getClientOriginalName();
                $file->storeAs('public/uploads/channels', $originalFileName);
                $fc->channel_image = $originalFileName;
            }
        }

        //capture values 
        $title = $request->title;
        $description = $request->description;
        $url = $request->channel_url;
        $country = $request->country;
        $region = $request->region;
        $user_id = Auth::user()->id;

        //store or update the data in the data base
        $fc->publisher_id = $user_id;
        $fc->channel_name = $title;
        $fc->channel_description = $description;
        $fc->region = $region;
        $fc->country = $country;
        $fc->channel_url = $url;

        $fc->save();

        return redirect('admin-post-feeds-category')->with('status', 'Post Successful!');
    }


    public function edit(Request $request, $id){
        $data = FeedsChannelDB::find($id);
        return view("admin.feeds_channel", ['edits' => $data]);
    }


    public function delete(Request $request, $id = null){
        FeedsChannelDB::where('id', $id)->update(['is_deleted' => 1]);
        return redirect('admin-post-feeds-category')->with('status', 'Deleted Successful!');
    }



    /**save uploaded file */
    function storeFiles($request, $fieldName, $allowedTypes = [])
    {
        if ($request->hasFile($fieldName)) {
            $files = is_array($request->file($fieldName)) ? $request->file($fieldName) : [$request->file($fieldName)];
            $fileNames = []; // Array to store the filenames
    
            foreach ($files as $file) {
                $hash = sha1(uniqid());
                $extension = $file->getClientOriginalExtension();
    
                // Check if the file type is allowed
                if (!empty($allowedTypes) && !in_array($extension, $allowedTypes)) {
                    throw ValidationException::withMessages([
                        'file' => 'Invalid file type. Allowed file types are: ' . implode(', ', $allowedTypes),
                    ]);
                }
    
                $filename = $hash . '_' . time() . '.' . $extension; // Initialize $filename variable correctly
    
                while (Storage::exists('public/uploads/' . $filename)) { // Add a forward slash before the filename
                    $hash = sha1(uniqid());
                    $filename = $hash . '_' . time() . '.' . $extension;
                }
    
                // Check if the file size is within the limit
                if ($file->getSize() > 5242880) { // 5 megabytes in bytes
                    throw ValidationException::withMessages([
                        'file' => 'File size exceeds the limit of 5 megabytes',
                    ]);
                }
    
                $path = $file->storeAs('public/uploads', $filename); // Store the file with the correct path
                $fileNames[] = $filename; // Add the filename to the array
            }
    
            $fileNames = array_unique($fileNames); // Remove duplicates from the array
            $path = implode(',', $fileNames); // Convert the array to a comma-separated string
    
            return $path;
        }
    
        return null;
    }














}
