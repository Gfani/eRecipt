import { OfficerSignIn } from '../../components/OfficerSignIn';

interface OfficerLoginFormProps {
  onLogin?: () => void;
  onReturnToMerchant?: () => void;
}

export const OfficerLoginForm: React.FC<OfficerLoginFormProps> = ({
  onLogin,
  onReturnToMerchant,
}) => {
  return (
    <OfficerSignIn
      onSuccess={onLogin || (() => {})}
      onReturnToMerchant={onReturnToMerchant}
    />
  );
};

export default OfficerLoginForm;