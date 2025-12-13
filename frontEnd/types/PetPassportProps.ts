export type PetPassportModalProps = {
    visible: boolean;
    onClose: () => void;
    pet: {
      image?: string;
      name?: string;
    };
  };