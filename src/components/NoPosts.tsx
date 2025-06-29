import { ReactNode } from 'react'
import Link from 'next/link'

interface NoPostsProps {
  icon: ReactNode
  title: string
  description: string
  link?: {
    href: string
    text: string
  }
}

export default function NoPosts({ icon, title, description, link }: NoPostsProps) {
  return (
    <div className="text-center py-12">
      <div className="mx-auto h-24 w-24 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text mb-2">
        {title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        {description}
      </p>
      {link && (
        <Link
          href={link.href}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
        >
          {link.text}
        </Link>
      )}
    </div>
  )
}
