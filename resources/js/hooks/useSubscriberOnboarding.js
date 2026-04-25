import { useEffect } from 'react';
import axios from 'axios';
import introJs from 'intro.js';
import 'intro.js/minified/introjs.min.css';

/**
 * Subscriber intro tour. Fires once per account: when auth.user.onboarded_at
 * is null and the user role is 'subscriber'. Stamps onboarded_at on
 * complete or skip via /api/onboarding/complete so it never reappears.
 *
 * Steps target SideNav items via [data-tour-target=...] attributes that
 * SubscriberSideNav adds — kept on the sidebar instead of the page body
 * so the tour is portable across every subscriber page.
 *
 * Mobile: the SideNav is hidden on <md so the tour would have nothing
 * to point at. We bail early on narrow viewports — better than a broken
 * tour with arrows pointing at empty space.
 */
export default function useSubscriberOnboarding(authUser) {
    useEffect(() => {
        if (!authUser) return;
        if (authUser.role !== 'subscriber') return;
        if (authUser.onboarded_at) return;
        if (typeof window === 'undefined') return;
        if (window.matchMedia('(max-width: 767.98px)').matches) return;

        // Wait one tick so the SideNav has rendered before we query its
        // data-tour-target nodes. Without the rAF the steps' element
        // selectors return null and intro.js falls back to centered
        // tooltips with no highlight ring.
        let cancelled = false;
        const start = () => {
            if (cancelled) return;

            const prefsEl = document.querySelector('[data-tour-target="preferences"]');
            const feedsEl = document.querySelector('[data-tour-target="feeds"]');
            const upgradeEl = document.querySelector('[data-tour-target="upgrade"]');

            const tour = introJs.tour();
            tour.setOptions({
                showProgress: true,
                showBullets: false,
                exitOnOverlayClick: false,
                exitOnEsc: true,
                doneLabel: 'Got it',
                nextLabel: 'Next',
                prevLabel: 'Back',
                skipLabel: 'Skip',
                tooltipClass: 'edatsu-tour-tooltip',
                highlightClass: 'edatsu-tour-highlight',
                steps: [
                    {
                        intro: '<strong style="display:block;font-size:15px;margin-bottom:6px;">Welcome to Edatsu Media 👋</strong>'
                            + '<span style="font-size:13px;color:#52525b;line-height:1.5;">'
                            + 'Here are the three places to set yourself up. Takes about 30 seconds.'
                            + '</span>',
                    },
                    prefsEl && {
                        element: prefsEl,
                        intro: '<strong style="display:block;margin-bottom:4px;">1. Set your preferences</strong>'
                            + '<span style="font-size:13px;color:#52525b;line-height:1.5;">'
                            + 'Tell us the categories, countries, and brands you care about. Edatsu uses this to surface opportunities, articles, and tools that fit you — and powers your weekly Saturday digest.'
                            + '</span>',
                        position: 'right',
                    },
                    feedsEl && {
                        element: feedsEl,
                        intro: '<strong style="display:block;margin-bottom:4px;">2. Add your feeds</strong>'
                            + '<span style="font-size:13px;color:#52525b;line-height:1.5;">'
                            + 'Follow custom RSS sources and read them in our minimal reader. Free plan supports up to 5 feeds.'
                            + '</span>',
                        position: 'right',
                    },
                    upgradeEl && {
                        element: upgradeEl,
                        intro: '<strong style="display:block;margin-bottom:4px;">3. Go Pro when you’re ready</strong>'
                            + '<span style="font-size:13px;color:#52525b;line-height:1.5;">'
                            + 'Pro lifts every cap (saves, reminders, feeds), removes ads, adds bookmark-deadline push alerts, and lets you compare 5 tools at a time. Manage your plan from here.'
                            + '</span>',
                        position: 'right',
                    },
                ].filter(Boolean),
            });

            const finish = () => {
                axios.post('/api/onboarding/complete').catch(() => {
                    // Network blip — if it fails the tour might re-fire on
                    // next login. Annoying but not destructive; user can
                    // always skip again.
                });
            };

            tour.oncomplete(finish);
            tour.onexit(finish);
            tour.start();
        };

        const raf = window.requestAnimationFrame(() => start());
        return () => {
            cancelled = true;
            window.cancelAnimationFrame(raf);
        };
    }, [authUser?.id, authUser?.onboarded_at, authUser?.role]);
}
