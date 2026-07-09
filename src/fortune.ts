import { ENGLISH_SENTENCES } from './content/english'
import { ZODIAC_SIGNS, ZODIAC_FORTUNES } from './content/zodiac'
import type { ZodiacInfo, ZodiacKey } from './content/zodiac'
import { MBTI_FORTUNES } from './content/mbti'
import type { MbtiType } from './content/mbti'

function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date.getTime() - start.getTime()
  return Math.floor(diff / 86400000)
}

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

// mulberry32 PRNG, seeded so the same date always yields the same numbers
function mulberry32(seed: number) {
  let a = seed
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function getDailyEnglish(date = new Date()) {
  const idx = dayOfYear(date) % ENGLISH_SENTENCES.length
  return ENGLISH_SENTENCES[idx]
}

export function getLottoNumbers(dateKey: string): number[] {
  const rand = mulberry32(hashString(dateKey))
  const numbers = new Set<number>()
  while (numbers.size < 6) {
    numbers.add(Math.floor(rand() * 45) + 1)
  }
  return Array.from(numbers).sort((a, b) => a - b)
}

export function getZodiacSign(month: number, day: number): ZodiacInfo {
  const found = ZODIAC_SIGNS.find(({ range: [sm, sd, em, ed] }) => {
    if (sm <= em) {
      return (month === sm && day >= sd) || (month === em && day <= ed) || (month > sm && month < em)
    }
    // wraps year end (capricorn)
    return (month === sm && day >= sd) || (month === em && day <= ed) || month > sm || month < em
  })
  return found ?? ZODIAC_SIGNS[0]
}

export function getZodiacFortune(key: ZodiacKey, date = new Date()): string {
  const pool = ZODIAC_FORTUNES[key]
  return pool[dayOfYear(date) % pool.length]
}

export function getMbtiFortune(type: MbtiType, date = new Date()): string {
  const pool = MBTI_FORTUNES[type]
  return pool[dayOfYear(date) % pool.length]
}
