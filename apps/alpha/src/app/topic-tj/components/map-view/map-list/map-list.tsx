import { useRef, useImperativeHandle,forwardRef, useState, useEffect, useCallback } from 'react';
import { ConfigProvider, Pagination } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import { FormItem } from '../map-search/map-search';
import css from './map-list.module.scss';

// 引入地图插件
import MapSearch, { ListMoreButton } from '../map-search/map-search';
import recoveryImg from './assets/recovery.png';
import { SpinConten } from '@alpha/app/topic-tj/components/spin/spin';

interface FormOptionsProps {
    gutter?: number,
    showResetBtn?: boolean,
}

export interface PageSizeProps {
  total: number,
  pageNo: number,
  pageSize: number,
  onChange?: (page: any, pageSize: number) => void
}
export const PaginationView = (props: { pageSize: PageSizeProps }) => {
  const pageSize = props.pageSize;
  return (
    <ConfigProvider locale={zhCN}>
      <Pagination
        className={css['pagination']}
        size="small"
        showSizeChanger
        defaultCurrent={1}
        current={pageSize.pageNo}
        total={pageSize.total}
        pageSize={pageSize.pageSize}
        onChange={pageSize.onChange}
      />
    </ConfigProvider>
  )
}

const mapListItems = (props: any) => {
  const { pageSize } = props;
  const mapListItemsRef = useRef<any>();
  const mapListDomRef = useCallback((ref) => {
    if (ref !== null) {
      mapListItemsRef.current = ref;
      // 找到选中的节点index，并拿到高度
      const itemIndex = props.listItem.findIndex((item: any) => item.key === item.props.activeId)
      if(itemIndex > -1 && props.listItem[itemIndex].props['height']) {
        ref.scrollTop = props.listItem[itemIndex].props['height'] * itemIndex;
      }
    }
  }, [props.listItem]);
  if(!props.listItem) return null
  return (
    <div className={`list ${css['list']} ${!props.isShow && css['hideOther']}`}>

      {/* 显示总数 */}
      {props.searchOver && <div className={css['countRoom']}>加载中...</div>}
      {!props.searchOver && <div className={css['countRoom']}>{`${pageSize ? '共计' + pageSize.total + '条数据' : '数据列表'}`}</div>}

      {/* 列表数据展示 */}
      <SpinConten className={`thirdPartyList ${css['listContent']} ${css['myScrollbar']}`} loading={props.searchOver} noData={props.listItem.length === 0} ref={mapListDomRef}>
        {/* 每个列表单元 */}
        {props.listItem}
      </SpinConten>
      {/* 翻页功能 */}

      {
        pageSize && <PaginationView pageSize={pageSize} />
      }
  </div>
  )
}
/* eslint-disable-next-line */
interface ListSearch {
    formOptions?: FormOptionsProps;
    formItems: FormItem[];
    defaultValue: any;
    handleSearch: (form: any) => void;
    handleChange?: (form: any) => void;
    handleReset?: () => void;
    handleChangePlace?: (form: any) => void;
    handleListMore?: () => void;
}
export interface MapListProps {
  isShow: boolean;
  searchOver: boolean;
  recoveryShow?: boolean;
  handleRecovery?: (recovery: boolean) => void;
  formSearchOptions?: any;
  listItem: any[] | boolean;
  listSearch?: ListSearch;
  pageSize?: PageSizeProps
  render?: Function
}

export function MapList(props: MapListProps, ref?:any) {
    const { listSearch } = props;
    const mapSearchRef = useRef()
    const [recoveryHide, setRecoveryHide] = useState<boolean>(false)
    const [searchMore, setSearchMore] = useState<boolean>(false)
    useImperativeHandle(ref,()=>({
      onSearchFields:(e: any)=>{onSearchFields(e)},
      onSearchDefault:(e: any)=>{onSearchDefault(e)},
      setPlaceSelected:(e: any)=>{setPlaceSelected(e)},
    }))
    const onSearchFields = (e: any) => {
      const currentRef = (mapSearchRef && mapSearchRef.current) as any;
      currentRef.handleFields && currentRef.handleFields(e)
    }
    const onSearchDefault = (e: any) => {
      const currentRef = (mapSearchRef && mapSearchRef.current) as any;
      currentRef.onSearchDefault && currentRef.onSearchDefault(e)
    }
    const setPlaceSelected = (e: any) => {
      const currentRef = (mapSearchRef && mapSearchRef.current) as any;
      currentRef.setPlaceSelected && currentRef.setPlaceSelected(e)
    }
    // 点击收缩按钮
    const handleRecovery = () => {
      setRecoveryHide(!recoveryHide)
    }
    useEffect(() => {
      props.handleRecovery && props.handleRecovery(recoveryHide)
    }, [recoveryHide])
  return (
      <div
        className={`resourceGraphList ${css['resourceGraphList']} ${(!props.isShow || recoveryHide) && css['hideList']} ${!searchMore && 'searchMore'} ${props.listItem && css['listItemShow']}`}
      >
        {props.recoveryShow && <div
        className={`${css['recovery']} ${recoveryHide && css['recoveryHide']}`}
        onClick={handleRecovery}>
          <img src={recoveryImg} />
        </div>}
        {/* 搜索框 */}
        {listSearch && <MapSearch
            ref={mapSearchRef}
            // formOptions={{
            //     gutter: 20,
            // }}
            formOptions={listSearch.formOptions || {
                gutter: 20,
                showSearchBtn: true,
                showSearchOtherBtn: () => <ListMoreButton
                handleListMore={() => listSearch.handleListMore && listSearch.handleListMore()} searchListMore={props.formSearchOptions && props.formSearchOptions.searchListMore} />,
                ...props.formSearchOptions
            }}
            formItems={listSearch.formItems}
            defaultValue={listSearch.defaultValue}
            handleSearch={listSearch.handleSearch}
            handleReset={listSearch.handleReset}
            handleChange={listSearch.handleChange}
            handleChangePlace={listSearch.handleChangePlace}
            handleSearchMore={(more) => setSearchMore(more)}
        />}
        {mapListItems(props)}
        { props.render && props.render()}
    </div>
  );
}

export default forwardRef(MapList);
