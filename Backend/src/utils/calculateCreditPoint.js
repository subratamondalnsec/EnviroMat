function calculateCredits(wasteType, quantity, qualityRating) {
  let baseRate = 2; // default points per kg

  switch (wasteType) {
    case "plastic":
      baseRate = 3;
      break;
    case "metal":
      baseRate = 5;
      break;
    case "organic":
      baseRate = 2;
      break;
    case "e_waste":
      baseRate = 6;
      break;
    case "glass":
      baseRate = 2;
      break;
    case "paper":
      baseRate = 1.5;
      break;
    case "textile":
      baseRate = 2;
      break;
    case "hazardous":
      baseRate = 8;
      break;
    case "mixed":
      baseRate = 1;
      break;
    default:
      baseRate = 1;
  }

  // Quality multiplier
  let multiplier = 1;
  if (qualityRating === "high") multiplier = 1.5;
  if (qualityRating === "low") multiplier = 0.8;

  return Math.floor(quantity * baseRate * multiplier);
}

module.exports = calculateCredits;
