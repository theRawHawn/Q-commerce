import React from 'react';
import { JobSiteLocation } from '../types';
import { LocationPage } from './LocationPage';

interface JobsiteAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: JobSiteLocation;
  onSaveLocation: (loc: JobSiteLocation) => void;
}

export const JobsiteAddressModal: React.FC<JobsiteAddressModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  onSaveLocation,
}) => {
  if (!isOpen) return null;

  return (
    <LocationPage
      currentLocation={currentLocation}
      onSaveLocation={onSaveLocation}
      onClose={onClose}
    />
  );
};
