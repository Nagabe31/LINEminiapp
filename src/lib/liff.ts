import liff from '@line/liff'

export interface LiffUser {
  userId: string
  displayName: string
  pictureUrl?: string
  statusMessage?: string
}

class LiffService {
  private isInitialized = false
  private user: LiffUser | null = null

  async init(): Promise<boolean> {
    if (this.isInitialized) return true

    try {
      await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! })
      this.isInitialized = true

      if (liff.isLoggedIn()) {
        const profile = await liff.getProfile()
        this.user = {
          userId: profile.userId,
          displayName: profile.displayName,
          pictureUrl: profile.pictureUrl,
          statusMessage: profile.statusMessage
        }
      }

      return true
    } catch (error) {
      console.error('LIFF initialization failed:', error)
      return false
    }
  }

  async login(): Promise<void> {
    if (!this.isInitialized) {
      await this.init()
    }

    if (!liff.isLoggedIn()) {
      liff.login()
    }
  }

  async logout(): Promise<void> {
    if (liff.isLoggedIn()) {
      liff.logout()
    }
  }

  isLoggedIn(): boolean {
    return liff.isLoggedIn()
  }

  getUser(): LiffUser | null {
    return this.user
  }

  isInLineApp(): boolean {
    return liff.isInClient()
  }

  getLineVersion(): string {
    return liff.getVersion()
  }
}

export const liffService = new LiffService()
