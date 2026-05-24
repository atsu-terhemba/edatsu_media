<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Collection;

/**
 * Sunday-morning personalized reading digest.
 *
 * Sections rendered:
 *   - "Your week" stats (reads/saves count + streak)
 *   - Top articles from feeds the user actually follows (last 7 days,
 *     ranked by their own engagement weight)
 *   - Platform Hot picks (cross-pollination — exposes the user to articles
 *     outside their immediate subscription bubble)
 *
 * The command guarantees we never queue this with both lists empty, so
 * the view can assume at least one section has content.
 */
class WeeklyReadingDigest extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public User $user,
        public Collection $personalArticles,
        public Collection $hotArticles,
        public array $stats,
        public string $unsubscribeUrl,
    ) {}

    public function envelope(): Envelope
    {
        $count = $this->personalArticles->count() + $this->hotArticles->count();
        $first = $this->personalArticles->first() ?? $this->hotArticles->first();
        $preview = $first['title'] ?? null;

        $subject = $preview
            ? mb_strimwidth($preview, 0, 64, '…') . ' + ' . ($count - 1) . ' more reads'
            : 'Your weekly reading digest';

        return new Envelope(subject: $subject);
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.weekly-reading-digest',
            with: [
                'user'             => $this->user,
                'personalArticles' => $this->personalArticles,
                'hotArticles'      => $this->hotArticles,
                'stats'            => $this->stats,
                'unsubscribeUrl'   => $this->unsubscribeUrl,
                'appUrl'           => config('app.url'),
            ],
        );
    }
}
