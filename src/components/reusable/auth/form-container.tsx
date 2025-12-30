import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { User } from "lucide-react";


interface FormContainerProps {
    form: React.ReactNode;
    cardFooter?: React.ReactNode;
    formTitle: string;
    formDescription: string;
    isShowIcon?: boolean;
}


const FormContainer = ( props: FormContainerProps) => {
    return (
        <div className="flex items-center justify-center p-6 sm:p-12">
            <Card className="w-full max-w-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
                <CardHeader className="text-center space-y-3">
                    <CardTitle className="text-lg lg:md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                        {props.formTitle}
                    </CardTitle>

                    <CardDescription className="text-gray-600 dark:text-gray-400">
                        {props.formDescription}
                    </CardDescription>

                    {props.isShowIcon && (
                        <div className="flex flex-col items-center pt-4">
                            <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 p-3 rounded-full">
                                <User className="h-6 w-6" />
                            </div>
                            <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                Account Information
                            </p>
                        </div>
                    )}
                </CardHeader>

                <CardContent>
                    {props.form}
                </CardContent>

                <CardFooter className="flex flex-col items-center gap-4">
                    {props.cardFooter}
                    {/* <Button
                            variant="outline"
                            className="w-full border-gray-300 dark:border-gray-700
                         text-gray-800 dark:text-gray-200
                         hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            Login with Google
                        </Button>

                        <a
                            href="#"
                            className="mt-2 inline-block text-sm
                         text-purple-600 dark:text-purple-400
                         hover:underline"
                        >
                            Forget your password?
                        </a> */}
                </CardFooter>
            </Card>
        </div>
    )
}

export default FormContainer
