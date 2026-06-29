# Eisenhower Matrix — Setup-Anleitung

## Voraussetzungen
- Node.js ≥ 18 installiert (https://nodejs.org)
- Ein Google-Konto für Firebase

---

## 1. Firebase-Projekt einrichten

1. Gehe zu https://console.firebase.google.com
2. Klicke **"Projekt hinzufügen"** → Name z.B. `eisenhower-matrix` → Weiter
3. Google Analytics kann deaktiviert werden → **Projekt erstellen**

### Authentication aktivieren
1. Im linken Menü: **Build → Authentication**
2. Klicke **"Jetzt loslegen"**
3. Unter **Sign-in-Methode**: **E-Mail/Passwort** aktivieren → Speichern

### Firestore-Datenbank erstellen
1. Im linken Menü: **Build → Firestore Database**
2. Klicke **"Datenbank erstellen"**
3. Wähle **"Im Produktionsmodus starten"** → Standort wählen (z.B. `europe-west3`) → Aktivieren

### Firestore-Regeln setzen
Im Firestore-Tab → **Regeln** → Folgendes eintragen:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{taskId} {
      allow read, write: if request.auth != null;
    }
  }
}
```
→ **Veröffentlichen**

### Web-App registrieren & Config holen
1. In Firebase Console: **Projekteinstellungen** (Zahnrad oben links)
2. Unter **"Deine Apps"** → **"</> Web"** → App-Nickname eingeben → Registrieren
3. Du siehst eine `firebaseConfig`-Objekt mit allen Werten

---

## 2. Projekt lokal starten

```bash
# Im Projektordner:
cp .env.example .env.local

# .env.local mit deinen Firebase-Werten befüllen:
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...

# Abhängigkeiten installieren & starten:
npm install
npm run dev
```

→ App läuft auf http://localhost:5173

---

## 3. Benutzerkonten anlegen

Beide Personen brauchen je ein Konto. Entweder:
- **Selbst registrieren**: In der App auf "Registrieren" klicken
- **Manuell anlegen**: In Firebase Console → Authentication → Benutzer hinzufügen

---

## 4. Auf Vercel deployen (kostenlos)

1. GitHub-Repo anlegen und Code pushen:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/DEIN_USER/eisenhower-matrix.git
   git push -u origin main
   ```

2. Gehe zu https://vercel.com → Mit GitHub anmelden
3. **"New Project"** → Repo importieren
4. Unter **"Environment Variables"** alle `VITE_FIREBASE_*`-Werte eintragen
5. Klicke **Deploy**

→ Du bekommst eine URL wie `https://eisenhower-matrix-xyz.vercel.app`

Diese URL teilst du mit der zweiten Person — sie registriert sich einfach dort.

---

## Nutzung
- Aufgabe hinzufügen: Klicke **"+ Aufgabe"** in einem Quadranten
- Quadrant wechseln: Aufgabe **drag & drop** in anderen Quadranten ziehen
- Aufgabe löschen: Hover über Aufgabe → **×** klicken
- Echtzeit-Sync: Änderungen erscheinen sofort auf beiden Geräten
