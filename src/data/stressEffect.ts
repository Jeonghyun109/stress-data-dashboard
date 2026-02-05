import type { ContentText, PageContent } from '@/types';
import { TEXT_COLORS } from '@/constants/theme';

/**
 * Content configuration for stress relief interventions page
 */

export const CONTENT: PageContent = {
  TITLE: "Over the past month, how did you relieve stress?",
  BODY_1: {
    TITLE: [
      { txt: "My ", color: TEXT_COLORS.neutral },
      { txt: "perceived stress", color: TEXT_COLORS.internal },
      { txt: "-relieving interventions", color: TEXT_COLORS.neutral },
    ] as ContentText[]
  },
  BODY_2: {
    TITLE: [
      { txt: "My ", color: TEXT_COLORS.neutral },
      { txt: "physiological stress", color: TEXT_COLORS.physical },
      { txt: "-relieving interventions", color: TEXT_COLORS.neutral },
    ] as ContentText[]
  },
};