export enum TimeUnit {
  SECONDS = "seconds",
  MINUTES = "minutes",
  HOURS = "hours",
}

export enum MillisecondsConversion {
  FROM_SECONDS = 1000,
  FROM_MINUTES = 60 * 1000,
  FROM_HOURS = 60 * 60 * 1000,
}

export class Timestamp {
  private ts = Date.now();

  public isExpired(t: number, unit: TimeUnit = TimeUnit.SECONDS) {
    const now = Date.now();
    if (unit === TimeUnit.SECONDS) {
      const expiryTime = (now - t * MillisecondsConversion.FROM_SECONDS);
      return this.ts < expiryTime;
    } if (unit === TimeUnit.MINUTES) {
      return this.ts < (now - t * MillisecondsConversion.FROM_MINUTES);
    }
    return this.ts < (now - t * MillisecondsConversion.FROM_HOURS);
  }

  public isValid(t: number, unit: TimeUnit = TimeUnit.SECONDS) {
    return !this.isExpired(t, unit);
  }
}
