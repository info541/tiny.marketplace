import Image from "next/image";

type Props = {
  src: string;
  name: string;
  className?: string;
  size?: number;
};

/** Renders brand logos from /public; uses img for SVGs (Next/Image blocks SVG by default). */
export function BrandLogo({ src, name, className = "", size = 56 }: Props) {
  const isSvg = src.endsWith(".svg");
  if (isSvg) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt="" width={size} height={size} className={className || "h-full w-full object-contain"} />
    );
  }
  return (
    <Image
      src={src}
      alt=""
      width={size}
      height={size}
      className={className || "h-full w-full object-contain"}
    />
  );
}
