// Utility functions for the blog

/**
 * Calculate estimated reading time for text content
 * @param text - The text content to analyze
 * @param wordsPerMinute - Average reading speed (default: 200 words per minute)
 * @returns Estimated reading time in minutes
 */
export function calculateReadingTime(text: string, wordsPerMinute: number = 200): number {
  // Remove markdown syntax for more accurate word count
  const cleanText = text
    .replace(/[#*`_\[\]]/g, '') // Remove markdown symbols
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove image markdown
    .replace(/\[.*?\]\(.*?\)/g, '') // Remove link markdown
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`.*?`/g, '') // Remove inline code
    .trim()

  // Count words (split by whitespace and filter empty strings)
  const wordCount = cleanText.split(/\s+/).filter(word => word.length > 0).length
  
  // Calculate reading time in minutes (minimum 1 minute)
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
}

/**
 * Format reading time for display
 * @param minutes - Reading time in minutes
 * @returns Formatted string
 */
export function formatReadingTime(minutes: number): string {
  if (minutes === 1) {
    return '1분 읽기'
  }
  return `${minutes}분 읽기`
}

/**
 * Create a URL-friendly slug from a title
 * @param title - The title to convert
 * @returns URL-friendly slug
 */
export function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9가-힣 -]/g, '') // Keep Korean characters
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

/**
 * Format date for display
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}