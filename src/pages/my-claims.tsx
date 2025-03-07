import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { DonationsView } from 'src/sections/donation/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`My Claims - ${CONFIG.appName}`}</title>
      </Helmet>

      <DonationsView />
    </>
  );
}
