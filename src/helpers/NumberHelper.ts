export function shortenNumber(number) {
  const suffixes = ["", "k", "M", "B", "T"];
  const magnitude = Math.floor(Math.log10(number) / 3);
  const suffix = suffixes[magnitude];
  const shortened = (number / 10 ** (magnitude * 3)).toFixed(1);
  return String(shortened) + suffix;
}
