import { InfoPage } from '@/components/info-page';
import { contactEmail, pageMetadata } from '@/lib/site';

export const metadata = pageMetadata(
  'Contact | Circuit',
  'Contact information and guidance for reporting compiler issues, sending feedback, and asking privacy questions about Circuit.',
  '/contact',
);

export default function Contact() {
  return (
    <InfoPage title="Contact Circuit">
      <p>
        Use this page for support, feedback, and privacy questions about
        Circuit.
      </p>
      <h2>Support and privacy contact</h2>
        <p>
          Email <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
        </p>
      <p>For setup and common errors, check the <a href="/docs#troubleshooting">troubleshooting documentation</a> first. To report an issue in a guide or example, include that page’s URL and the part you believe needs correction.</p>
      <h2>What to include in a bug report</h2>
      <p>
        When reporting an issue, include your browser and version, device type,
        the steps that caused the problem, and the exact compiler or terminal
        message. A short program that reproduces the issue is more useful than a
        full project. Remove personal information, secrets, and confidential
        code first.
      </p>
      <h2>Before reporting missing programs</h2>
      <p>
        Your library belongs to the browser profile and website address where it
        was saved. Check that you are using the same browser and profile. A
        library saved on localhost will not automatically appear on
        crunner.pages.dev; use an exported backup to transfer it. The operator
        cannot recover programs deleted from your device.
      </p>
      <p>
        For privacy questions, read the <a href="/privacy">Privacy Policy</a>.
        For service scope and limitations, see <a href="/about">About</a> and{' '}
        <a href="/terms">Terms of Use</a>.
      </p>
    </InfoPage>
  );
}
