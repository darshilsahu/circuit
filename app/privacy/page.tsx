import { InfoPage } from '@/components/info-page';
import { pageMetadata, siteUrl } from '@/lib/site';

export const metadata = pageMetadata(
  'Privacy Policy | Circuit',
  'How Circuit handles local programs, browser storage, hosting data, contact messages, and possible future advertising cookies.',
  '/privacy',
);

export default function Privacy() {
  return (
    <InfoPage title="Privacy Policy">
      <p className="policy-date">Last updated: September 19, 2026</p>
      <p>
        This policy describes the Circuit website at {new URL(siteUrl).hostname}. The
        site has no accounts. It includes Google's AdSense code for site
        verification and advertising setup, and uses Google
        Analytics 4 to measure visits and site usage. Google Analytics may use
        cookies and collect page URLs, referrers, and browser/device information.
        This integration does not send your C source code, terminal input, or
        program output as analytics events. See{' '}
        <a href="https://policies.google.com/technologies/partner-sites">
          how Google uses information from sites that use its services
        </a>.
      </p>
      <h2>Your code and program library</h2>
      <p>
        C source code is compiled and executed on your device in a browser Web
        Worker. The compiler does not upload your source, stdin, or output to a
        remote execution service. Saved programs and workspace information are
        kept in IndexedDB in your browser profile. Theme and terminal layout
        preferences use local storage. Terminal output is held in the current
        session.
      </p>
      <p>
        Programs remain locally until you delete them or the browser clears or
        evicts the data. Private browsing may remove data when the session
        closes. Programs do not automatically sync to another device. Exported
        backups and downloaded C files are saved wherever you choose on your
        device; imported backups are read locally.
      </p>
      <h2>Cookies and essential storage</h2>
      <p>
        The workspace can set a first-party <code>sidebar_state</code> cookie
        with a seven-day lifetime when you toggle the sidebar. Browser storage
        supports the program library and interface preferences. These features
        are not advertising profiles. You can manage cookies and site storage in
        your browser settings; clearing them may erase programs and preferences,
        so export a backup first.
      </p>
      <h2>Hosting and connection information</h2>
      <p>
        Cloudflare Pages delivers the site's static files, including compiler
        assets. Ordinary web requests can expose your IP address, browser
        information, requested URL, and request time to Cloudflare for delivery,
        security, and service operation. These requests do not contain your
        program source or terminal input. Hosting records are governed by
        Cloudflare's processing and retention practices; this site does not
        promise that visiting it produces no server logs.
      </p>
      <p>
        See{' '}
        <a href="https://www.cloudflare.com/privacypolicy/">
          Cloudflare's Privacy Policy
        </a>{' '}
        for its practices.
      </p>
      <h2>Contact information you choose to send</h2>
      <p>
        If you contact the operator through a published contact channel, your
        message, reply address, and any attachments may be used to respond and
        investigate the issue. Do not include passwords, personal records, or
        confidential source code. The Contact page provides the support email address.
      </p>
      <p>Messages are handled through the published Gmail inbox and its provider. Correspondence may be retained while responding to a request or keeping a necessary support record; there is no automatic deletion period implemented by this website. You can request access, correction, or deletion of information you have sent using the contact address. Applicable rights and any lawful retention obligations depend on the circumstances.</p>
      <p>Browser libraries are isolated by site origin. A different domain, browser profile, or device has separate data. “Try in Circuit” reads a bundled example locally and adds a new copy to your library; the example link contains its name, not your source.</p>
      <h2>Google AdSense and advertising</h2>
      <p>
        Circuit includes the Google AdSense script for site verification and
        advertising setup. Loading this script makes requests to Google that
        can include connection and browser information. Installing the script
        does not mean Google has approved the site to display ads.
      </p>
      <p>
        In an AdSense-enabled version, Google and other advertising vendors may
        use cookies or similar technologies to select and measure ads based on
        visits to this and other websites. Google's advertising cookies can
        allow Google and its partners to personalize ads across those visits.
        Other participating ad networks may use their own cookies under their
        policies.
      </p>
      <p>
        You can review personalized advertising choices at{' '}
        <a href="https://myadcenter.google.com/">Google My Ad Center</a> and
        participating vendors' choices at{' '}
        <a href="https://optout.aboutads.info/">YourAdChoices</a>. More
        information is available in{' '}
        <a href="https://policies.google.com/technologies/ads">
          Google's advertising technology policy
        </a>
        . These external settings do not indicate that Circuit currently serves
        ads.
      </p>
      <p>
        Before activating advertising, applicable consent notices and controls
        must be provided, including an appropriate Google-certified consent
        management platform where required. No advertising consent is inferred
        from merely using the compiler.
      </p>
      <h2>Your choices and questions</h2>
      <p>
        You control your local library through the program manager, backup
        tools, and browser site-data settings. The operator cannot retrieve or
        restore code stored only in your browser. For questions about this
        policy or information you have sent to the operator, use the details on
        the <a href="/contact">Contact page</a>. This policy may change as the
        website changes; the date above identifies the latest revision.
      </p>
    </InfoPage>
  );
}
