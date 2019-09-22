import dummyNameTemplate from "../data/dummyJpNameTemplate.json"

export interface NameAndKana {
  familyName: string,
  firstName: string,
  familyNameKana: string,
  firstNameKana: string
}

export default (): NameAndKana => {
  const dummyLength = dummyNameTemplate.length;
  const familyDummyIndex = Math.floor(Math.random() * (dummyLength - 1));
  const firstDummyIndex = Math.floor(Math.random() * (dummyLength - 1));
  return {
    familyName: dummyNameTemplate[familyDummyIndex].familyName,
    firstName: dummyNameTemplate[firstDummyIndex].firstName,
    familyNameKana: dummyNameTemplate[familyDummyIndex].familyNameKana,
    firstNameKana: dummyNameTemplate[firstDummyIndex].firstNameKana
  }
}