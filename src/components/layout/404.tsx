import { FileQuestion, Home } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {

  const navigate = useNavigate();

  const previousPage = () => {
    navigate(-1);
  }


  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-4 animate-in fade-in zoom-in-95 duration-500">
      <div className="relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#5c52d6]/5 rounded-full blur-3xl -z-10" />

        <h1 className="text-9xl font-black text-[#5c52d6]/10 select-none">404</h1>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
            <FileQuestion className="w-12 h-12 text-[#5c52d6]" />
          </div>
        </div>
      </div>

      <div className="space-y-4 max-w-md mx-auto mt-[-2rem] relative z-10">
        <h2 className="text-2xl font-bold text-gray-900">Page not found</h2>
        <p className="text-gray-500">
          Sorry, the page you are looking for doesn't exist or has been moved.
          Please check the URL or go back home.
        </p>

        <div className="pt-4 flex justify-center gap-3">
          <Button variant="outline" onClick={previousPage} >
            <Home /> Go Back
          </Button>
          <Button variant="primary" onClick={() => navigate('/')} >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};


export default NotFound;