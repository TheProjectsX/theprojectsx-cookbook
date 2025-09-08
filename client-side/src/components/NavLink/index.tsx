import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnchorHTMLAttributes } from "react";

type NavLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    className?: string;
};

const NavLink = ({ href, className, children, ...props }: NavLinkProps) => {
    const pathname = usePathname();

    return (
        <Link
            href={href}
            className={`${className}${pathname === href ? " active" : ""}`}
            {...props}
        >
            {children}
        </Link>
    );
};

export default NavLink;
