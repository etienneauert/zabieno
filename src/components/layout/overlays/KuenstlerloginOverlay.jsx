import { useState } from "react";
import styles from "../Footer.module.css";
import overlayStyles from "./KuenstlerloginOverlay.module.css";
import OverlayShell from "./OverlayShell";
import AdminGallery from "../../admin/AdminGallery";
import { verifyPassword } from "../../../utils/passwordHash";

export default function KuenstlerloginOverlay({
  lang = "de",
  setIsEditMode,
}) {
  const isEn = lang === "en";
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Der gespeicherte Hash des Passworts (aus .env)
  const storedPasswordHash = import.meta.env.VITE_ARTIST_PASSWORD_HASH;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const isValid = await verifyPassword(password, storedPasswordHash);
      
      if (isValid) {
        setIsAuthenticated(true);
        setPassword("");
      } else {
        setError(isEn ? "Incorrect password" : "Falsches Passwort");
        setPassword("");
      }
    } catch (err) {
      setError(isEn ? "An error occurred" : "Ein Fehler ist aufgetreten");
      console.error("Password verification error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (tabId) => {
    setSelectedCategory(tabId);
    if (setIsEditMode) {
      setIsEditMode(true);
    }
  };

  const handleBack = () => {
    setSelectedCategory(null);
  };

  if (isAuthenticated && selectedCategory) {
    return (
      <OverlayShell>
        <div className={overlayStyles.adminContainer}>
          <button
            type="button"
            onClick={handleBack}
            className={overlayStyles.backButton}
          >
            {isEn ? "← Back" : "← Zurück"}
          </button>
          <AdminGallery category={selectedCategory} lang={lang} />
        </div>
      </OverlayShell>
    );
  }

  if (isAuthenticated) {
    return (
      <OverlayShell>
        <div className={overlayStyles.container}>
          <div className={styles.overlayHeading}>
            {isEn ? "Select the area to be edited" : "Wählen Sie den Bereich aus der bearbeitet werden soll"}
          </div>
          <div className={overlayStyles.buttonGroup}>
            <button
              type="button"
              onClick={() => handleTabChange("gemaelde")}
              className={overlayStyles.tabButton}
            >
              {isEn ? "Paintings" : "Gemälde"}
            </button>
            <button
              type="button"
              onClick={() => handleTabChange("fotografien")}
              className={overlayStyles.tabButton}
            >
              {isEn ? "Photography" : "Fotografien"}
            </button>
            <button
              type="button"
              onClick={() => handleTabChange("ausstellungen")}
              className={overlayStyles.tabButton}
            >
              {isEn ? "Exhibitions" : "Ausstellungen"}
            </button>
          </div>
        </div>
      </OverlayShell>
    );
  }

  return (
    <OverlayShell>
      <div className={overlayStyles.container}>
        <div className={styles.overlayHeading}>
          {isEn ? "Artist Login" : "Künstlerlogin"}
        </div>
        <form
          onSubmit={handleSubmit}
          className={`${styles.overlayBlock} ${overlayStyles.form}`}
        >
          <div className={overlayStyles.formGroup}>
            <label htmlFor="password" className={overlayStyles.label}>
              {isEn ? "Password:" : "Passwort:"}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={overlayStyles.input}
              autoFocus
            />
          </div>
          {error && <div className={overlayStyles.error}>{error}</div>}
          <button 
            type="submit" 
            className={overlayStyles.button}
            disabled={isLoading}
          >
            {isLoading 
              ? (isEn ? "Checking..." : "Prüfe...") 
              : (isEn ? "Login" : "Anmelden")
            }
          </button>
        </form>
      </div>
    </OverlayShell>
  );
}
