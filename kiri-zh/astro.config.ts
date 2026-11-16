import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import nimbus, {
  defineConfig as defineNimbusConfig,
} from "@cloudflare/nimbus-docs";
import { tableScroll } from "@cloudflare/nimbus-docs/markdown";

const nimbusConfig = defineNimbusConfig({
  site: "https://kiri.example.com",
  title: "Kiri 文档",
  description: "Kiri 是一个小巧、快速的容器运行时，适用于 macOS、Windows 和 Linux。完整中文介绍与文档。",
  locale: "zh-CN",
  github: "https://github.com/libracoder/kiri",
  socialImageAlt: "Kiri 文档预览",
  sidebar: {
    items: [
      "intro",
      {
        label: "开始使用",
        items: ["quick-start", "install", "faq"],
      },
      {
        label: "Docker",
        items: [
          "docker/containers",
          "docker/images",
          "docker/builds",
          "docker/compose",
          "docker/storage",
          "docker/network",
          "docker/migrate",
        ],
      },
      {
        label: "功能与体验",
        items: [
          "features/window",
          "features/menu-bar",
          "features/domains",
          "features/https",
          "features/files",
          "features/ssh-agent",
          "features/usb",
          "features/share",
          "features/kiri-cloud",
        ],
      },
      {
        label: "进阶能力",
        items: ["guide/kubernetes", "guide/machines", "guide/cli"],
      },
      {
        label: "平台与原理",
        items: [
          "platforms/linux",
          "platforms/windows",
          "guide/how-it-works",
          "guide/benchmarks",
          "guide/memory",
          "guide/settings",
          "guide/updates",
        ],
      },
      {
        label: "对比与更新",
        items: ["compare/docker-desktop", "guide/whats-new"],
      },
    ],
  },
});

export default defineConfig({
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
