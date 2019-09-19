import Dummy from 'dummy-jp';

const dummy = new Dummy();

export default (): string => {
  return dummy.generate()
}