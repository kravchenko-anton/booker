export interface Book {
  id: string
  title: string
  author: string
  year: number
  pages: number
  tone: number
}

export interface Problem {
  id: string
  title: string
  blurb: string
  tag: string
  votes: number
  weeklyDelta: number
  rank?: number
  books: Book[]
}
