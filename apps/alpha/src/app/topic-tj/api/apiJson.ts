
function fetchStatesCodeList(): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const json = require('./json/jfCodeProvince.json')
    resolve(json)
  })
}
// 省市区选择器列表，匹配联通地图信息，只请求一次就可以
import {
  OptionObj,
} from '@alpha/app/topic-tj/components/map-view/city-picker/city-picker';
const getCityCode = () => {
  return new Promise((resolve, reject) => {
    fetchStatesCodeList().then((res: any) => {
      const provinceList = res;
      const data: OptionObj[] = [];
      for (let province of provinceList) {
        data.push({
          name: province.text,
          id: province.value,
          children: province.children.map((city: any) => ({
            name: city.text,
            id: city.value,
            children: [
              {
                name: '全市',
                id: '',
              },
            ].concat(
              city.children.map((district: any) => ({
                name: district.text,
                id: district.value,
              }))
            ),
          })),
        });
      }
      resolve(data)
    });
  })
}

export {
    fetchStatesCodeList,
    getCityCode
}