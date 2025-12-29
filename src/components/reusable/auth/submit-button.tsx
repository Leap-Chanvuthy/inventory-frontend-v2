import { Button } from '@/components/ui/button'


interface SubmitButtonProps {
    isPending: boolean;
    text: string;
    loadingText: string;
}

const SubmitButton = (props: SubmitButtonProps) => {
  return (
            <Button
                type="submit"
                disabled={props.isPending}
                className="w-full
                           
                           text-white flex items-center justify-center gap-2"
            >
                {props.isPending && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                )}
                {props.isPending ? props.loadingText : props.text}
            </Button>
  )
}

export default SubmitButton
