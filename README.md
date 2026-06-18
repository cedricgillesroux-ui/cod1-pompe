# COD1 — Pression de refoulement 🚒

Application d'aide au calcul de la **pression de refoulement** à régler sur la pompe, pour les conducteurs poids-lourds pompiers (formation COD1).

Fonctionne **100 % hors-ligne**, sur téléphone, tablette ou PC.

---

## Comment l'ouvrir

### Le plus simple (PC)
Double-clique sur **`COD1 Pompe`** (raccourci créé sur le Bureau) — ou sur **`Lancer COD1.url`** dans ce dossier.
L'app s'ouvre dans ton navigateur et fonctionne même sans connexion.

### Sur téléphone / tablette (installer comme une vraie appli)
1. Copie le dossier `app` sur l'appareil (ou héberge-le, voir plus bas), puis ouvre `index.html`.
2. Dans le navigateur : menu **⋮ → « Ajouter à l'écran d'accueil »** (Android) ou **Partager → « Sur l'écran d'accueil »** (iPhone).
3. Une icône 🚒 apparaît : l'app se lance en plein écran, hors-ligne.

> L'installation « vraie PWA » (icône + plein écran + cache automatique) nécessite que les fichiers soient servis en `http(s)://` (hébergement, ou serveur local). En ouverture directe d'un fichier (`file://`), l'app **fonctionne quand même entièrement** — seul le mode « installé » n'est pas proposé.

### Servir en local (pour l'installation PWA sur le PC)
Dans ce dossier :
```
python -m http.server 8765
```
puis ouvre `http://localhost:8765/` et clique sur l'icône « Installer » dans la barre d'adresse.

---

## Ce qu'elle calcule

| Mode | Usage |
|------|-------|
| 🔥 **Calcul rapide** | 1 lance, tuyaux en série. Bouton **« Poser une division »** pour ajouter des départs en parallèle sans changer d'écran. |
| 🔀 **Dispositif (division)** | Ouvre directement le mode division : tronc commun (au débit total) + départs en parallèle. Calcul sur le départ le plus défavorable. |
| 🔗 **Relais** | Longue distance : méthode COD1 en 6 étapes (nb d'engins, emplacements, pressions). |
| 📋 **Table & repères** | Table des pertes de charge nominales + perte de charge d'un tronçon. |

### Formule (source : manuel stagiaire COD1)
```
J (perte de charge)        = Jn × (Q / Qn)² × L / 100      [bar]
Dénivelé Z                 = hauteur(m) / 10               (montée = perte, descente = gain)
Pression de refoulement    = Σ pertes de charge + pression à la lance + Z
```

### Table nominale utilisée
| ⌀ | Nature | Qn (L/min) | Jn (b/hm) |
|---|--------|-----------|-----------|
| 22 | semi-rigide | 58 | 2,2 |
| 22 | P.I.L | 58 | 1,7 |
| 45 | P.I.L | 250 | 1,5 |
| 70 | P.I.L | 500 | 0,55 |
| 110 | P.I.L | 1000 | 0,28 |
| 150 | P.I.L (non normalisé) | 2000 | 0,13 |

Validé contre les exemples chiffrés du manuel COD1 (LDT, dispositif multi-lances, relais).

---

## ⚠️ Avertissement
Outil **d'aide** à la formation et au calcul. Les pertes de charge **singulières** (coudes, accessoires, tuyaux écrasés) ne sont pas comptées. Le conducteur **reste maître de sa pompe** : vérifie toujours au manomètre.

## Fichiers
- `index.html` — l'application (interface + moteur de calcul)
- `manifest.webmanifest`, `sw.js`, `icon.svg`, `icon-*.png`, `icon.ico` — support PWA / icônes
- `Lancer COD1.url` — raccourci d'ouverture
