import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/redux/store"
import { setTheme } from "@/redux/slices/theme-slice"
import { useEffect } from "react"

const appearanceFormSchema = z.object({
  theme: z.enum(["light", "dark"], {
    message: "Please select a theme.",
  }),
  font: z.enum(["inter", "manrope", "system"], {
    message: "Please select a font.",
  }),
})

type AppearanceFormValues = z.infer<typeof appearanceFormSchema>

export function AppearanceSetting() {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useSelector((state: RootState) => state.theme.mode);

  const form = useForm<AppearanceFormValues>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues: {
      theme,
      font: "inter",
    },
  });

  useEffect(() => {
    form.setValue("theme", theme);
  }, [theme, form]);

  return (
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger >
                      <SelectValue placeholder="Select a font" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent >
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
                  dispatch(setTheme(value)); // 🔥 REAL THEME CHANGE
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
      </form>
    </Form>
  )
}