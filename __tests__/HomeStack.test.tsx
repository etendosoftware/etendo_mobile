import { generateUniqueId } from '../src/utils';

const menuItemsMock = [
  { name: 'Etendo Classic', component: 'ComponentA' },
  { name: 'Etendo Classic', component: 'ComponentB' }
];

describe('Duplicate Sub-Application Names Test', () => {
  it('should assign unique IDs to sub-applications with identical names', () => {
    const uniqueIds = menuItemsMock.map(item => generateUniqueId(item.name));

    const uniqueSet = new Set(uniqueIds);
    expect(uniqueSet.size).toBe(uniqueIds.length);

    const duplicateExists = uniqueIds.some((id, index) => uniqueIds.indexOf(id) !== index);
    expect(duplicateExists).toBe(false);

    console.log("Generated IDs for identical names:", uniqueIds);
  });
});
