// 입력 검증 및 새니타이저

export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

// 이메일 검증
export function validateEmail(email: string): string {
  if (!email || typeof email !== 'string') {
    throw new ValidationError('Email is required', 'email')
  }

  const trimmedEmail = email.trim()
  
  if (trimmedEmail.length === 0) {
    throw new ValidationError('Email cannot be empty', 'email')
  }

  if (trimmedEmail.length > 254) {
    throw new ValidationError('Email is too long', 'email')
  }

  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  
  if (!emailRegex.test(trimmedEmail)) {
    throw new ValidationError('Invalid email format', 'email')
  }

  return trimmedEmail.toLowerCase()
}

// 비밀번호 검증
export function validatePassword(password: string): string {
  if (!password || typeof password !== 'string') {
    throw new ValidationError('Password is required', 'password')
  }

  if (password.length < 6) {
    throw new ValidationError('Password must be at least 6 characters', 'password')
  }

  if (password.length > 128) {
    throw new ValidationError('Password is too long', 'password')
  }

  return password
}

// 텍스트 새니타이저 (XSS 방지)
export function sanitizeText(text: string): string {
  if (!text || typeof text !== 'string') {
    return ''
  }

  return text
    .trim()
    .replace(/[<>'"&]/g, (char) => {
      switch (char) {
        case '<': return '&lt;'
        case '>': return '&gt;'
        case '"': return '&quot;'
        case "'": return '&#x27;'
        case '&': return '&amp;'
        default: return char
      }
    })
}

// URL 검증
export function validateUrl(url: string): string {
  if (!url || typeof url !== 'string') {
    throw new ValidationError('URL is required', 'url')
  }

  try {
    const urlObject = new URL(url)
    
    // 허용된 프로토콜만
    if (!['http:', 'https:'].includes(urlObject.protocol)) {
      throw new ValidationError('Invalid URL protocol', 'url')
    }

    return urlObject.toString()
  } catch {
    throw new ValidationError('Invalid URL format', 'url')
  }
}

// 문자열 길이 검증
export function validateStringLength(
  value: string, 
  minLength: number, 
  maxLength: number, 
  fieldName: string = 'field'
): string {
  if (!value || typeof value !== 'string') {
    throw new ValidationError(`${fieldName} is required`, fieldName)
  }

  const trimmed = value.trim()

  if (trimmed.length < minLength) {
    throw new ValidationError(`${fieldName} must be at least ${minLength} characters`, fieldName)
  }

  if (trimmed.length > maxLength) {
    throw new ValidationError(`${fieldName} must be no more than ${maxLength} characters`, fieldName)
  }

  return trimmed
}