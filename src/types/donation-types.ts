export enum DonationStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  CLAIMED = 'CLAIMED',
  PICKED_UP = 'PICKED-UP'
}

export type DonationItemProps = {
  id: string;
  title: string;
  address: string;
  contactPerson?: string;
  contactPhone?: string;
  creationTime: number;
  createdBy?: string,
  weight: number;
  status: DonationStatus;
  photo: string;
  colors: string[];
  collectionCode?: string;
  expiry: number;
  claimedBy?: string;
  claimedAt?: number;
  pickupAt?: number;
};