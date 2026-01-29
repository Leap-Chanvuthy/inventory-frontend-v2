import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { setTheme } from "@/redux/slices/theme-slice";
import { useEffect } from "react";

import { LayoutGrid, Table } from "lucide-react";
import { setOption } from "@/redux/slices/list-options-slice";

const appearanceFormSchema = z.object({
  theme: z.enum(["light", "dark"], {
    message: "Please select a theme.",
  }),
  font: z.enum(["inter", "manrope", "system"], {
    message: "Please select a font.",
  }),
  language: z.enum(["en", "km"], {
    message: "Please select a language.",
  }),
  listView: z.enum(["table", "card"], {
    message: "Please select a default list view.",
  }),
});

type AppearanceFormValues = z.infer<typeof appearanceFormSchema>;

export function AppearanceSetting() {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useSelector((state: RootState) => state.theme.mode);
  const listView =
    (useSelector((state: RootState) => state.listOptions.option) as
      | "table"
      | "card"
      | undefined) ?? "table";

  const form = useForm<AppearanceFormValues>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues: {
      theme,
      font: "inter",
      language: "en",
      listView,
    },
  });

  useEffect(() => {
    form.setValue("theme", theme);
  }, [theme, form]);

  useEffect(() => {
    form.setValue("listView", listView);
  }, [listView, form]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pt-2">
      <Form {...form}>
        <form className="space-y-8">
          {/* Font Selection */}
          <FormField
            control={form.control}
            name="font"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Font Family</FormLabel>
                <div className="relative w-full lg:max-w-[300px]">
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a font" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="inter">Inter (Default)</SelectItem>
                      <SelectItem value="manrope">Manrope</SelectItem>
                      <SelectItem value="system">System Sans</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <FormDescription>
                  Set the font you want to use in the dashboard.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Theme Selection */}
          <FormField
            control={form.control}
            name="theme"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-white">Theme</FormLabel>
                <FormDescription>
                  Select the theme for the dashboard.
                </FormDescription>
                <FormMessage />
                <RadioGroup
                  value={field.value}
                  onValueChange={(value: "light" | "dark") => {
                    field.onChange(value);
                    dispatch(setTheme(value));
                  }}
                  defaultValue={field.value}
                  className="grid max-w-md grid-cols-2 gap-8 pt-2"
                >
                  <FormItem>
                    <FormLabel className="[&:has([data-state=checked])>div]:border-white cursor-pointer">
                      <FormControl>
                        <RadioGroupItem value="light" className="sr-only" />
                      </FormControl>
                      <div className="items-center rounded-md border-2 border-zinc-800 p-1 bg-zinc-950 hover:border-zinc-500 transition-all">
                        <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                          <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                            <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
                            <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                          </div>
                          <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                            <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                            <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                          </div>
                        </div>
                      </div>
                      <span className="block w-full p-2 text-center font-normal text-zinc-400">
                        Light
                      </span>
                    </FormLabel>
                  </FormItem>
                  <FormItem>
                    <FormLabel className="[&:has([data-state=checked])>div]:border-white cursor-pointer">
                      <FormControl>
                        <RadioGroupItem value="dark" className="sr-only" />
                      </FormControl>
                      <div className="items-center rounded-md border-2 border-zinc-800 p-1 bg-zinc-950 hover:border-zinc-500 transition-all">
                        <div className="space-y-2 rounded-sm bg-zinc-950 p-2">
                          <div className="space-y-2 rounded-md bg-zinc-800 p-2 shadow-sm">
                            <div className="h-2 w-[80px] rounded-lg bg-zinc-400" />
                            <div className="h-2 w-[100px] rounded-lg bg-zinc-400" />
                          </div>
                          <div className="flex items-center space-x-2 rounded-md bg-zinc-800 p-2 shadow-sm">
                            <div className="h-4 w-4 rounded-full bg-zinc-400" />
                            <div className="h-2 w-[100px] rounded-lg bg-zinc-400" />
                          </div>
                        </div>
                      </div>
                      <span className="block w-full p-2 text-center font-normal text-zinc-400">
                        Dark
                      </span>
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormItem>
            )}
          />
          {/* Language Selection (under theme) */}
          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Language</FormLabel>
                <div className="relative w-full lg:max-w-[300px]">
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a language" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="km">Khmer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <FormDescription>
                  Choose the language used in the dashboard.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Default list view (table / card) - styled like Theme */}
          <FormField
            control={form.control}
            name="listView"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Default list view</FormLabel>
                <FormDescription>
                  Choose how lists should be displayed by default.
                </FormDescription>
                <FormMessage />
                <RadioGroup
                  value={field.value}
                  onValueChange={(value: "table" | "card") => {
                    field.onChange(value);
                    dispatch(setOption(value));
                  }}
                  className="grid max-w-md grid-cols-2 gap-8 pt-2"
                >
                  {/* Table */}
                  <FormItem>
                    <FormLabel className="[&:has([data-state=checked])>div]:border-primary cursor-pointer">
                      <FormControl>
                        <RadioGroupItem value="table" className="sr-only" />
                      </FormControl>
                      <div className="rounded-md border-2 border-border p-1 bg-background hover:border-muted-foreground/40 transition-all">
                        <div className="space-y-2 rounded-sm bg-muted/40 p-2">
                          <div className="flex items-center justify-between rounded-md bg-background p-2 shadow-sm">
                            <div className="flex items-center gap-2">
                              <Table className="h-4 w-4 text-muted-foreground" />
                              <div className="h-2 w-[90px] rounded bg-muted" />
                            </div>
                            <div className="h-2 w-[40px] rounded bg-muted" />
                          </div>
                          <div className="rounded-md bg-background p-2 shadow-sm space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="h-2 w-[120px] rounded bg-muted" />
                              <div className="h-2 w-[50px] rounded bg-muted" />
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="h-2 w-[100px] rounded bg-muted" />
                              <div className="h-2 w-[60px] rounded bg-muted" />
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="h-2 w-[130px] rounded bg-muted" />
                              <div className="h-2 w-[45px] rounded bg-muted" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <span className="block w-full p-2 text-center font-normal text-muted-foreground">
                        Table
                      </span>
                    </FormLabel>
                  </FormItem>
                  {/* Card */}
                  <FormItem>
                    <FormLabel className="[&:has([data-state=checked])>div]:border-primary cursor-pointer">
                      <FormControl>
                        <RadioGroupItem value="card" className="sr-only" />
                      </FormControl>
                      <div className="rounded-md border-2 border-border p-1 bg-background hover:border-muted-foreground/40 transition-all">
                        <div className="space-y-2 rounded-sm bg-muted/40 p-2">
                          <div className="flex items-center gap-2 rounded-md bg-background p-2 shadow-sm">
                            <LayoutGrid className="h-4 w-4 text-muted-foreground" />
                            <div className="h-2 w-[100px] rounded bg-muted" />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="rounded-md bg-background p-2 shadow-sm space-y-2">
                              <div className="h-2 w-[70px] rounded bg-muted" />
                              <div className="h-2 w-[60px] rounded bg-muted" />
                              <div className="h-2 w-[50px] rounded bg-muted" />
                            </div>
                            <div className="rounded-md bg-background p-2 shadow-sm space-y-2">
                              <div className="h-2 w-[70px] rounded bg-muted" />
                              <div className="h-2 w-[60px] rounded bg-muted" />
                              <div className="h-2 w-[50px] rounded bg-muted" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <span className="block w-full p-2 text-center font-normal text-muted-foreground">
                        Card
                      </span>
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
