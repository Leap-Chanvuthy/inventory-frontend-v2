import { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ===================== TYPES ===================== */

type TextOverflow = "clip" | "ellipsis" | "wrap";

type TextProps = {
  children: ReactNode;
  className?: string;

  color?: "default" | "muted" | "primary" | "destructive";
  fontWeight?: "normal" | "medium" | "semibold" | "bold";
  bold?: boolean;

  overflow?: TextOverflow;
  maxLines?: 1 | 2 | 3 | 4 | 5 | 6; // ✅ NEW

  letterSpacing?: "tight" | "normal" | "wide";
  fontStyle?: "normal" | "italic";
  fontSizeClass?: string;
};

/* ===================== MAPS ===================== */

const colorMap = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  primary: "text-primary",
  destructive: "text-destructive",
};

const weightMap = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

const spacingMap = {
  tight: "tracking-tight",
  normal: "tracking-normal",
  wide: "tracking-wide",
};

const overflowMap = {
  clip: "overflow-hidden",
  ellipsis: "truncate",
  wrap: "break-words",
};

const clampMap = {
  1: "line-clamp-1",
  2: "line-clamp-2",
  3: "line-clamp-3",
  4: "line-clamp-4",
  5: "line-clamp-5",
  6: "line-clamp-6",
};

/* ===================== BODY ===================== */

const Small = ({
  children,
  className,
  color = "muted",
  fontWeight = "normal",
  bold = false,
  overflow,
  maxLines,
  letterSpacing,
  fontStyle,
  fontSizeClass,
}: TextProps) => (
  <p
    className={cn(
      "text-xs md:text-sm leading-relaxed",
      colorMap[color],
      bold ? "font-bold" : weightMap[fontWeight],
      letterSpacing && spacingMap[letterSpacing],
      maxLines ? clampMap[maxLines] : overflow && overflowMap[overflow],
      fontStyle === "italic" && "italic",
      fontSizeClass,
      className,
    )}
  >
    {children}
  </p>
);

const Medium = ({
  children,
  className,
  color = "muted",
  fontWeight = "normal",
  bold = false,
  overflow,
  maxLines,
  letterSpacing,
  fontStyle,
  fontSizeClass,
}: TextProps) => (
  <p
    className={cn(
      "text-sm md:text-base leading-relaxed",
      colorMap[color],
      bold ? "font-bold" : weightMap[fontWeight],
      letterSpacing && spacingMap[letterSpacing],
      maxLines ? clampMap[maxLines] : overflow && overflowMap[overflow],
      fontStyle === "italic" && "italic",
      fontSizeClass,
      className,
    )}
  >
    {children}
  </p>
);

const Large = ({
  children,
  className,
  color = "default",
  fontWeight = "normal",
  bold = false,
  overflow,
  maxLines,
  letterSpacing,
  fontStyle,
  fontSizeClass,
}: TextProps) => (
  <p
    className={cn(
      "text-base md:text-lg leading-relaxed",
      colorMap[color],
      bold ? "font-bold" : weightMap[fontWeight],
      letterSpacing && spacingMap[letterSpacing],
      maxLines ? clampMap[maxLines] : overflow && overflowMap[overflow],
      fontStyle === "italic" && "italic",
      fontSizeClass,
      className,
    )}
  >
    {children}
  </p>
);

/* ===================== TITLES ===================== */

const TitleSmall = ({
  children,
  className,
  color = "default",
  fontWeight = "semibold",
  bold = false,
  letterSpacing,
  fontStyle,
  maxLines,
  fontSizeClass,
}: TextProps) => (
  <h4
    className={cn(
      "text-base md:text-lg leading-snug",
      colorMap[color],
      bold ? "font-bold" : weightMap[fontWeight],
      letterSpacing && spacingMap[letterSpacing],
      maxLines && clampMap[maxLines],
      fontStyle === "italic" && "italic",
      fontSizeClass,
      className,
    )}
  >
    {children}
  </h4>
);

const TitleMedium = ({
  children,
  className,
  color = "default",
  fontWeight = "semibold",
  bold = false,
  letterSpacing,
  fontStyle,
  maxLines,
  fontSizeClass,
}: TextProps) => (
  <h3
    className={cn(
      "text-lg md:text-xl leading-snug",
      colorMap[color],
      bold ? "font-bold" : weightMap[fontWeight],
      letterSpacing && spacingMap[letterSpacing],
      maxLines && clampMap[maxLines],
      fontStyle === "italic" && "italic",
      fontSizeClass,
      className,
    )}
  >
    {children}
  </h3>
);

const TitleLarge = ({
  children,
  className,
  color = "default",
  fontWeight = "bold",
  bold = false,
  letterSpacing,
  fontStyle,
  maxLines,
  fontSizeClass,
}: TextProps) => (
  <h2
    className={cn(
      "text-2xl md:text-3xl leading-tight",
      colorMap[color],
      bold ? "font-bold" : weightMap[fontWeight],
      letterSpacing && spacingMap[letterSpacing],
      maxLines && clampMap[maxLines],
      fontStyle === "italic" && "italic",
      fontSizeClass,
      className,
    )}
  >
    {children}
  </h2>
);

/* ===================== EXPORT ===================== */

export const Text = {
  Small,
  Medium,
  Large,
  TitleSmall,
  TitleMedium,
  TitleLarge,
};
