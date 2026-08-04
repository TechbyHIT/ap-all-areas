export const PUBLISHING_CONFIG = {
  maxBatchSize: 500,
  defaultBatchSize: 100,
  phases: {
    1: {
      name: "Core launch",
      pageTypes: ["home", "service", "location", "service-location", "guide", "static"],
    },
    2: {
      name: "Areas and solutions",
      pageTypes: ["area", "service-area", "solution", "property-type"],
    },
    3: {
      name: "Content expansion",
      pageTypes: ["guide", "blog", "service-area", "solution"],
    },
    4: {
      name: "Controlled expansion",
      pageTypes: ["service-area", "service-location", "blog"],
    },
  },
} as const;
