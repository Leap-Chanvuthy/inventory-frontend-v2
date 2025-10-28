import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Eye, Star } from "lucide-react"

export function Login() {
    return (
        // Main container: full-screen, two-column layout on large screens
        <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
            
            {/* Left Column (Branding & Image) - Hidden on mobile */}
            <div className="hidden bg-gray-100 lg:flex lg:flex-col lg:items-start lg:justify-center p-12 space-y-6">
                <div className="flex items-center gap-2">
                    <Star className="h-8 w-8 text-purple-600" fill="currentColor" />
                    <span className="text-3xl font-bold text-purple-600">Inventory</span>
                </div>
                <h1 className="text-4xl font-bold text-gray-900">
                    Manage your Inventory
                </h1>
                <p className="text-gray-600 text-lg">
                    តាមដាន និង វិភាគទិន្នន័យលក់តាមរយៈ: trends, ត្រួតពិនិត្យ និង
                    រាយការណ៍ងាយៗដើម្បីបង្កើនប្រសិទ្ធភាពការលក់។
                </p>
                <div>
                    <img 
                        src="/placeholder-dashboard.png" // <-- REPLACE THIS
                        alt="Inventory Dashboard Illustration"
                        width={600}
                        height={400}
                        className="object-contain"
                    />
                     {/*  */}
                </div>
            </div>

            {/* Right Column (Login Form) */}
            <div className="flex items-center justify-center p-6 sm:p-12">
                <Card className="w-full max-w-md border-none shadow-none">
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl font-bold">
                            Login to your account
                        </CardTitle>
                        <CardDescription>
                            Login to your inventory system from following form.
                        </CardDescription>
                        
                        {/* Account Information Icon */}
                        <div className="flex flex-col items-center pt-4">
                            <div className="bg-purple-100 text-purple-600 p-3 rounded-full">
                                <User className="h-6 w-6" />
                            </div>
                            <p className="mt-2 text-sm font-medium text-gray-700">
                                Account Information
                            </p>
                        </div>
                    </CardHeader>
                    
                    <CardContent>
                        <form>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="email" className="font-semibold">
                                        Your Email
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Please fill your email"
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password" className="font-semibold">
                                        Your Password
                                    </Label>
                                    {/* We add a relative container to position
                                      the 'eye' icon inside the input.
                                    */}
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="Enter your password"
                                            required
                                        />
                                        <Eye className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 cursor-pointer" />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Note: The <form> tag should ideally wrap the
                              submit button. I'm placing the buttons in the
                              footer as per your original structure.
                              For a real form, you'd wrap the <Button type="submit">
                              inside the <form>.
                            */}
                        </form>
                    </CardContent>
                    
                    <CardFooter className="flex-col gap-4">
                        {/* We apply purple background and hover styles
                          to the primary login button.
                        */}
                        <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                            Login to your account
                        </Button>
                        <Button variant="outline" className="w-full">
                            Login with google
                        </Button>
                        
                        {/* Forgot password link at the bottom */}
                        <a
                            href="#"
                            className="mt-2 inline-block text-sm text-purple-600 hover:underline"
                        >
                            Forget your password?
                        </a>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
