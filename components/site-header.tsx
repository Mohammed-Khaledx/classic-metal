import Image from "next/image";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex w-full max-w-md items-center gap-3 px-4 py-3">
        <Image
          src="/logo.jpg"
          alt="Classic Metal"
          width={40}
          height={40}
          className="h-10 w-10 rounded-2xl object-cover ring-1 ring-border"
        />
        <div className="leading-tight">
          <p className="text-[17px] font-bold tracking-tight">
            Classic<span className="text-muted-foreground font-semibold"> Metal</span>
          </p>
          <p className="text-xs text-muted-foreground">
            تسعير فوري للألوميتال — مطابخ وشبابيك
          </p>
        </div>
        <div className="ms-auto">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}