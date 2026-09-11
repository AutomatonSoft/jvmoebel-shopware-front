export type CountdownParts = Readonly<{
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}>;

export function getCountdownParts(
  endsAt: string,
  now: number,
): CountdownParts | null {
  const remainingMilliseconds = Date.parse(endsAt) - now;

  if (!Number.isFinite(remainingMilliseconds) || remainingMilliseconds <= 0) {
    return null;
  }

  const totalSeconds = Math.ceil(remainingMilliseconds / 1000);
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function formatCountdownValue(parts: CountdownParts) {
  return [parts.days, parts.hours, parts.minutes, parts.seconds]
    .map(pad)
    .join(":");
}

export function formatCountdownLabel(parts: CountdownParts) {
  return `Nur noch ${parts.days} Tage, ${parts.hours} Stunden, ${parts.minutes} Minuten und ${parts.seconds} Sekunden`;
}
