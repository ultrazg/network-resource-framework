import css from './column.module.scss';

export interface columnProps {
  color: string;
}

export function Column(props: columnProps) {
  return (
    <span
      className={`${css[`column`]}`}
      style={{
        backgroundColor: `${props.color}`,
      }}
    >
      <div
        style={{
          backgroundImage: `linear-gradient(to bottom, ${props.color}, #0000)`,
        }}
      ></div>
    </span>
  );
}
