/**
 * Shared component configurations and common props
 */

// Chart dimensions
export const CHART_DIMENSIONS = {
  bar: { height: 320, width: 600 },
  timeline: { height: 200 },
  treemap: { height: 400 },
} as const;

// Intervention label mappings
export const INTERVENTION_LABELS: Record<string, string> = {
  "스트레칭": "Stretching",
  "당 충전하기": "Sugar Boost", 
  "지금 듣고 싶은 말": "Words I Need Right Now",
  "호흡하기": "Deep Breathing",
  "나를 지켜줘": "Protect Me",
  "화 먹는 요정": "Anger-Eating Fairy",
  "나 잘했지?": "I Did Well, Right?",
  "지금, 나 때문일까?": "Is It Because of Me?",
} as const;

// Component rendering functions (moved to avoid JSX in constants file)
export const getLoadingComponent = () => "Loading...";
export const getErrorComponent = (error: string) => `Error: ${error}`;