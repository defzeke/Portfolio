"use client";


import StaggeredMenu from "@/components/StaggeredMenu";
import "../../../components/StaggeredMenu.css";
import Hero from "../../../components/sections/Hero";

const menuItems = [
  { label: "Home", link: "/" },
  { label: "Projects", link: "/projects" },
  { label: "Contact", link: "/contact" }
];

const socialItems = [
  { label: "GitHub", link: "https://github.com/defzeke" },
  { label: "LinkedIn", link: "https://linkedin.com/in/defzeke" }
];

export default function PortfolioPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#f8f8ff", position: "relative" }}>
      <StaggeredMenu
        items={menuItems}
        socialItems={socialItems}
        accentColor="#5227FF"
        position="right"
        displaySocials={true}
        displayItemNumbering={true}
        isFixed={true}
      />
      <div style={{ position: "relative", zIndex: 1 }}>
        <Hero />
      </div>
    </div>
  );
}
