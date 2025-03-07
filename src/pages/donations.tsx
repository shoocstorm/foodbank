import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { DonationsView } from '../sections/donation/view/donations-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Donations - ${CONFIG.appName}`}</title>
      </Helmet>

      <DonationsView />
    </>
  );
}
