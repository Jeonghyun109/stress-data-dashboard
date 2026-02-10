# Dual Indicator Stress Dashboard

This project is a Next.js implementation of the **dual indicator dashboard** (perceived + physiological stress) proposed in the attached paper.  
You can explore the dashboard demo by open `http://localhost:3000/dashboard{pid}` in your browser.

## Overview
- **Goal**: visualize perceived and physiological stress together to inspect daily and intraday patterns
- **Key views**: calendar, timeline, treemap, intervention effect bar charts

## Features
- **Calendar / DiffCalendar**: daily stress summary (toggle perceived/physiological)
- **Timeline / DiffTimeline**: time-bucketed stress, call records, intervention overlays
- **Treemap**: correlation-based stressor visualization
- **BarChart**: intervention effect comparison (reduction/increase)
- **Report**: text summaries for each chart

## Data & Files
- CSVs live in `public/data`:
  - `feature_full.csv`: base stress/context/environment/physiology
  - `diff_full.csv`: pre/post intervention differences
  - `diff_rate.csv`: intervention effect rates
  - `correlation.csv`: correlation data
- Main hooks:
  - `src/hooks/useStressData.ts`
  - `src/hooks/useStressDiffData.ts`
  - `src/hooks/useEffectData.ts`
  - `src/hooks/useCorrelationData.ts`

## Project Structure (Core)
- `src/components/`: UI components
  - `Calendar`, `DiffCalendar`, `Timeline`, `DiffTimeline`, `Treemap`, `Barchart`
  - `components/report/`: text report components
- `src/utils/`: shared utilities (parsing, timeline, reports, etc.)
- `src/constants/`: colors, chart configs, labels
- `src/pages/`: Next.js pages

## Development
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

## Build
```bash
npm run build
npm start
```

## Lint
```bash
npm run lint
```

## Citation
```
Title: When Feeling and Physiology Diverge: Understanding Dual-Indicator Stress
Sensemaking and Micro-Interventions in an Emotional-Labor Workplace
Status: Under Review
```
