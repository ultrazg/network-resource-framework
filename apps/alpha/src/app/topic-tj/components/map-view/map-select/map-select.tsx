import { useImperativeHandle, forwardRef } from "react"
import css from './map-select.module.scss';
import { useDispatch } from 'react-redux';
import { setMapSelectTopic } from '@alpha/app/redux/map.slice';

/* eslint-disable-next-line */
interface TopicItem {
  value: number;
  label: string;
  icon?: string;
}

export interface MapSelectProps {
  topicList: TopicItem[];
  topic: number;
  handleSelect?: Function,
  ref?: any
}

export let MapSelect: any = (props: MapSelectProps, ref: any) => {
  const dispatch = useDispatch();

  const setTopic = (item: TopicItem) => {
    if(props.topic === item.value) return;
    dispatch(setMapSelectTopic(item.value));
    props.handleSelect && props.handleSelect(item.value);
  };
  useImperativeHandle(ref, () => ({ // 暴露给父组件的方法
    changeTopic: (item: TopicItem) => {
      setTopic(item)
    }
 }))
  return (
    <div className={css['sand_topic_box']}>
      <div className={css['current_topic']}>
        <div className={css['content_box']}>
          {props.topicList.map((item: TopicItem) => {
            return (
              <span
                key={item.label}
                className={`${css['title']} ${
                  props.topic === item.value ? css['active'] : ''
                }`}
                onClick={() => setTopic(item)}
              >
                <em className={`tj-iconfont icon-${item.icon}`} />
                <span>{item.label}</span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

MapSelect = forwardRef(MapSelect)
export default MapSelect;
