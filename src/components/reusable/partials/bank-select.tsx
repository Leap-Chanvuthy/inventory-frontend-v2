import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const BANK_OPTIONS = ["ACLEDA", "ABA", "WING", "BAKONG"] as const;

export type BankName = (typeof BANK_OPTIONS)[number];

// Bank logo configuration
// Add your bank logos to /public/assets/banks/ directory
export const BANK_LOGOS: Record<string, string> = {
  ACLEDA: "/assets/banks/acleda.png",
  ABA: "/assets/banks/aba.png",
  WING: "/assets/banks/wing.png",
  BAKONG: "/assets/banks/bakong.png",
};

type BankSelectProps = {
  id: string;
  label?: string;
  placeholder?: string;
  error?: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  excludeBanks?: string[];
  showLogos?: boolean;
};

export const BankSelect = ({
  id,
  label = "Bank Name",
  placeholder = "Select bank",
  error,
  value,
  onChange,
  required = false,
  disabled = false,
  excludeBanks = [],
  showLogos = true,
}: BankSelectProps) => {
  const availableBanks = BANK_OPTIONS.filter(
    bank => !excludeBanks.includes(bank),
  );

  // Get the selected bank's logo
  const selectedBankLogo = value && BANK_LOGOS[value];

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <Label
          htmlFor={id}
          className={
            error ? "text-red-500" : "text-gray-700 dark:text-gray-300"
          }
        >
          {label}
          {required && <span className="text-red-500 px-1">*</span>}
        </Label>
      )}

      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger
          id={id}
          className={error ? "border-red-500 focus:ring-red-500" : ""}
        >
          <SelectValue placeholder={placeholder}>
            {value && showLogos && selectedBankLogo ? (
              <div className="flex items-center gap-2">
                <img
                  src={selectedBankLogo}
                  alt={value}
                  className="w-6 h-6 object-contain"
                  onError={e => {
                    // Hide image if it fails to load
                    e.currentTarget.style.display = "none";
                  }}
                />
                <span>{value}</span>
              </div>
            ) : (
              value || placeholder
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {availableBanks.map(bank => (
            <SelectItem key={bank} value={bank}>
              <div className="flex items-center gap-2">
                {showLogos && BANK_LOGOS[bank] && (
                  <img
                    src={BANK_LOGOS[bank]}
                    alt={bank}
                    className="w-10 h-10 object-contain"
                    onError={e => {
                      // Hide image if it fails to load
                      e.currentTarget.style.display = "none";
                    }}
                  />
                )}
                <span>{bank}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};
