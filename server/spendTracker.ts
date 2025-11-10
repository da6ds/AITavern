import { captureError } from "./sentry";

interface DailySpend {
  date: string; // YYYY-MM-DD
  totalCost: number; // in dollars
  requestCount: number;
}

class SpendTracker {
  private currentSpend: DailySpend;
  private readonly DAILY_LIMIT = 10; // $10 per day
  private readonly WARNING_THRESHOLD = 8; // Alert at $8
  private readonly COST_PER_REQUEST = 0.001; // OpenRouter Claude 3.5 Haiku cost

  constructor() {
    this.currentSpend = this.initializeDay();
  }

  private initializeDay(): DailySpend {
    const today = new Date().toISOString().split('T')[0];
    return {
      date: today,
      totalCost: 0,
      requestCount: 0,
    };
  }

  private checkAndResetDay(): void {
    const today = new Date().toISOString().split('T')[0];
    if (this.currentSpend.date !== today) {
      console.log(`[SpendTracker] Day reset. Previous: ${this.currentSpend.date}, Spent: $${this.currentSpend.totalCost.toFixed(2)}, Requests: ${this.currentSpend.requestCount}`);
      this.currentSpend = this.initializeDay();
    }
  }

  canMakeRequest(): { allowed: boolean; reason?: string; remaining?: number } {
    this.checkAndResetDay();

    if (this.currentSpend.totalCost >= this.DAILY_LIMIT) {
      const resetTime = new Date();
      resetTime.setUTCHours(24, 0, 0, 0);
      const hoursUntilReset = Math.ceil((resetTime.getTime() - Date.now()) / (1000 * 60 * 60));
      
      return {
        allowed: false,
        reason: `Daily AI budget limit reached ($${this.DAILY_LIMIT}). Resets in ${hoursUntilReset} hours.`,
      };
    }

    const remaining = this.DAILY_LIMIT - this.currentSpend.totalCost;
    return {
      allowed: true,
      remaining: Math.floor(remaining / this.COST_PER_REQUEST),
    };
  }

  trackRequest(): void {
    this.checkAndResetDay();
    
    this.currentSpend.totalCost += this.COST_PER_REQUEST;
    this.currentSpend.requestCount += 1;

    console.log(`[SpendTracker] Request tracked. Today: $${this.currentSpend.totalCost.toFixed(3)} (${this.currentSpend.requestCount} requests)`);

    // Alert if approaching limit
    if (this.currentSpend.totalCost >= this.WARNING_THRESHOLD && this.currentSpend.totalCost < this.WARNING_THRESHOLD + this.COST_PER_REQUEST) {
      console.warn(`[SpendTracker] WARNING: Approaching daily limit! $${this.currentSpend.totalCost.toFixed(2)}/$${this.DAILY_LIMIT}`);
      
      // Send Sentry alert
      captureError(new Error('Daily AI spend approaching limit'), {
        totalCost: this.currentSpend.totalCost,
        requestCount: this.currentSpend.requestCount,
        limit: this.DAILY_LIMIT,
        percentage: (this.currentSpend.totalCost / this.DAILY_LIMIT * 100).toFixed(1),
      });
    }

    // Alert if limit reached
    if (this.currentSpend.totalCost >= this.DAILY_LIMIT) {
      console.error(`[SpendTracker] LIMIT REACHED! $${this.currentSpend.totalCost.toFixed(2)}/$${this.DAILY_LIMIT}`);
      
      captureError(new Error('Daily AI spend limit reached'), {
        totalCost: this.currentSpend.totalCost,
        requestCount: this.currentSpend.requestCount,
        limit: this.DAILY_LIMIT,
      });
    }
  }

  getStats(): DailySpend & { limit: number; percentage: number } {
    this.checkAndResetDay();
    return {
      ...this.currentSpend,
      limit: this.DAILY_LIMIT,
      percentage: (this.currentSpend.totalCost / this.DAILY_LIMIT) * 100,
    };
  }
}

// Singleton instance
export const spendTracker = new SpendTracker();
