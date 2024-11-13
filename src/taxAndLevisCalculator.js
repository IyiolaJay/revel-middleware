// Helper function to calculate a percentage with fixed decimal precision
function calculateRoundedPercentage(value, percentage, precision = 2) {
  return parseFloat(((value * percentage) / 100).toFixed(precision));
}

export function calculateAllTaxesAndLeviesForAnItem(item = {}) {
  const { pure_sales: pureSales = 0 } = item;

  // Calculate levy amounts
  const levyAmountA = calculateRoundedPercentage(pureSales, 2.5);
  const levyAmountB = calculateRoundedPercentage(pureSales, 2.5);
  const levyAmountC = calculateRoundedPercentage(pureSales, 1.0);
  const levyAmountE = calculateRoundedPercentage(pureSales, 1.0);

  // Calculate total levies and VAT
  const allLevies = parseFloat((levyAmountA + levyAmountB + levyAmountC + levyAmountE).toFixed(2));
  const vatPerItem = calculateRoundedPercentage(pureSales + allLevies, 15.0);

  return {
    levyAmountA,
    levyAmountB,
    levyAmountC,
    levyAmountE,
    vatPerItem,
    allLevies,
    unitPrice: parseFloat((pureSales + allLevies + vatPerItem).toFixed(2)),
  };
}
