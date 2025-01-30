import { generateUniqueId } from '../src/utils';

const menuItemsMock = [
  { name: 'Etendo Classic', component: 'ComponentA' },
  { name: 'Etendo Classic', component: 'ComponentB' }
];

describe('generateUniqueId Function Tests', () => {
  it('should assign unique IDs to sub-applications with identical names', () => {
    const uniqueIds = menuItemsMock.map(item => generateUniqueId(item.name));

    const uniqueSet = new Set(uniqueIds);
    expect(uniqueSet.size).toBe(uniqueIds.length);

    const duplicateExists = uniqueIds.some((id, index) => uniqueIds.indexOf(id) !== index);
    expect(duplicateExists).toBe(false);

    console.log("Generated IDs for identical names:", uniqueIds);
  });

  it('should assign unique IDs to sub-applications with different names', () => {
    const differentNamesMock = [
      { name: 'Etendo Classic', component: 'ComponentA' },
      { name: 'Etendo Advanced', component: 'ComponentB' }
    ];

    const uniqueIds = differentNamesMock.map(item => generateUniqueId(item.name));

    const uniqueSet = new Set(uniqueIds);
    expect(uniqueSet.size).toBe(uniqueIds.length);

    const duplicateExists = uniqueIds.some((id, index) => uniqueIds.indexOf(id) !== index);
    expect(duplicateExists).toBe(false);

    console.log("Generated IDs for different names:", uniqueIds);
  });

  it('should handle empty names correctly', () => {
    const emptyNameMock = [
      { name: '', component: 'ComponentA' },
      { name: '', component: 'ComponentB' }
    ];

    const uniqueIds = emptyNameMock.map(item => generateUniqueId(item.name));

    const uniqueSet = new Set(uniqueIds);
    expect(uniqueSet.size).toBe(uniqueIds.length);

    const duplicateExists = uniqueIds.some((id, index) => uniqueIds.indexOf(id) !== index);
    expect(duplicateExists).toBe(false);

    console.log("Generated IDs for empty names:", uniqueIds);
  });

  it('should handle names with spaces and special characters correctly', () => {
    const specialCharsMock = [
      { name: 'Etendo Classic 2025!', component: 'ComponentA' },
      { name: 'Etendo Classic 2025!', component: 'ComponentB' },
      { name: 'Etendo Classic 2025@', component: 'ComponentC' }
    ];

    const uniqueIds = specialCharsMock.map(item => generateUniqueId(item.name));

    const uniqueSet = new Set(uniqueIds);
    expect(uniqueSet.size).toBe(uniqueIds.length);

    const duplicateExists = uniqueIds.some((id, index) => uniqueIds.indexOf(id) !== index);
    expect(duplicateExists).toBe(false);

    console.log("Generated IDs for names with special characters:", uniqueIds);
  });

  it('should handle case sensitivity correctly', () => {
    const caseSensitiveMock = [
      { name: 'Etendo Classic', component: 'ComponentA' },
      { name: 'etendo classic', component: 'ComponentB' }
    ];

    const uniqueIds = caseSensitiveMock.map(item => generateUniqueId(item.name));

    const uniqueSet = new Set(uniqueIds);
    expect(uniqueSet.size).toBe(uniqueIds.length);

    const duplicateExists = uniqueIds.some((id, index) => uniqueIds.indexOf(id) !== index);
    expect(duplicateExists).toBe(false);

    console.log("Generated IDs for case-sensitive names:", uniqueIds);
  });
});