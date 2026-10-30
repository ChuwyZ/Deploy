export interface Authen {
  username: string | null
  role: string | null
  token: string | null
  userId: number | null
}

export interface User {
  id: number
  username: string
  name: string
  surname: string
  province: string
  level: number | null
  isActive: boolean
  profileImage: string[] // [0] = displayable URL (resolved from the storage key)
  email?: string
  profileImageKey?: string // storage key saved in the database
}

// ---- shapes returned by the backend (UserDTO) ----
export interface UserApi {
  id: number
  username: string
  firstname: string
  lastname: string
  email: string
  province: string
  profileImage: string | null
  enabled: boolean
  roles: string[]
  level: { id: number; levelNumber: number; passCriteriaScore?: number } | null
}

export interface UpdateUserForm {
  firstname: string
  lastname: string
  email: string
  province: string
  profileImage?: string
}

export interface RegisterForm {
  firstname: string
  lastname: string
  email: string
  password: string
  province: string
  profileImage: string
}

export interface UserFilter {
  firstname?: string
  lastname?: string
  province?: string
  level?: string
}

export interface Level {
  id: number
  levelNumber: number
  passCriteriaScore: number
}

export interface Benefit {
  id: number
  levelId: number
  title: string
  description: string
}

export interface Service {
  id: number
  batch: string
  description: string
  levelId: number
}

export interface Elearning {
  id: number
  levelId: number
  title: string
  videoUrl: string
  description: string
}

export interface Question {
  id: number
  levelId: number
  questionText: string
  options: string[]
  correctAnswer: string
}

export interface ExamHistory {
  id: number
  userId: number
  levelId?: number
  levelAttempted?: number
  score: number
  isPassed: boolean
  attemptedAt?: string
  dateTime?: string
}

export interface TakeExamChoiceDTO {
  id: number
  choiceText: string
}

export interface TakeExamQuestionDTO {
  id: number
  title: string
  levelId: number
  choices: TakeExamChoiceDTO[]
}

export interface ExamSubmitResponseDTO {
  score: number
  total: number
  isPassed: boolean
  newLevel: number
  date: string
}

export interface Badge {
  id: number
  badgeName: string
  badgeImage: string
  levelId: number
}
