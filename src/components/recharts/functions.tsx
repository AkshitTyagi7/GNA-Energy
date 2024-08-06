export function FormatChartData(
  // aggregationKeys: string[],
  // groupBy: string[],
  // keys: string[],
  // priceKey: string,
  // volumeKey: string,
  // data: Array<Record<string, any>>
  {
    aggregationKeys,
    groupBy,
    keys,
    priceKey,
    volumeKey,
    data,
  }: {
    aggregationKeys: string[];
    groupBy: string[];
    keys: string[];
    priceKey: string;
    volumeKey: string;
    data: Array<Record<string, any>>;
  }
): {
  keys: string[];
  unit_keys: string[];
  group_by: Record<string, any[]>;
  data: Array<Record<string, any>>;
} {
  const keyData: Record<string, Record<string, any>> = {};
  const distinctGroupCombinations: string[] = [];
  const groupByKey: Record<string, any[]> = {};

  const units: string[] = [priceKey, volumeKey, ...aggregationKeys];

  for (const d of data) {
    const groupKey: string = groupBy.map((key) => String(d[key])).join("_");
    for (const key of groupBy) {
      if (!(key in groupByKey)) {
        groupByKey[key] = [];
      }
      if (!groupByKey[key].includes(d[key])) {
        groupByKey[key].push(d[key]);
      }
    }
    if (!distinctGroupCombinations.includes(groupKey)) {
      distinctGroupCombinations.push(groupKey);
    }
  }

  for (const d of data) {
    const key: string = keys.map((k) => String(d[k])).join("_");
    const groupKey: string = groupBy.map((g) => String(d[g])).join("_");

    if (!(key in keyData)) {
      keyData[key] = keys.reduce((acc, k) => {
        acc[k] = d[k];
        return acc;
      }, {} as Record<string, any>);

      for (const group of distinctGroupCombinations) {
        keyData[key][`${group}_${volumeKey}`] = 0;
        keyData[key][`${group}_${priceKey}`] = 0;
        for (const agg of aggregationKeys) {
          keyData[key][`${group}_${agg}`] = 0;
        }
      }
    }

    for (const agg of aggregationKeys) {
      if (d[agg] !== null && !(typeof d[agg] === "number" && isNaN(d[agg]))) {
        keyData[key][`${groupKey}_${agg}`] += d[agg];
      }
    }
    if (
      d[volumeKey] !== null &&
      !(typeof d[volumeKey] === "number" && isNaN(d[volumeKey]))
    ) {
      keyData[key][`${groupKey}_${volumeKey}`] += d[volumeKey];
      if (
        d[priceKey] !== null &&
        !(typeof d[priceKey] === "number" && isNaN(d[priceKey]))
      ) {
        keyData[key][`${groupKey}_${priceKey}`] += d[priceKey] * d[volumeKey];
      }
    }
  }

  const finalRes: Array<Record<string, any>> = [];
  for (const key in keyData) {
    const res = keyData[key];
    for (const group of distinctGroupCombinations) {
      if (res[`${group}_${volumeKey}`] > 0) {
        res[`${group}_${priceKey}`] =
          res[`${group}_${priceKey}`] / res[`${group}_${volumeKey}`];
      }
    }
    finalRes.push(res);
  }

  return {
    keys: distinctGroupCombinations,
    unit_keys: units,
    group_by: groupByKey,
    data: finalRes,
  };
}
