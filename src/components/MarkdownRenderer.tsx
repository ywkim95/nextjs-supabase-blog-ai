import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeSanitize from 'rehype-sanitize'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-lg max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeHighlight,
          [rehypeSanitize, {
            // 보안이 강화된 허용 태그 목록
            tagNames: [
              'p', 'br', 'strong', 'em', 'b', 'i', 'u', 's', 'del', 'ins',
              'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
              'ul', 'ol', 'li',
              'blockquote', 'pre', 'code',
              'a', 'img',
              'table', 'thead', 'tbody', 'tr', 'th', 'td',
              'hr', 'div', 'span'
            ],
            attributes: {
              'a': ['href', 'title'],
              'img': ['src', 'alt', 'title', 'width', 'height'],
              'code': ['className'],
              'pre': ['className'],
              '*': ['className'] // 스타일링을 위한 클래스만 허용
            },
            // 잠재적으로 위험한 프로토콜 차단
            protocols: {
              'href': ['http', 'https', 'mailto'],
              'src': ['http', 'https']
            }
          }]
        ]}
        components={{
          // Custom styling for different elements
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text mb-6 mt-8 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-dark-text mb-4 mt-8 first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3 mt-6">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed">{children}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-orange-500 dark:border-dark-primary pl-4 py-2 mb-4 bg-gray-50 dark:bg-gray-700 italic text-gray-600 dark:text-gray-300">
              {children}
            </blockquote>
          ),
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '')
            return !match ? (
              <code
                className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-1 py-0.5 rounded text-sm font-mono"
                {...props}
              >
                {children}
              </code>
            ) : (
              <code
                className={`${className} block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono mb-4`}
                {...props}
              >
                {children}
              </code>
            )
          },
          pre: ({ children }) => (
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
              {children}
            </pre>
          ),
          a: ({ href, children }) => (
            <a 
              href={href} 
              className="text-orange-600 dark:text-dark-primary hover:text-orange-800 dark:hover:text-dark-accent underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          img: ({ src, alt }) => (
            <img 
              src={src} 
              alt={alt} 
              className="rounded-lg shadow-md mb-4 max-w-full h-auto"
            />
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-50 dark:bg-gray-700">{children}</thead>
          ),
          tbody: ({ children }) => (
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">{children}</tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
              {children}
            </td>
          ),
          hr: () => (
            <hr className="my-8 border-gray-300 dark:border-gray-600" />
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-gray-900 dark:text-dark-text">
              {children}
            </strong>
          ),
          b: ({ children }) => (
            <b className="font-bold text-gray-900 dark:text-dark-text">
              {children}
            </b>
          ),
          em: ({ children }) => (
            <em className="italic text-gray-800 dark:text-gray-200">
              {children}
            </em>
          ),
          i: ({ children }) => (
            <i className="italic text-gray-800 dark:text-gray-200">
              {children}
            </i>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
