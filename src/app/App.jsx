import "./App.css";
import { useState } from "react";
import Header from "../components/layout/Header";
import Tabs from "../components/layout/Tabs";
import Pagereveal from "../components/ui/Pagereveal";
import GemaeldeGallery from "../features/galleries/GemaeldeGallery";
import FotografienGallery from "../features/galleries/FotografienGallery";
import AusstellungenGallery from "../features/galleries/AusstellungenGallery";
import Footer from "../components/layout/Footer";
import LanguageToggle from "../components/layout/LanguageToggle";

function App() {
  const [activeTab, setActiveTab] = useState("gemaelde");
  const [lang, setLang] = useState("de");

  return (
    <div>
      <div className="top">
        <LanguageToggle
          lang={lang}
          onToggle={() => setLang((v) => (v === "de" ? "en" : "de"))}
        />
        <Header />
        <Tabs activeTab={activeTab} onChangeTab={setActiveTab} lang={lang} />
      </div>
      <main className="main">
        {activeTab === "gemaelde" ? <GemaeldeGallery /> : null}
        {activeTab === "fotografien" ? <FotografienGallery /> : null}
        {activeTab === "ausstellungen" ? <AusstellungenGallery /> : null}
      </main>
      <Footer lang={lang} />
      <Pagereveal lang={lang} />
    </div>
  );
}

export default App;
