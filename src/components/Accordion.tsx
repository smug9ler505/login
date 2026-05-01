import { useState } from "react";
import type { DataItem } from "../pages/home/Home";
import styles from "./Accordion.module.css";

interface ItemProps {
  item: DataItem;
}

export const AccordionItem: React.FC<ItemProps> = ({ item }) => {
  const [open, setOpen] = useState(false);

  const hasChildren = item.children_count;

  return (
    <div className={styles.item}>
      <div
        onClick={() => setOpen(!open)}
        className={hasChildren ? 'hasChildren' : ''}
        style={{
          fontWeight: hasChildren ? "bold" : "normal",
        }}
      >
        {hasChildren ? (open ? "▼ " : "▶ ") : null}
        {item.name}
      </div>

      {open && hasChildren ? (
        <>
          {item.children.map((child) => (
            <AccordionItem key={child.id} item={child} />
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
