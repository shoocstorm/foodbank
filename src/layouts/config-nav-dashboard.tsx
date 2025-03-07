import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';
import { useUsers, useDonations, auth } from 'src/hooks/use-firebase';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export function NavData() {
  const { users } = useUsers();
  const { donations } = useDonations();

  return [
    {
      title: 'Dashboard',
      path: '/',
      icon: icon('ic-analytics'),
    },

    {
      title: 'Donations',
      path: '/donations',
      icon: icon('ic-food'),
      info: (
        <Label color="error" variant="inverted">
          {donations?.filter(donation => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return donation.creationTime >= today.getTime();
          })?.length || ''}
        </Label>
      ),
    },
    {
      title: 'My Claims',
      path: '/my-claims',
      icon: icon('ic-handshake'),
      info: (
        <Label color="error" variant="inverted">
          {donations?.filter(donation => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return donation.claimedBy === auth.currentUser?.uid &&
              donation.creationTime >= today.getTime();
          })?.length || ''}
        </Label>
      ),
    },
    {
      title: 'My Donations',
      path: '/my-donations',
      icon: icon('ic-gift'),
      info: (
        <Label color="error" variant="inverted">
          {donations?.filter(donation => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return donation.createdBy === auth.currentUser?.uid &&
              donation.creationTime >= today.getTime();
          })?.length || ''}
        </Label>
      ),
    },
    {
      title: 'User',
      path: '/user',
      icon: icon('ic-user'),
      info: (
        <Label color="error" variant="inverted">
          {users?.length || ''}
        </Label>
      ),
    },
    {
      title: 'Q&A',
      path: '/blog',
      icon: icon('ic-blog'),
    },
  ];
}
