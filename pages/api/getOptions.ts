import { reduce } from "lodash";

export default (optionsStr: string) => {
  const optionsArr = ('___type___ ' + optionsStr).split('--');
  return reduce(optionsArr,(result, option)=>{
    let optionKeyVal = option.split(' ');
    result[optionKeyVal[0]] = optionKeyVal[1]
    return result
  }, {})
}