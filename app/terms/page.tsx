import { InfoPage } from '@/components/info-page';
import { pageMetadata } from '@/lib/site';

export const metadata = pageMetadata(
  'Terms of Use | Circuit',
  'Terms for using the Circuit online C compiler, including acceptable use, local backups, and service limitations.',
  '/terms',
);

export default function Terms() {
  return (
    <InfoPage title="Terms of Use">
      <p className="policy-date">Last updated: September 12, 2026</p>
      <p>
        These terms describe use of the Circuit website. By using the service,
        you agree to use it in accordance with these terms and applicable law.
      </p>
      <h2>Using the compiler</h2>
      <p>
        Circuit provides a free environment for writing and running small C
        programs in a compatible browser. Use it only for code and material you
        are entitled to use. Do not use it to infringe others' rights, interfere
        with the website, bypass its safeguards, or conduct unlawful activity.
      </p>
      <p>The workspace and learning materials are intended for education and development. Do not use the site to distribute malware, attack other systems, or deliberately disrupt other users or the hosting infrastructure.</p>
      <h2>Your code and backups</h2>
      <p>
        You retain your rights in the code you write. Running or saving a
        program does not publish it or transfer ownership to Circuit. You are
        responsible for checking code and its output and keeping copies of work
        you need. Local browser storage can be cleared, become unavailable, or
        be lost; Circuit does not provide remote recovery.
      </p>
      <h2>Availability and accuracy</h2>
      <p>
        The service is provided as available, without a promise of uninterrupted
        operation, compatibility with every C program, or error-free results.
        Browser and WASI restrictions, resource limits, and implementation
        differences can affect behavior. Independently test any code before
        relying on it in another system.
      </p>
      <p>
        To the extent permitted by applicable law, the service is provided
        without warranties and the operator is not responsible for loss caused
        by reliance on its output, service interruptions, or loss of locally
        stored work. Nothing in these terms excludes rights or liabilities that
        cannot lawfully be excluded.
      </p>
      <h2>Third-party components and links</h2>
      <p>Circuit’s branding and original written guides remain the property of their rights holders. You may use and adapt the C example snippets for your own learning and projects. That permission does not grant rights to impersonate Circuit or copy its branding. Third-party software remains subject to its own licenses.</p>
      <p>
        The compiler and interface use third-party software under its respective
        licenses. Third-party website links are provided for information; those
        websites have their own terms and policies. Circuit is not affiliated
        with or endorsed by those providers.
      </p>
      <h2>Changes and contact</h2>
      <p>
        The service and these terms may change as Circuit develops. Review this
        page for updates. See the <a href="/privacy">Privacy Policy</a> for data
        practices and the <a href="/contact">Contact page</a> for questions.
      </p>
    </InfoPage>
  );
}
