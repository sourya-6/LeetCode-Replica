function mergeTwoLists(l1, l2) {
  let merged = [];
  let i = 0, j = 0;
  while (i < l1.length && j < l2.length) {
    if (l1[i] < l2[j]) {
      merged.push(l1[i++]);
    } else {
      merged.push(l2[j++]);
    }
  }
  return merged.concat(l1.slice(i)).concat(l2.slice(j));
}

function func(input) {
  const [l1, l2] = input;
  return mergeTwoLists(l1, l2);
}