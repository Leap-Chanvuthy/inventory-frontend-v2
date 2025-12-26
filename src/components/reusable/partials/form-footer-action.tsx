import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

type FormFooterActionsProps = {
  cancelLabel?: string;
  saveLabel?: string;
  saveAndCloseLabel?: string;
  onCancel?: () => void;

  /** Loading / disable state */
  isSubmitting?: boolean;
};

const FormFooterActions = ({
  cancelLabel = "Cancel",
  saveLabel = "Save",
  saveAndCloseLabel = "Save & Close",
  onCancel,
  isSubmitting = false,
}: FormFooterActionsProps) => {
  const navigate = useNavigate();

  const handleCancel = () => {
    if (onCancel) onCancel();
    else navigate(-1);
  };

  return (
    <div className="py-5 border-t border-gray-100 dark:border-gray-700 flex flex-col-reverse sm:flex-row justify-end gap-3 rounded-b-2xl">
      {/* Cancel */}
      <Button
        type="button"
        variant="outline"
        className="w-full sm:w-auto"
        onClick={handleCancel}
        disabled={isSubmitting}
      >
        {cancelLabel}
      </Button>

      {/* Save & Close */}
      <Button
        type="submit"
        name="action"
        value="save_and_close"
        className="bg-[#5c52d6] hover:bg-[#4b43b3] text-white w-full sm:w-auto"
        disabled={isSubmitting}
      >
        {saveAndCloseLabel}
      </Button>

      {/* Save */}
      <Button
        type="submit"
        name="action"
        value="save"
        className="bg-[#5c52d6] hover:bg-[#4b43b3] text-white w-full sm:w-auto"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving..." : saveLabel}
      </Button>
    </div>
  );
};

export default FormFooterActions;
