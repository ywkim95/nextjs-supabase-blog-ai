// src/components/PostCardTags.tsx

interface PostCardTagsProps {
  tags: string[]
}

export default function PostCardTags({ tags }: PostCardTagsProps) {
  if (!tags || tags.length === 0) {
    return null
  }

  return (
    <div className="mb-4">
      <div className="flex items-center flex-wrap gap-2">
        {tags.slice(0, 2).map((tag: string, index: number) => (
          <span
            key={index}
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-dark-primary dark:text-dark-background"
          >
            {tag}
          </span>
        ))}
        {tags.length > 2 && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            +{tags.length - 2}
          </span>
        )}
      </div>
    </div>
  )
}
