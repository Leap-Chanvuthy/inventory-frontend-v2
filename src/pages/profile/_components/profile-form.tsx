import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/reusable/partials/image-upload";
import { TextAreaInput, TextInput } from "@/components/reusable/partials/input";
import FormFooterActions from "@/components/reusable/partials/form-footer-action";

export function ProfileForm() {
    return (
        <div className="space-y-8">

            <div className="grid gap-6">

                {/* Profile Picture */}
                <div className="grid gap-2">
                    <Label>Profile Picture</Label>
                    <ImageUpload />
                </div>

                {/* Username */}
                <div className="grid gap-2">
                    <TextInput
                        label="Username"
                        id="username"
                        placeholder="your username"
                    />
                    <p className="text-[0.8rem] text-muted-foreground">
                        This is your public display name. You can only change this once every 30 days.
                    </p>
                </div>

                {/* Email */}
                <div className="grid gap-2">
                    <TextInput
                        label="Email Address"
                        id="email"
                        type="email"
                        placeholder="your email address"
                    />
                    <p className="text-[0.8rem] text-muted-foreground">
                        You can manage verified email addresses in your email settings.
                    </p>
                </div>

                {/* Bio */}
                <div className="grid gap-2">
                    <TextAreaInput
                        label="Bio"
                        id="bio"
                        placeholder="Write a short bio about yourself."
                    />
                    <p className="text-[0.8rem] text-muted-foreground">
                        You can @mention other users and organizations to link to them.
                    </p>
                </div>
            </div>
            <FormFooterActions />
        </div>
    );
}