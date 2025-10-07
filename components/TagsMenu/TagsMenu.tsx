"use client";

import Link from "next/link";
import css from "./TagsMenu.module.css";
import { useState, useEffect, useRef } from "react";
import { CATEGORIES } from "@/constants/categories";

export default function TagsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggle = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={css.menuContainer} ref={menuRef}>
      <button className={css.menuButton} onClick={toggle}>
        Notes ▾
      </button>
      {isOpen && (
        <ul className={css.menuList}>
          {CATEGORIES.map((category) => (
            <li key={category} className={css.menuItem}>
              <Link
                href={`/notes/filter/${category}`}
                className={css.menuLink}
                onClick={closeMenu}
              >
                {category === "All" ? "All notes" : category}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
