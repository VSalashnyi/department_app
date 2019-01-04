export async function getDepartments () {
  const response = await fetch('http://www.mocky.io/v2/5c2ce2ee2e00004e06e877f1');
  const result = await response.json();
  return result;
}