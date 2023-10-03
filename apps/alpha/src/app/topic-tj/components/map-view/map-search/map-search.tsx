import css from './map-search.module.scss';
import { Form, Input, Select, Col, Row } from 'antd';
import { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { Button } from 'antd';
import CityPicker, {
  OptionObj,
} from '@alpha/app/topic-tj/components/map-view/city-picker/city-picker';

const { Option } = Select;

/* eslint-disable-next-line */
interface Options {
  label?: string;
  name?: string;
  id?: string;
  value: string | number;
  children?: Options[];
  [propName: string]: any
}

export interface FormItem {
  props: string;
  formType: string;
  label?: string;
  span?: number;
  labelCol?: {
    span: number;
    offset: number;
  };
  districtList?: any;
  // 搜索框前的选项
  searchType?: any;
  placeholder?: string;
  mode?: 'multiple' | 'tags';
  options?: Options[];
}

export interface MapSearchProps {
  formItems: FormItem[];
  defaultValue: any;
  formOptions?: any;

  handleSearch: (form: any) => void;
  handleChange?: (form: any) => void;
  handleReset?: () => void;
  handleChangePlace?: (form: any) => void;
  handleSearchMore?: (searchMore: any) => void;
}

const handleSelectBefore = (formItem: any, form: any, onchangeSelect: any) => (
  <Select
    style={{ width: 100 }}
    defaultValue={formItem.searchType && form[formItem.searchType.props]}
    getPopupContainer={(triggerNode) => triggerNode.parentElement}
    onChange={(e) => onchangeSelect(e, formItem.searchType.props)}
  >
    {formItem.searchType.options.map((optionItem: Options) => (
      <Option
        value={optionItem.value}
        key={optionItem.label || optionItem.name}
      >
        {optionItem.label || optionItem.name}
      </Option>
    ))}
  </Select>
);

const inputSearchItems = ({
  props,
  searchMore,
  formItem,
  form,
  inputSearchValue,
  onchangeSelect,
  onchangeInputSearch,
  handleSearch,
  handleMore,
}: any) => {
  return (
  <div className={css['inputSearch']}>
    <Input
      addonBefore={
        formItem.searchType && handleSelectBefore(formItem, form, onchangeSelect)
      }
      value={inputSearchValue[formItem.props]}
      onChange={(e) => onchangeInputSearch(e, formItem.props)}
      onPressEnter={(e: any) => {
        handleSearch();
      }}
      allowClear
      placeholder={formItem.placeholder || "请输入"}
    ></Input>
    {props.formOptions.showMoreBtn!==false && <MoreButton handleMore={handleMore} searchMore={searchMore} />}
  </div>
  )
}

const selectItems = (
  props: MapSearchProps,
  form: any,
  formItem: any,
  onchangeSelect: any
) => {
  return (
    <Select
      mode={formItem.mode || undefined}
      className={css['areaSelect']}
      placeholder={formItem.placeholder || '请选择选项'}
      allowClear
      value={form[formItem.props]}
      defaultValue={props.defaultValue[formItem.props]}
      getPopupContainer={(triggerNode) => triggerNode.parentElement}
      onChange={(e) => onchangeSelect(e, formItem.props)}
    >
      {(formItem.options || []).map((optionItem: Options) => {
        return (
          <Option
            value={optionItem.value || optionItem.id}
            key={optionItem.label || optionItem.name}
          >
            {optionItem.label || optionItem.name}
          </Option>
        );
      })}
    </Select>
  );
};

const inputItems = (formItem: any, form: any, onchangeInput: any) => {
  return (
    <Input
      className={css['inputItem']}
      onChange={(e) => {
        form[formItem.props] = e.target.value;
      }}
      placeholder={formItem.placeholder || '请输入'}
    ></Input>
  );
};

const ResetButton = (props: { handleReset: Function }) => {
  return (
    <button onClick={() => props.handleReset()} className={css['rBtn']}>
      <em className="tj-iconfont icon-zhongzhi"></em>
      重置
    </button>
  )
}

const MoreButton = (props: {
  handleMore: Function,
  searchMore: boolean;
}) => {
  return (
    <button
    onClick={() => props.handleMore()}
    className={css['mBtn']}>
      {props.searchMore ? '收起筛选' : '更多筛选'}
    </button>
  )
}

export const ListMoreButton = (props: {
  handleListMore: Function,
  searchListMore: boolean;
}) => {
  return (
    <div
    onClick={() => props.handleListMore()}
    className={css['listMBtn']}>
      <span>{props.searchListMore ? '收起' : '展开'}</span>
      <em
        className={`tj-iconfont ${props.searchListMore ? 'icon-shangjiantou' : 'icon-xiajiantou'}`}
      />
    </div>
  )
}

const SearchBtnItems = (props: {
  handleSearch: () => void;
  handleReset: () => void;
}) => {
  return (
    <div className={`SearchBtnItems ${css['btnBox']}`}>
    <Button className={css['searchBtn']} onClick={props.handleSearch}>查询</Button>
    <Button className={css['resetBtn']} onClick={props.handleReset}>重置</Button>
</div>
  )
}

export function MapSearch(props: MapSearchProps, ref?: any) {
  const [oldForm, setOldForm] = useState(props.defaultValue || {});
  const [form, setForm] = useState(props.defaultValue || {});
  const [inputSearchValue, setInputSearchValue] = useState({});
  const [antdForm] = Form.useForm();
  const [formItems, setFormItems] = useState(props.formItems || []);
  const [searchMore, setSearchMore] = useState(props.formOptions.searchMore || false);
  const [placeSelected, setPlaceSelected] = useState<OptionObj[]>([
    {
      name: '',
      id: '',
    },
    {
      name: '',
      id: '',
    },
    {
      name: '',
      id: '',
    },
  ]);
  useImperativeHandle(ref, () => ({
    handleFields: (e: any) => {
      handleFields(e);
    },
    onchangeSelect: (e: any, name: string) => {
      onchangeSelect(e, name);
    },
    onSearchDefault: (parames: any) => {
      setForm(parames);
    },
    setPlaceSelected: (parames: any) => {
      onchangeCityPicker(parames);
    },
    handleSearch: () => {
      handleSearch();
    },
  }));

  const onchangeInputSearch = (e: any, name: string) => {
    setInputSearchValue({
      [name]: e.target.value,
    });
  };
  const onchangeInput = (e: any, name: string) => {
    setForm({
      ...form,
      [name]: e.target.value,
    });
  };
  const onchangeCityPicker = (e: any) => {
    setPlaceSelected(e);
    // setForm({
    //   ...form,
    //   [name]: e
    // })
  };
  const onchangeSelect = (e: any, name: string) => {
    setForm({
      ...form,
      [name]: e,
    });
    antdForm.setFieldValue(name, e);
  };
  const handleFields = (fields: any[] = []) => {
    if (fields.length > 0) {
      antdForm.resetFields(fields);
    } else {
      antdForm.resetFields();
    }
  };

  const handleReset = () => {
    setForm(props.defaultValue || {});
    handleFields();
    if (typeof props.handleReset === 'function') {
      props.handleReset();
    }
  };
  const handleSearch = () => {
    const values = antdForm.getFieldsValue();
    props.handleSearch({ ...values, ...inputSearchValue });
  };
  const onFieldsChange = (changedFields: any, allFields: any) => {
    // // console.log('changedFields, allFields', changedFields, allFields)
  };
  const onValuesChange = (changedValues: any, allValues: any) => {
    // // console.log('onValuesChange', changedValues, allValues)
  }
  const handleMore = () => {
    setSearchMore(!searchMore)
  }
  useEffect(() => {
    props.handleSearchMore && props.handleSearchMore(searchMore)
  }, [searchMore])
  useEffect(() => {
    setFormItems(props.formItems);
    const inputSearchIndex = props.formItems.findIndex(
      (item) => item.formType === 'inputSearch'
    );
    if (inputSearchIndex > -1) {
      setInputSearchValue({
        [props.formItems[inputSearchIndex].props]:
          form[props.formItems[inputSearchIndex].props],
      });
    }
  }, [props.formItems]);
  useEffect(() => {
    const currentForm = { ...form, ...inputSearchValue };
    // console.log('currentForm', currentForm, JSON.stringify(currentForm) !== JSON.stringify(oldForm))
    if (JSON.stringify(currentForm) !== JSON.stringify(oldForm)) {
      props.handleChange && props.handleChange(currentForm);
      setOldForm(currentForm);
    }
  }, [form]);
  useEffect(() => {
    if(placeSelected[0].name) {
      props.handleChangePlace && props.handleChangePlace(placeSelected)
    }
  }, [placeSelected]);
  return (
    <div className={`mapSearchContainer ${css['container']}`}>
     <Form
      form={antdForm}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 24 }}
      onFieldsChange={onFieldsChange}
      onValuesChange={onValuesChange}
    >
      <Row gutter={props.formOptions.gutter || 20}>
        {
          formItems.map((formItem, formIndex) => {
            if(!searchMore && formIndex > 1) return
            return (
            <Col span={formItem.span || 12} key={formItem.props}>
              <Form.Item name={formItem.props} label={formItem.label || ''}>
                <div>
                  {
                    formItem.formType === 'inputSearch' && inputSearchItems({
                      props,
                      searchMore,
                      formItem,
                      form,
                      inputSearchValue,
                      onchangeSelect,
                      onchangeInputSearch,
                      handleSearch,
                      handleMore
                    })
                  }
                  {formItem.formType === 'input' && inputItems(formItem, form, onchangeInput)}
                  {formItem.formType === 'select' && selectItems(props, form, formItem, onchangeSelect)}
                  {formItem.formType === 'cityPicker' && <CityPicker
                    data={formItem.districtList || []}
                    userPicker={placeSelected || []}
                    setUserPicker={(item: any) => onchangeCityPicker(item)}
                    style={{ width: '100%' }}
                  ></CityPicker>}
                </div>
              </Form.Item>
            </Col>);
          })
        }
        {props.formOptions.showResetBtn!==false && <ResetButton handleReset={handleReset}/>}
        {props.formOptions.showSearchBtn && (
           <div className={`SearchBtnItemsContaine ${css['SearchBtnItemsContaine']}`}>
            <SearchBtnItems handleSearch={handleSearch} handleReset={handleReset}/>
            {props.formOptions?.showSearchOtherBtn && props.formOptions?.showSearchOtherBtn()}
          </div>
          )}
        {props.formOptions.btnDom && props.formOptions.btnDom()}
      </Row>
    </Form>
 </div>
  );
}

export default forwardRef(MapSearch);
