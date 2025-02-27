<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class Directory extends Controller
{
    //
    function show(){
        return view("admin.directory");
    }
}
