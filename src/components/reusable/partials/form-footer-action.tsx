import { Button } from "@/components/ui/button";
import { FolderSync, Save, SquareX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Loading from "./loading";

type FormFooterActionsProps = {
  cancelLabel?: string;
  saveLabel?: string;
  saveAndCloseLabel?: string;
  onCancel?: () => void;

  /** Loading / disabled state */
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
    if (onCancel) {
      onCancel();
      return;
    }

    navigate(-1);
  };

  return (
    <div className="flex flex-col-reverse justify-end gap-3 rounded-b-2xl border-t border-border py-5 sm:flex-row">
      {/* Cancel */}
      <Button
        type="button"
        variant="outline"
        className="w-full border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive sm:w-auto"
        onClick={handleCancel}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <Loading />
        ) : (
          <>
            <SquareX className="size-4" />
            {cancelLabel}
          </>
        )}
      </Button>

      {/* Save & Close */}
      <Button
        type="submit"
        name="action"
        value="save_and_close"
        className="w-full sm:w-auto"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <Loading />
        ) : (
          <>
            <FolderSync className="size-4" />
            {saveAndCloseLabel}
          </>
        )}
      </Button>

      {/* Save */}
      <Button
        type="submit"
        name="action"
        value="save"
        className="w-full sm:w-auto"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <Loading />
        ) : (
          <>
            <Save className="size-4" />
            {saveLabel}
          </>
        )}
      </Button>
    </div>
  );
};

export default FormFooterActions;