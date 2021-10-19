/**
 * 计算字符串的长度
 * @param {string} str 指定的字符串
 */
export const calcStrLen = function calcStrLen(str: string) {
  let len = 0;
  const textWidths = [];
  for (let i = 0; i < str.length; i++) {
    if (['i', '1', 'l', ':', '.'].includes(str.charAt(i))) {
      len += 0.5;
      textWidths.push(0.5);
    }
    if (str.charCodeAt(i) > 0 && str.charCodeAt(i) < 128) {
      len++;
      textWidths.push(1);
    } else {
      textWidths.push(2);
      len += 2;
    }
  }
  return { len, textWidths };
};
