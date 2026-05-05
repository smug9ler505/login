import { useState } from "react";
import type { DataItem } from "../pages/home/Home";
import styles from "./Accordion.module.css";

interface ItemProps {
  item: DataItem;
  marginLeft?: number;
}

export const AccordionItem: React.FC<ItemProps> = ({
  item,
  marginLeft = 0,
}) => {
  const [open, setOpen] = useState(false);

  const hasChildren = item.children_count;

  return (
    <div>
      <div
        onClick={() => setOpen(!open)}
        className={`${styles.item} ${hasChildren ? "hasChildren" : ""}`}
        style={{
          fontWeight: hasChildren ? "bold" : "normal",
          marginLeft: `${marginLeft}px`,
        }}
      >
        {hasChildren ? (open ? "▼ " : "▶ ") : null}
        {item.name}
      </div>

      {open && hasChildren ? (
        <>
          {item.children.map((child) => (
            <AccordionItem
              key={child.id}
              item={child}
              marginLeft={marginLeft + 16}
            />
          ))}
        </>
      ) : null}
    </div>
  );
};

interface RecursiveProps {
  data: DataItem[];
}

export const RecursiveAccordion: React.FC<RecursiveProps> = ({ data }) => {
  return (
    <div className={styles.accordion}>
      {data.map((item) => (
        <AccordionItem key={item.id} item={item} />
      ))}
    </div>
  );
};
