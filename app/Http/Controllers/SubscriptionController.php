<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use \App\Models\MailSubscriptionModel;



class SubscriptionController extends Controller
{
    // Show the subscription/pricing page
    public function show()
    {
        return Inertia::render('Subscription');
    }

    // Handle the subscription request
    function mail_subscription(Request $request){
        //$request->all());
        
        // Custom validation with proper error messages
        $validator = \Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:mail_subscribers,email',
        ], [
            'first_name.required' => 'First name is required',
            'first_name.string' => 'First name must be a valid text',
            'first_name.max' => 'First name cannot exceed 255 characters',
            'last_name.required' => 'Last name is required',
            'last_name.string' => 'Last name must be a valid text',
            'last_name.max' => 'Last name cannot exceed 255 characters',
            'email.required' => 'Email address is required',
            'email.email' => 'Please enter a valid email address',
            'email.unique' => 'This email is already subscribed to our newsletter',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
                'first_error' => $validator->errors()->first()
            ], 422);
        }

        // Assuming you have a Subscriber model to handle subscriptions
        // if email already exists, return error
        if (MailSubscriptionModel::where('email', $request->email)->exists()) {
            return response()->json(
                [
                    'message' => 'Email already subscribed!',
                    'success' => false,
                ], 409);
        }

        MailSubscriptionModel::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
        ]);

        //whats wrong here...
        return response()->json(
            [
            'message' => 'Subscription successful!',
            'success' => true,
            ], 200);
    }

    // Process subscription payment
    public function process(Request $request)
    {
        // TODO: Implement subscription payment processing
        return response()->json([
            'success' => true,
            'message' => 'Subscription processing - to be implemented'
        ]);
    }
}
