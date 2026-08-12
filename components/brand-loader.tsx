import Image from "next/image";

export function BrandLoader({ label = "جارٍ التجهيز" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center">
      <div className="relative">
        <Image
          src="/logo.jpg"
          alt="Classic Metal"
          width={56}
          height={56}
          className="h-14 w-14 rounded-full object-cover ring-1 ring-border"
        />
        <span className="brand-loader-ring absolute -inset-1.5 -z-10 rounded-full border-2 border-bronze/40" />
      </div>
      <div>
        <p className="text-sm font-semibold">
          Classic<span className="text-bronze"> Metal</span>
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{label}…</p>
      </div>
    </div>
  );
}