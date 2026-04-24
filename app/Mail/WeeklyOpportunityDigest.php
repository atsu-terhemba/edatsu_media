<?php

namespace App\Mail;

use App\Models\AdSetting;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Collection;

/**
 * Saturday-morning opportunity digest. Renders up to 4 opportunities matched
 * against the user's preferences (categories AND countries AND regions AND
 * brands, per-array, empty arrays ignored) plus a single ad slot in the
 * footer. The command guarantees we never queue this with an empty
 * opportunity list, so the view assumes at least one.
 */
class WeeklyOpportunityDigest extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public User $user,
        public Collection $opportunities,
        public string $unsubscribeUrl,
        public ?AdSetting $ad = null
    ) {}

    public function envelope(): Envelope
    {
        $count = $this->opportunities->count();
        $preview = $this->opportunities->first()?->title;
        $subject = $preview
            ? "{$count} new opportunit" . ($count === 1 ? 'y' : 'ies') . " for you: " . mb_strimwidth($preview, 0, 60, '…')
            : 'Your weekly opportunity digest';

        return new Envelope(subject: $subject);
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.weekly-opportunity-digest',
            with: [
                'user' => $this->user,
                'opportunities' => $this->opportunities,
                'unsubscribeUrl' => $this->unsubscribeUrl,
                'ad' => $this->ad,
                'appUrl' => config('app.url'),
            ],
        );
    }
}
