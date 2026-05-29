# Bookshelf — Context

## Stack

- React + Vite + TypeScript + Tailwind
- Supabase + SQL (back géré par moi, ne pas toucher)
- react-router-dom, recharts

## Design

- Police : Inria Serif pour les titres, Inter pour le corps
- Background : #FDFAF6
- Accent : #E8825A
- Texte : #2C2C2C
- Style : sobre, minimaliste, mobile-first

## Règles

- Ne jamais toucher au back
- Utiliser uniquement les mocks dans src/mocks/
- Toujours vérifier le responsive mobile (375px)
- Pas de librairie UI externe (pas de shadcn, pas de MUI)

## Pages

- Landing, Currently Reading, To Read, Read, Stats

## Git commits

Utilise les Conventional Commits :

- feat: nouvelle feature
- fix: correction de bug
- refactor: refactorisation sans changement de comportement
- style: changements CSS/design uniquement
- chore: maintenance, config, dépendances
- docs: documentation

- Ne jamais committer d'images ou de fichiers binaires
- Conventional commits uniquement

Exemple : "feat: add guest mode with mock data"
