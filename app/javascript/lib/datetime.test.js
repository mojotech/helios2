import { getMostRecentDay } from './datetime';

describe('#getMostRecentDay', () => {
  const today = new Date('Monday May 13, 2019');
  it('gets most recent Monday if today is Monday', () => {
    expect(getMostRecentDay('Monday', today)).toEqual('2019-05-13');
  });
  it('gets most recent Tuesday if today is Monday', () => {
    expect(getMostRecentDay('Tuesday', today)).toEqual('2019-05-07');
  });
});
