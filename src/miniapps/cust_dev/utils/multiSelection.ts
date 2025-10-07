// Логика выбора для MULTI (вынесена для тестируемости)
export function applyMultiSelection({
  current,
  option,
  checked,
  maxSelect,
  exclusiveOptions,
}: {
  current: string[] | undefined;
  option: string;
  checked: boolean;
  maxSelect?: number;
  exclusiveOptions?: string[];
}) {
  let arr = Array.isArray(current) ? [...current] : [];
  const isExclusive = exclusiveOptions?.includes?.(option);

  if (checked) {
    if (isExclusive) {
      arr = [option];
    } else {
      // если выбран эксклюзив раньше — убираем
      if (arr.some((x) => exclusiveOptions?.includes?.(x))) {
        arr = arr.filter((x) => !exclusiveOptions?.includes?.(x));
      }
      // добавляем, если не превышаем лимит и ещё не выбран
      if (!arr.includes(option) && (!maxSelect || arr.length < maxSelect)) {
        arr.push(option);
      }
    }
  } else {
    const idx = arr.indexOf(option);
    if (idx >= 0) arr.splice(idx, 1);
  }

  return arr;
}

// Простейшие тесты (консольные) для логики MULTI
export function runSanityTests() {
  // 1) эксклюзивная опция заменяет все остальные
  let res = applyMultiSelection({ current: ["A", "B"], option: "Не готов платить", checked: true, exclusiveOptions: ["Не готов платить"], maxSelect: 3 });
  console.assert(res.length === 1 && res[0] === "Не готов платить", "exclusive should replace all");

  // 2) выбор обычной опции снимает эксклюзивную
  res = applyMultiSelection({ current: ["Не готов платить"], option: "Рост продаж", checked: true, exclusiveOptions: ["Не готов платить"], maxSelect: 3 });
  console.assert(!res.includes("Не готов платить") && res.includes("Рост продаж"), "non-exclusive should clear exclusive");

  // 3) ограничение maxSelect
  res = ["A", "B", "C"];
  res = applyMultiSelection({ current: res, option: "D", checked: true, maxSelect: 3 });
  console.assert(res.length === 3 && !res.includes("D"), "should not exceed maxSelect");

  // 4) снятие галочки
  res = applyMultiSelection({ current: ["A", "B"], option: "A", checked: false, maxSelect: 3 });
  console.assert(res.length === 1 && res[0] === "B", "uncheck should remove option");
}
