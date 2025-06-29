// Rate limiting using Map (메모리 기반)
// 프로덕션에서는 Redis 사용 권장

interface RateLimitEntry {
  count: number
  resetTime: number
}

class RateLimiter {
  private requests = new Map<string, RateLimitEntry>()
  private readonly maxRequests: number
  private readonly windowMs: number

  constructor(maxRequests: number = 10, windowMs: number = 15 * 60 * 1000) { // 15분
    this.maxRequests = maxRequests
    this.windowMs = windowMs
    
    // 정리 작업 - 만료된 엔트리 제거
    setInterval(() => {
      const now = Date.now()
      for (const [key, entry] of this.requests.entries()) {
        if (now > entry.resetTime) {
          this.requests.delete(key)
        }
      }
    }, this.windowMs)
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now()
    const entry = this.requests.get(identifier)

    if (!entry || now > entry.resetTime) {
      // 새로운 윈도우 시작
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs
      })
      return true
    }

    if (entry.count >= this.maxRequests) {
      return false
    }

    entry.count++
    return true
  }

  getRemainingRequests(identifier: string): number {
    const entry = this.requests.get(identifier)
    if (!entry || Date.now() > entry.resetTime) {
      return this.maxRequests
    }
    return Math.max(0, this.maxRequests - entry.count)
  }

  getResetTime(identifier: string): number {
    const entry = this.requests.get(identifier)
    return entry?.resetTime || Date.now()
  }
}

// 다양한 제한 수준
export const strictLimiter = new RateLimiter(5, 15 * 60 * 1000) // 15분에 5회 (로그인)
export const normalLimiter = new RateLimiter(100, 15 * 60 * 1000) // 15분에 100회 (일반 API)

export function getClientIP(request: Request): string {
  // Vercel/Netlify에서 실제 IP 추출
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP.trim()
  }
  
  return 'unknown'
}