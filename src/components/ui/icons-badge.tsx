import {
  iconBadgeClass,
  iconBadgeIcon,
  IconBadgeLabel,
  IconBadgeVariant,
} from "@/utils/icon-badge";

interface IconBadgeProps {
  label: IconBadgeLabel;
  variant?: IconBadgeVariant;
  size?: number;
}

export const IconBadge = ({
  label,
  variant = "default",
  size = 16,
}: IconBadgeProps) => {
  const Icon = iconBadgeIcon(label);

  return (
    <span className={iconBadgeClass(variant)}>
      <Icon style={{ width: size, height: size }} />
    </span>
  );
};
