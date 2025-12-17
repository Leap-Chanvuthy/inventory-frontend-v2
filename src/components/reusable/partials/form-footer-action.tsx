import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

type FormFooterActionsProps = {
  cancelLabel?: string;
  saveLabel?: string;
  saveAndCloseLabel?: string;
  onSave?: () => void;                  
  onSaveAndClose?: () => void;            
  onCancel?: () => void;                 
  navigateTo?: string;             
};

const FormFooterActions = ({
  cancelLabel = "Cancel",
  saveLabel = "Save",
  saveAndCloseLabel = "Save & Close",
  onSave,
  onSaveAndClose,
  onCancel,
  navigateTo,
}: FormFooterActionsProps) => {
  const navigate = useNavigate();

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate(-1);
    }
  };

  const handleSave = () => {
    if (onSave) onSave();
  };

  const handleSaveAndClose = () => {
    if (onSaveAndClose) onSaveAndClose();
    else if (navigateTo) navigate(navigateTo);
  };

  return (
    <div className="py-5 border-t border-gray-100 dark:border-gray-700 flex flex-col-reverse sm:flex-row justify-end gap-3 rounded-b-2xl">
      {/* Cancel */}
      <Button variant="outline" className="w-full sm:w-auto" onClick={handleCancel}>
        {cancelLabel}
      </Button>

      {/* Save & Close */}
      <Button type="button" variant="primary" className="bg-[#5c52d6] hover:bg-[#4b43b3] text-white w-full sm:w-auto" onClick={handleSaveAndClose}>
        {saveAndCloseLabel}
      </Button>

      {/* Save */}
      <Button type="button" variant="primary" className="bg-[#5c52d6] hover:bg-[#4b43b3] text-white w-full sm:w-auto" onClick={handleSave}>
        {saveLabel}
      </Button>
    </div>
  );
};

export default FormFooterActions;
