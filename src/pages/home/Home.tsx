import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/UseAuth";
import { RecursiveAccordion } from "../../components/Accordion";
import styles from "./Home.module.css";

export interface DataItem {
  children: DataItem[];
  name: string;
  id: string;
  children_count: 3;
}

export const Home = () => {
  const [categories, setCategories] = useState<DataItem[] | null>(null);
  const { logout } = useAuth();

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await fetch(
        `${import.meta.env.VITE_API_BASE}/getcategories/0/`,
      ).then((val) => val.json());
      setCategories(data);
    };
    fetchCategories();
  }, []);
  return (
    <div className={styles.homeContainer}>
      {categories ? <RecursiveAccordion data={categories} /> : <p>No Data</p>}
      <button className={styles.logout} onClick={() => logout()}>
        Logout
      </button>
    </div>
  );
};
