# GymTracker - Aplikacja na siłownię (PWA dla iOS / iPhone)

Nowoczesna aplikacja webowa typu **PWA (Progressive Web App)** dedykowana treningom siłowym i progresywnemu przeciążaniu (*progressive overload*), stworzona w **React**, **Vite** i **TypeScript**.

Działa w **100% offline**, instaluje się bezpośrednio na pulpicie iPhone'a przez Safari (bez App Store) i jest przygotowana do darmowego hostingu na **GitHub Pages**.

---

## 📱 Jak zainstalować aplikację na iPhonie (Krok po kroku)

Gdy aplikacja zostanie opublikowana na Twoim GitHub Pages (np. `https://twoj-login.github.io/appgym/`):

1. Otwórz ten adres w przeglądarce **Safari** na iPhonie.
2. Kliknij ikonę **Udostępnij** (kwadrat ze strzałką w górę na dolnym pasku Safari).
3. Przewiń w dół i wybierz **„Do ekranu początkowego”** (*Add to Home Screen*).
4. Kliknij **Dodaj**.

> [!TIP]
> Na pulpicie iPhone'a pojawi się zielona ikona aplikacji GymTracker. Po kliknięciu aplikacja otwiera się w trybie **Standalone** (na pełnym ekranie, bez pasków Safari) i działa w **100% offline** na siłowni bez konieczności połączenia z internetem.

---

## 🚀 Wdrożenie na GitHub Pages

Projekt posiada już wbudowany workflow GitHub Actions (`.github/workflows/deploy.yml`), który automatycznie buduje i publikuje stronę przy każdym wrzuceniu kodu.

### Krok 1: Utwórz repozytorium na GitHubie
1. Wejdź na [GitHub.com](https://github.com) i kliknij **New repository**.
2. Nazwij je np. `gymtracker` lub `appgym` (może być **Public**).

### Krok 2: Wypchnij kod do repozytorium
Jeśli masz zainstalowanego Gita na komputerze:
```bash
git init
git add .
git commit -m "Inicjalizacja GymTracker PWA"
git branch -M main
git remote add origin https://github.com/TWOJ_LOGIN/appgym.git
git push -u origin main
```

*(Alternatywnie: możesz zainstalować darmowy program **GitHub Desktop** lub przeciągnąć pliki projektu bezpośrednio przez stronę GitHub.com).*

### Krok 3: Włącz GitHub Pages w ustawieniach repozytorium
1. W repozytorium na GitHubie wejdź w **Settings** -> **Pages** (w menu po lewej stronie).
2. W sekcji **Build and deployment** -> **Source** wybierz: **GitHub Actions**.
3. Za kilkadziesiąt sekund Twoja strona będzie aktywna pod adresem:
   `https://TWOJ_LOGIN.github.io/appgym/`

---

## ✨ Funkcjonalności

- **100% Offline (PWA + LocalStorage + Service Worker):**
  - Całość danych zapisywana jest w pamięci telefonu. Działa bez zasięgu na siłowni.
- **Katalog ćwiczeń w języku polskim:**
  - Ponad 35 gotowych ćwiczeń z podziałem na partie: Klatka, Plecy, Nogi, Barki, Ramiona, Brzuch.
  - Szybkie wyszukiwanie i filtrowanie.
  - Możliwość dodawania własnych ćwiczeń z notatkami technicznymi.
- **Aktywny trening:**
  - Wprowadzanie ciężaru i powtórzeń.
  - Podpowiedź wyniku z poprzedniej sesji (*POPRZEDNIO*).
  - Typy serii: Normalna, Rozgrzewkowa (W), Drop set (D), Upadek (F).
  - Automatyczne powielanie ciężaru przy dodawaniu kolejnej serii.
- **Historia i kalkulator siły (1RM):**
  - Obliczanie szacowanego maksa na 1 powtórzenie (**1RM**) wg wzoru Epleya.
  - Osobisty rekord (**PR**) dla każdego ćwiczenia.
  - Łączna objętość (tonaż w kg) z każdej sesji.
- **Kopia zapasowa (Backup JSON):**
  - W nagłówku aplikacji znajduje się przycisk pobrania i wgrania kopii zapasowej danych w formacie JSON.
