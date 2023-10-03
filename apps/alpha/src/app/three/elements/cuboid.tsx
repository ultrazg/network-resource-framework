import css from './cuboid.module.scss';

export interface cuboidProps {
  color: string;
}

export function Cuboid(props: cuboidProps) {
  return (
    <div className={css['cuboid']}>
      <div className={css['top']} style={{ background: props.color }}></div>
      <div
        className={css['cube']}
        style={{
          backgroundImage: `linear-gradient(180deg, ${props.color} 0%, rgba(2, 22, 58, 0) 100%)`,
        }}
      ></div>
      <div
        className={css['cube-right']}
        style={{
          backgroundImage: `linear-gradient(180deg, ${props.color} 0%, rgba(2, 22, 58, 0) 100%)`,
        }}
      ></div>
    </div>
  );
}
