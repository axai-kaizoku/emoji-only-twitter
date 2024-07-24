import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Image from "next/image";
import Link from "next/link";

type ProfileCardProps = {
  trigger: React.ReactNode;
  img: string;
  name: string;
  username: string;
  href: string;
};

export const ProfileCard = ({
  trigger,
  img,
  name,
  username,
  href = "#",
}: ProfileCardProps) => {
  return (
    <HoverCard>
      <HoverCardTrigger className="hover:underline">{trigger}</HoverCardTrigger>
      <HoverCardContent>
        <Link href={href}>
          <div className="flex items-end gap-3">
            <Image
              src={img}
              alt={name ?? ""}
              width={36}
              height={36}
              className="rounded-full object-contain"
            />
            <div className="flex flex-col">
              <span className="text-base font-semibold">{name}</span>
              <span className="text-xs font-extralight tracking-wide">
                @{username}
              </span>
            </div>
          </div>
        </Link>
      </HoverCardContent>
    </HoverCard>
  );
};
