<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MailSubscriptionModel extends Model
{
    //

    protected $table = 'mail_subscribers';
    protected $fillable = ['first_name', 'last_name', 'email', 'subscription_type'];

    public $timestamps = true; 
}
