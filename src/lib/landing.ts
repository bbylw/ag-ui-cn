/**
 * Landing page content for the AG-UI Chinese site.
 * Copy and facts are adapted from the AG-UI README and introduction docs.
 */

export const DOCS_URL = "/intro/";
export const GITHUB_URL = "https://github.com/ag-ui-protocol/ag-ui";
export const OFFICIAL_DOCS_URL = "https://docs.ag-ui.com/";
export const DOJO_URL = "https://dojo.ag-ui.com/";
export const DISCORD_URL = "https://discord.gg/Jd3FzfdJa8";
export const QUICKSTART_URL = "/quickstart/";

export type RacePath = "events" | "state";

export interface RaceEngine {
  id: string;
  name: string;
  tone: "kiri" | "dd" | "orb";
  ms: Record<RacePath, number>;
  stops: Record<RacePath, string[]>;
  note: string;
  residue: number;
}

/** Visual metaphor: AG-UI standardizes the agent↔UI flow with fewer ad-hoc hops. */
export const raceEngines: RaceEngine[] = [
  {
    id: "custom",
    name: "临时拼接方案",
    tone: "orb",
    ms: { events: 420, state: 360 },
    stops: {
      events: ["用户输入", "自定义协议", "状态胶水", "UI 适配", "渲染"],
      state: ["状态变更", "手写同步", "冲突处理", "UI 补丁", "渲染"],
    },
    note: "每个框架与前端都要单独适配，流式与状态同步逻辑容易分散且难维护。",
    residue: 1,
  },
  {
    id: "partial",
    name: "局部协议",
    tone: "dd",
    ms: { events: 210, state: 180 },
    stops: {
      events: ["用户输入", "框架事件", "转换层", "UI 适配", "渲染"],
      state: ["状态变更", "部分同步", "补丁逻辑", "UI 更新", "渲染"],
    },
    note: "能解决部分问题，但在工具、状态、中断等能力上仍需额外约定。",
    residue: 1,
  },
  {
    id: "agui",
    name: "AG-UI 协议",
    tone: "kiri",
    ms: { events: 48, state: 32 },
    stops: {
      events: ["用户输入", "AG-UI 输入", "标准事件流", "客户端处理", "实时 UI"],
      state: ["共享状态", "增量事件", "统一合并", "客户端状态", "实时 UI"],
    },
    note: "以统一事件模型连接智能体与界面，天然适配流式输出、工具与人机协同。",
    residue: 0,
  },
];

export const raceCommand: Record<RacePath, string> = {
  events: "agent.run() → AG-UI events → UI 实时更新",
  state: "shared state → diff events → 客户端同步渲染",
};

export const tools = [
  "SSE / WebSocket",
  "流式聊天",
  "共享状态",
  "前端工具调用",
  "后端工具渲染",
  "生成式 UI",
  "人机协同中断",
  "自定义事件",
];

export interface Feature {
  icon: string;
  title: string;
  desc: string;
  href: string;
  tone?: "rose" | "teal" | "orchid";
}

export const features: Feature[] = [
  {
    icon: "ph:chats-circle",
    title: "实时流式交互",
    desc: "基于事件流传输 token、步骤与中间结果，让多轮智能体会话保持即时响应与可感知进展。",
    href: "/concepts/events/",
  },
  {
    icon: "ph:arrows-clockwise",
    title: "双向状态同步",
    desc: "在智能体与应用之间共享类型化状态，通过增量事件同步变更，支撑协作式体验。",
    href: "/concepts/building-blocks/",
    tone: "teal",
  },
  {
    icon: "ph:layout",
    title: "生成式 UI",
    desc: "将模型输出映射为稳定组件或声明式 UI 意图，在灵活表达与应用可控之间取得平衡。",
    href: "/concepts/building-blocks/",
  },
  {
    icon: "ph:wrench",
    title: "工具调用可视化",
    desc: "统一呈现后端工具执行与前端动作交接，让长链路任务的过程与结果一目了然。",
    href: "/concepts/building-blocks/",
    tone: "orchid",
  },
  {
    icon: "ph:user-switch",
    title: "人机协同中断",
    desc: "在关键节点暂停、批准、编辑或重试，在不丢失状态的前提下引入人工判断。",
    href: "/concepts/building-blocks/",
  },
  {
    icon: "ph:plugs-connected",
    title: "广泛生态集成",
    desc: "对接多种智能体框架、SDK 与客户端形态，从 Web 到终端、聊天平台与移动端皆可接入。",
    href: "/integrations/",
    tone: "rose",
  },
  {
    icon: "ph:stack",
    title: "协议栈协同",
    desc: "与 MCP（工具与数据）、A2A（智能体协作）互补，专注解决“智能体 ↔ 用户”交互层。",
    href: "/intro/",
    tone: "teal",
  },
  {
    icon: "ph:code",
    title: "可扩展事件模型",
    desc: "在标准事件之外支持自定义事件，满足业务特有的交互与数据传输需求。",
    href: "/concepts/events/",
  },
  {
    icon: "ph:compass-tool",
    title: "面向真实场景",
    desc: "源自真实应用内智能体交互实践，覆盖长任务、非确定性行为与复杂 UI 控制需求。",
    href: "/intro/",
    tone: "orchid",
  },
];

export const languages = [
  "简体中文",
  "English",
  "日本語",
  "한국어",
  "Español",
  "Français",
  "Deutsch",
  "Português",
  "Русский",
  "العربية",
];

export interface TermLine {
  cmd: string;
  out: { text: string; tone?: "ok" | "dim" | "brand" }[];
}

export const termSession: TermLine[] = [
  {
    cmd: "npx create-ag-ui-app my-agent-app",
    out: [
      { text: "✔ Creating AG-UI application...", tone: "dim" },
      { text: "✔ Ready: my-agent-app", tone: "ok" },
    ],
  },
  {
    cmd: "cd my-agent-app && pnpm install",
    out: [{ text: "Installed dependencies with pnpm", tone: "dim" }],
  },
  {
    cmd: "pnpm dev",
    out: [
      { text: "Agent backend emitting AG-UI events…", tone: "dim" },
      { text: "UI connected: streaming chat + shared state", tone: "ok" },
    ],
  },
  {
    cmd: "# 发送一条用户消息",
    out: [{ text: "→ RUN_STARTED / TEXT_MESSAGE_* / RUN_FINISHED", tone: "brand" }],
  },
  {
    cmd: "# 工具调用与前端交互",
    out: [{ text: "→ TOOL_CALL_* events + UI update", tone: "brand" }],
  },
];

export const cliPoints = [
  {
    icon: "ph:lightning",
    lead: "脚手架快速起步",
    rest: "使用 create-ag-ui-app 在几秒内创建可运行的 AG-UI 应用骨架。",
  },
  {
    icon: "ph:broadcast",
    lead: "事件驱动连接",
    rest: "后端发出标准事件，前端实时消费并渲染聊天、状态与工具进展。",
  },
  {
    icon: "ph:tree-structure",
    lead: "可组合能力",
    rest: "按需引入生成式 UI、共享状态、子智能体与人机协同中断等构建块。",
  },
  {
    icon: "ph:globe-hemisphere-west",
    lead: "多端与多框架",
    rest: "同一协议可连接不同智能体框架，并服务于 Web、终端与聊天平台客户端。",
  },
];

export const steps = [
  {
    n: "01",
    title: "创建应用",
    desc: "使用官方脚手架初始化项目，获得 AG-UI 应用的基础结构与示例。",
    code: "npx create-ag-ui-app my-agent-app",
    cta: { label: "查看快速开始", href: QUICKSTART_URL, external: false },
  },
  {
    n: "02",
    title: "连接智能体后端",
    desc: "让你的智能体运行时发出 AG-UI 标准事件，并接收兼容输入。",
    code: "agent → emit AG-UI events (SSE/WebSocket)",
  },
  {
    n: "03",
    title: "在前端订阅事件",
    desc: "客户端消费事件流，渲染流式消息、工具状态与共享状态更新。",
    code: "client.subscribe(events).render(ui)",
  },
  {
    n: "04",
    title: "扩展交互能力",
    desc: "按需加入生成式 UI、前端工具、人机协同中断与自定义事件。",
    code: "add: generative UI · HITL · custom events",
  },
];

export type PlatformId = "web" | "chat" | "terminal";

export interface Platform {
  id: PlatformId;
  name: string;
  icon: string;
  channel: string;
  guest: string;
  guestNote: string;
  badge: string;
  desc: string;
  href: string;
}

export const platforms: Platform[] = [
  {
    id: "web",
    name: "Web 应用",
    icon: "ph:browser",
    channel: "SSE / WebSocket",
    guest: "浏览器客户端",
    guestNote: "订阅事件流，渲染聊天、状态面板与生成式 UI",
    badge: "最常见的 AG-UI 客户端形态",
    desc: "在浏览器中实时消费智能体事件，构建响应迅速、可观测的交互界面。",
    href: "/sdk/",
  },
  {
    id: "chat",
    name: "聊天平台",
    icon: "ph:chat-text",
    channel: "Webhook / 平台事件",
    guest: "Slack / Teams 等",
    guestNote: "将协议事件映射为消息、卡片与交互操作",
    badge: "协作场景中的智能体入口",
    desc: "把 AG-UI 智能体接入团队协作工具，在熟悉的聊天环境中完成任务。",
    href: "/sdk/",
  },
  {
    id: "terminal",
    name: "终端与工具",
    icon: "ph:terminal-window",
    channel: "HTTP / Stream",
    guest: "CLI 客户端",
    guestNote: "以文本与结构化输出呈现事件流与工具进展",
    badge: "开发者与运维友好",
    desc: "在命令行中与智能体交互，适合调试、自动化与开发者工作流。",
    href: "/sdk/",
  },
];

export const howStats = [
  { value: "~16", unit: "类", label: "标准事件类型", desc: "覆盖消息、状态、工具、控制等核心交互语义。" },
  { value: "3", unit: "层", label: "协议栈协同", desc: "MCP 提供工具，A2A 连接智能体，AG-UI 连接用户。" },
  { value: "∞", unit: "", label: "可扩展能力", desc: "通过自定义事件与中间件适配不同框架与业务场景。" },
];

export const navLinks = [
  { href: "#features", label: "核心能力" },
  { href: "#race", label: "对比" },
  { href: "#resource", label: "场景" },
  { href: "#how", label: "架构" },
  { href: "#start", label: "上手" },
];
