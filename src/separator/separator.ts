export class Separator {
  public static startingLine(name): string {
    return `┌────── ${name} ──────────────────────────────────────────────────────────────────────────────────────────────`
  }

  public static endingLine(): string {
    return `└─────────────────────────────────────────────────────────────────────────────────────────────────────────────`
  }

  public static newLine(): string {
    return ''
  }
}
