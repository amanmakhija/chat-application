import { cn } from "@/lib/utils";
import defaultAvatar from "../assets/default-avatar.svg";

const SERVER_BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;

interface AvatarProps {
  src?: string;
  className?: string;
}

function getCompleteUrl(url?: string) {
  if (!url) {
    return defaultAvatar;
  } else if (url.includes("http://") || url.includes("https://")) {
    return url;
  } else if (url.startsWith("/")) {
    return url;
  } else {
    return SERVER_BASE_URL + "/" + url;
  }
}

export default function Avatar({ src, className }: AvatarProps) {
  const url = getCompleteUrl(src);

  return (
    <div
      className={cn(
        "w-[4rem] aspect-square rounded-full relative overflow-hidden",
        className
      )}
    >
      <img
        src={url}
        alt=""
        className="w-full h-full object-cover select-none crisp"
        style={{ imageRendering: "crisp-edges" }}
        referrerPolicy={
          src?.includes("http://") || src?.includes("https://")
            ? "no-referrer"
            : "strict-origin-when-cross-origin"
        }
      />
    </div>
  );
}
