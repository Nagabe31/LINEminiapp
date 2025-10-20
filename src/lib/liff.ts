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
      const liffId = process.env.NEXT_PUBLIC_LIFF_ID
      if (!liffId) {
        console.error('LIFF ID is not set')
        return false
      }

      console.log('Initializing LIFF with ID:', liffId)
      await liff.init({ liffId })
      this.isInitialized = true

      console.log('LIFF initialized successfully')
      console.log('Is logged in:', liff.isLoggedIn())
      console.log('Is in LINE app:', liff.isInClient())

      if (liff.isLoggedIn()) {
        const profile = await liff.getProfile()
        console.log('User profile:', profile)
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
      console.error('Error details:', error)
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
