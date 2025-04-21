import { vi } from 'vitest'
import { config } from '@vue/test-utils'

// Mock axios
vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}))

// Mock router
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn()
  })
}))

// Configure Vue Test Utils
config.global.mocks = {
  $t: (key: string) => key
} 