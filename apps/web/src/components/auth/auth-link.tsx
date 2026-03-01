interface AuthLinkProps {
    text: string
    href: string
    linkText: string
}

export function AuthLink({ text, href, linkText }: AuthLinkProps) {
    return (
        <div className="flex items-center text-sm text-muted-foreground">
            {text}
            <a
                href={href}
                className="ml-1.5 inline-block text-sm text-foreground underline underline-offset-4"
            >
                {linkText}
            </a>
        </div>
    )
}
