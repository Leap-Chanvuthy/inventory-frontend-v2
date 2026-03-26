import React from "react"
import { Link } from "react-router-dom"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

type Crumb = {
    name: string
    label: string
    link?: string
    className?: string
}

type BreadCrumbProps = {
    items: Crumb[]
}

export function BreadCrumb({ items }: BreadCrumbProps) {
    if (!items || items.length === 0) return null

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {items.map((item, idx) => {
                    const isLast = idx === items.length - 1
                    return (
                        <React.Fragment key={item.name ?? idx}>
                            <BreadcrumbItem>
                                {isLast ? (
                                    <BreadcrumbPage className={item.className}>{item.label}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild className={item.className}>
                                        <Link to={item.link ?? "#"}>{item.label}</Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                            {!isLast && <BreadcrumbSeparator />}
                        </React.Fragment>
                    )
                })}
            </BreadcrumbList>
        </Breadcrumb>
    )
}
