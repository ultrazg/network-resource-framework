import { PROVINCE_NAME } from '@alpha/constants';
/**
 * 数据简略
 * @param {number} value
 * @param {number} decDigit
 */
export function convertMeasure(
  value: number = NaN,
  decDigit: number = 2
): [number, string] {
  if (!Number.isFinite(value)) {
    return [value, ''];
  }
  const MEASURES = new Map([
    [100000000, '亿'],
    [10000, '万'],
  ]);
  for (const measureNum of MEASURES.keys()) {
    if (value > measureNum) {
      return [
        Number((value / measureNum).toFixed(decDigit)),
        MEASURES.get(measureNum) || '',
      ];
    }
  }
  return [value, ''];
}

/**
 * 进一步的数据简略，对于1000万，显示为0.1亿
 * @param {number} value
 * @param {number} decDigit
 */
export function convertMeasureMore(
  value: number = NaN,
  decDigit: number = 2
): [number, string] {
  if (!Number.isFinite(value)) {
    return [value, ''];
  }
  const MEASURES = new Map([
    [100000000, '亿'],
    [10000, '万'],
  ]);
  for (const measureNum of MEASURES.keys()) {
    if (value > measureNum / 10) {
      return [
        Number((value / measureNum).toFixed(decDigit)),
        MEASURES.get(measureNum) || '',
      ];
    }
  }
  return [value, ''];
}

export function convertBandwidthMeasure(
  value: number = NaN,
  decDigit: number = 2
): [number, string] {
  if (!Number.isFinite(value)) {
    return [value, ''];
  }
  const MEASURES = new Map([
    [1024 * 1024 * 1024, 'P'],
    [1024 * 1024, 'T'],
    [1024, 'G'],
    [1, 'M'],
  ]);
  for (const measureNum of MEASURES.keys()) {
    if (value >= measureNum) {
      return [
        Number((value / measureNum).toFixed(decDigit)),
        MEASURES.get(measureNum) || '',
      ];
    }
  }
  return [value, ''];
}

export function generateRadomNum() {
  const random = window.crypto.getRandomValues(new Uint8Array(1));

  return parseFloat(random.toString()) * 0.001;
}

export const getProvinceCodeByAdcode = (adcode: String | Number) => {
  const filter = PROVINCE_NAME.filter((item) => item.adcode == adcode);

  if (filter && filter.length) {
    return filter[0].code;
  }

  return '';
};

/**
 * 简化行政单位名称
 * @param {string} currentName
 */
export const simplifyProvinceName = (currentName: string) => {
  let name = currentName;
  if (currentName && currentName.length > 0) {
    const regionDict = [
      '省',
      '市',
      '区',
      '县',
      '地区',
      '自治州',
      '自治县',
      '自治州县',
    ];
    regionDict.forEach((word) => {
      if (currentName.includes(word))
        name = currentName.slice(0, currentName.indexOf(word));
    });
    if (
      currentName.includes('自治区') ||
      currentName.includes('香港') ||
      currentName.includes('澳门')
    ) {
      name = currentName.slice(0, 2);
    }
    if (currentName.includes('内蒙古')) {
      name = currentName.slice(0, 3);
    }
  }
  return name;
};
