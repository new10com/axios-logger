export class Separator {
  public static startingLine(name: string): string {
    return `┌────── ${name} ──────────────────────────────────────────────────────────────────────────────────────────────`
  }

  public static endingLine(): string {
    return `└─────────────────────────────────────────────────────────────────────────────────────────────────────────────`
  }

  public static newLine(): string {
    return ''
  }
}
