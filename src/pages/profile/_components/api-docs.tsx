import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Code2, BookOpen, Terminal, CheckCircle2 } from "lucide-react";
import { BASE_API_URL } from "@/consts/endpoints";

export function ApiDocsGuide() {
  const swaggerUrl = `${BASE_API_URL}/documentation`;

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-2 py-0">
            v2.0
          </Badge>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            Inventory System Operational
          </div>
        </div>
        <h2 className="text-3xl font-bold tracking-tight ">API Reference</h2>
        <p className="text-muted-foreground text-lg">
          Everything you need to integrate with our platform, from authentication to webhooks.
        </p>
      </div>

      {/* Main Action Card */}
      <Card className="  overflow-hidden relative">
        <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
          <Terminal className="w-32 h-32 " />
        </div>
        
        <CardHeader>
          <CardTitle className=" flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-zinc-400" />
            Interactive Explorer
          </CardTitle>
          <CardDescription className="max-w-[400px]">
            We use Swagger/OpenAPI to provide a live environment where you can test endpoints directly from your browser.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 rounded-lg border  space-y-2">
              <p className="text-sm font-medium ">Base URL</p>
              <code className="text-xs text-zinc-400 block  p-2 rounded border /50 text-wrap">
                https://api-inventory-v2.camsmeinventory.com/api/documentation
              </code>
            </div>
            <div className="p-4 rounded-lg border  space-y-2">
              <p className="text-sm font-medium ">Auth Method</p>
              <p className="text-xs text-zinc-400  p-2 rounded border /50">
                Bearer Token / API Key
              </p>
            </div>
          </div>

          <Button 
            asChild
            className="w-full sm:w-auto bg-white text-black hover:bg-zinc-200 py-6 text-md font-semibold"
          >
            <a href={swaggerUrl} target="_blank" rel="noopener noreferrer">
              Open Swagger Documentation
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </CardContent>
      </Card>

      {/* Helpful Quick Links */}
      <div className="grid gap-4 md:grid-cols-2">
        <button className="flex items-start gap-4 p-4 rounded-xl border   hover:transition-colors text-left group">
          <div className="p-2 rounded-lg group-hover:bg-zinc-800 border ">
            <Code2 className="w-5 h-5 text-zinc-400" />
          </div>
          <div>
            <p className="font-medium ">SDKs & Libraries</p>
            <p className="text-sm text-zinc-500">Official wrappers for Node, Go, and Python.</p>
          </div>
        </button>

        <button className="flex items-start gap-4 p-4 rounded-xl border   hover:transition-colors text-left group">
          <div className="p-2 rounded-lg group-hover:bg-zinc-800 border ">
            <Terminal className="w-5 h-5 text-zinc-400" />
          </div>
          <div>
            <p className="font-medium ">Postman Collection</p>
            <p className="text-sm text-zinc-500">Import our latest spec into your workspace.</p>
          </div>
        </button>
      </div>
    </div>
  );
}