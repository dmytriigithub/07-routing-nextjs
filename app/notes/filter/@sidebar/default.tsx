import Link from "next/link";
import css from "./SidebarNotes.module.css";
import { CATEGORIES } from "@/constants/categories";

const SidebarNotes = () => {
  return (
    <ul className={css.menuList}>
      {CATEGORIES.map((category) => (
        <li key={category} className={css.menuItem}>
          <Link href={`/notes/filter/${category}`} className={css.menuLink}>
            {category === "All" ? "All notes" : category}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default SidebarNotes;
