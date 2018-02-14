export default (participants) => {
  const formatted = [];
  participants.forEach((p) => {
    if (p.type === "bot") {
      formatted.push(`bot_${p.name.toLowerCase()}_${p.id}`);
    } else {
      formatted.push(p.username);
    }
  });
  return formatted;
};
