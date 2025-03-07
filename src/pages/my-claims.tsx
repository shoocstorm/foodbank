import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { DonationsView } from 'src/sections/donation/view';
import { MyClaimsView } from 'src/sections/donation/view/my-claims-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`My Claims - ${CONFIG.appName}`}</title>
      </Helmet>

      <MyClaimsView />
    </>
  );
}
