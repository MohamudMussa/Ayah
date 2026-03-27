export const metadata = {
  title: 'Privacy Policy — Aayah',
  description: 'Privacy policy for Aayah, the Quran verse sharing app.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white/80 px-6 py-16 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
      <p className="text-white/40 text-sm mb-8">Last updated: March 27, 2026</p>

      <div className="space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">Overview</h2>
          <p>
            Aayah (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;the app&rdquo;) is a Quran verse
            sharing application available at aayah.one and on iOS. We are committed to
            protecting your privacy. This policy explains what data we collect and how we use it.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">No Personal Data Collection</h2>
          <p>
            We do not collect any personal information. There are no accounts, no sign-ups, no
            email addresses, no names, and no passwords. You can use Aayah completely anonymously.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">Anonymous Usage Statistics</h2>
          <p>
            We track two anonymous counters via Supabase: the total number of page views and the
            total number of shares. These are simple aggregate numbers — we cannot identify
            individual users from this data. No IP addresses, device IDs, or browser fingerprints
            are stored.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">Local Storage</h2>
          <p>
            Your preferences (selected reciter, translation, bookmarks) are stored locally on your
            device using browser localStorage. This data never leaves your device and is not
            transmitted to any server.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">Third-Party Services</h2>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>AlQuran Cloud API</strong> — provides Quran text, translations, and audio recitations</li>
            <li><strong>Quran.com API</strong> — provides tafsir (commentary) data</li>
            <li><strong>Unsplash</strong> — background scenery images (free license)</li>
            <li><strong>Google Fonts</strong> — Arabic and Latin typefaces</li>
            <li><strong>Supabase</strong> — anonymous aggregate view/share counters</li>
          </ul>
          <p className="mt-2">
            These services may have their own privacy policies. We encourage you to review them.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">No Advertising or Tracking</h2>
          <p>
            Aayah contains no advertisements, no analytics trackers, no cookies, and no tracking
            pixels. We do not sell or share any data with third parties.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">Children&apos;s Privacy</h2>
          <p>
            Aayah is suitable for all ages. We do not knowingly collect any information from
            children or any other users.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. Any changes will be reflected on
            this page with an updated date.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">Contact</h2>
          <p>
            If you have any questions about this privacy policy, please visit{' '}
            <a href="https://aayah.one" className="text-white/60 underline hover:text-white">
              aayah.one
            </a>.
          </p>
        </section>
      </div>
    </div>
  )
}
