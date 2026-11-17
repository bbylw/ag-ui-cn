import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import nimbus, {
  defineConfig as defineNimbusConfig,
} from "@cloudflare/nimbus-docs";
import { tableScroll } from "@cloudflare/nimbus-docs/markdown";

const nimbusConfig = defineNimbusConfig({
  site: "https://ag-ui.ndjp.net",
  title: "AG-UI 中文文档",
  description:
    "AG-UI（Agent–User Interaction Protocol）中文站点：开放、轻量、事件驱动的智能体与用户交互协议，包含落地页与完整中文文档。",
  locale: "zh-CN",
  github: "https://github.com/ag-ui-protocol/ag-ui",
  socialImageAlt: "AG-UI 中文文档预览",
  sidebar: {
    items: [
      "intro",
      "agentic-protocols",
      {
        label: "快速开始",
        items: [
          "quickstart",
          "quickstart/applications",
          "quickstart/integrations",
          "quickstart/server",
          "quickstart/middleware",
          "quickstart/clients",
        ],
      },
      "migrating-to-1-0",
      "production-support",
      {
        label: "核心概念",
        items: [
          "concepts/architecture",
          "concepts/events",
          "concepts/agents",
          "concepts/middleware",
          "concepts/messages",
          "concepts/metadata",
          "concepts/reasoning",
          "concepts/state",
          "concepts/interrupts",
          "concepts/serialization",
          "concepts/tools",
          "concepts/subagents",
          "concepts/capabilities",
          "concepts/generative-ui",
          "concepts/building-blocks",
        ],
      },
      {
        label: "集成",
        items: ["integrations", "integrations/google-adk-js"],
      },
      {
        label: "协议参考",
        items: ["reference/events"],
      },
      {
        label: "规范 1.0",
        items: [
          "spec/1-0",
          "spec/1-0/changelog",
          "spec/1-0/architecture",
          "spec/1-0/basic",
          "spec/1-0/basic/run-input",
          "spec/1-0/basic/metadata",
          "spec/1-0/basic/capabilities",
          "spec/1-0/basic/processing",
          "spec/1-0/basic/patterns",
          "spec/1-0/basic/patterns/streaming",
          "spec/1-0/basic/patterns/snapshots",
          "spec/1-0/basic/patterns/interrupt-resume",
          "spec/1-0/basic/transports",
          "spec/1-0/basic/transports/http-sse",
          "spec/1-0/basic/transports/http-protobuf",
          "spec/1-0/basic/versioning",
          "spec/1-0/events",
          "spec/1-0/events/lifecycle",
          "spec/1-0/events/text-messages",
          "spec/1-0/events/tool-calls",
          "spec/1-0/events/reasoning",
          "spec/1-0/events/state",
          "spec/1-0/events/activity",
          "spec/1-0/events/subagents",
          "spec/1-0/events/passthrough",
          "spec/1-0/schema-files",
          "spec/1-0/schema",
        ],
      },
      {
        label: "草案（Proposals）",
        items: ["drafts", "drafts/generative-ui", "drafts/meta-events"],
      },
      {
        label: "教程",
        items: ["tutorials/cursor", "tutorials/debugging"],
      },
      {
        label: "开发与社区",
        items: [
          "development/updates",
          "development/roadmap",
          "development/contributing",
          "support",
        ],
      },
      "sdk",
      {
        label: "SDK 参考",
        items: [
          {
            label: "TypeScript",
            items: [
              "sdk/js/core/overview",
              "sdk/js/core/types",
              "sdk/js/core/events",
              "sdk/js/core/multimodal-inputs",
              "sdk/js/client/overview",
              "sdk/js/client/abstract-agent",
              "sdk/js/client/http-agent",
              "sdk/js/client/middleware",
              "sdk/js/client/subscriber",
              "sdk/js/client/compaction",
            ],
          },
          {
            label: "Python",
            items: [
              "sdk/python/core/overview",
              "sdk/python/core/types",
              "sdk/python/core/events",
              "sdk/python/encoder/overview",
            ],
          },
          {
            label: ".NET",
            items: [
              "sdk/dotnet/abstractions/overview",
              "sdk/dotnet/client/overview",
              "sdk/dotnet/client/chat-client",
              "sdk/dotnet/hosting/overview",
            ],
          },
        ],
      },
      "resources",
    ],
  },
});

export default defineConfig({
  site: "https://ag-ui.ndjp.net",
  output: "static",
  vite: {
    plugins: [tailwindcss()],
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "hover",
  },
  integrations: [
    nimbus(nimbusConfig, {
      rules: {
        "nimbus/frontmatter-shape": "error",
        "nimbus/internal-link": "error",
      },
      markdown: {
        hastPlugins: [tableScroll()],
        features: { headingAttributes: true },
      },
    }),
  ],
});
