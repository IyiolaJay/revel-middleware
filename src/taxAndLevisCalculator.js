export function calculatePercentage(valuePrice, percentage) {
  return (valuePrice * percentage) / 100;
}

function getDecimalPlaces(number) {
  const decimalPart = number.toString().split(".")[1];
  return decimalPart ? decimalPart.length : 0;
}

// Round to match the decimal places of the target value
export function roundToTargetPrecision(value, target = 0.11) {
  const decimalPlaces = getDecimalPlaces(target);
  return parseFloat(value.toFixed(decimalPlaces));
}

export function calculateAllTaxesAndLeviesForAnItem(item = {}) {
  const levyAmountA = calculatePercentage(item.pure_sales, 2.5);
  const levyAmountB = calculatePercentage(item.pure_sales, 2.5);
  const levyAmountC = calculatePercentage(item.pure_sales, 1);
  const levyAmountE = calculatePercentage(item.pure_sales, 1);
  const VAT = calculatePercentage(item.pure_sales, 16);

  const allLevies = levyAmountA + levyAmountB + levyAmountC + levyAmountE;
  const allDues = VAT + allLevies

  return {
    levyAmountA : roundToTargetPrecision(levyAmountA),
    levyAmountB: roundToTargetPrecision(levyAmountB),
    levyAmountC: roundToTargetPrecision(levyAmountC),
    levyAmountE: roundToTargetPrecision(levyAmountE),
    VAT,
    allDues : roundToTargetPrecision(allDues, item.tax_amount),
  };
}
