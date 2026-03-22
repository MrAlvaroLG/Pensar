import Link from "next/link"

interface AuthLinkProps {
    text: string
    href: string
    linkText: string
}

export function AuthLink({ text, href, linkText }: AuthLinkProps) {
    return (
        <div className="flex items-center text-sm text-muted-foreground">
            {text}
            <Link
                href={href}
                className="ml-1.5 inline-block text-sm text-foreground underline underline-offset-4"
            >
                {linkText}
            </Link>
        </div>
    )
}
