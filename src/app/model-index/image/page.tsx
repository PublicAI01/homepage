import { permanentRedirect } from 'next/navigation';

/**
 * The image track lives on the index page as a switch — one table, three
 * populations — rather than a page of its own. Its model pages keep this
 * path.
 */
export default function Page() {
  permanentRedirect('/model-index?track=image');
}
