import defaultTimezones from "timezones.json";

const utcs = defaultTimezones.map((tz) => tz.utc);
// We do not want the `Etc/*` timezones as they are redundant with the others
// (I think).
const timezones = [].concat(...utcs).filter((t) => !t.startsWith("Etc"));
timezones.sort();

export default [...new Set(timezones)];
