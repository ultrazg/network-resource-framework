/**
 * 省份地市名字去掉“省”|“市”
 * @param {string} str
 */
export const replaceProvince = (str: string) => str && str.replace(/\s+|省|市/g, "")
/**
 * 省份地市名字简化
 * @param {string} name
 */
export const replaceProvinceName = (name: string) => {
    if (name == '内蒙古自治区') name = '内蒙古';
    else if (name == '广西自治区' || name === '广西壮族自治区')  name = '广西';
    else if (name == '新疆自治区' || name === '新疆维吾尔自治区')  name = '新疆';
    else if (name == '宁夏自治区' || name === '宁夏回族自治区')  name = '宁夏';
    else if (name == '西藏自治区')  name = '西藏';
    return replaceProvince(name);
  }
