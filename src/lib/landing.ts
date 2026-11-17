/**
 * Landing page data and interactive scenario definitions for the AG-UI Chinese site.
 * Event names, SDK APIs, and links align with AG-UI 1.0 documentation in `src/content/docs/`.
 */

export const DOCS_URL = "/intro/";
export const GITHUB_URL = "https://github.com/ag-ui-protocol/ag-ui";
export const OFFICIAL_DOCS_URL = "https://docs.ag-ui.com/";
export const DOJO_URL = "https://dojo.ag-ui.com/";
export const DISCORD_URL = "https://discord.gg/Jd3FzfdJa8";
export const QUICKSTART_URL = "/quickstart/";

export const navLinks = [
  { href: "#sandbox", label: "交互沙盒" },
  { href: "#features", label: "核心能力" },
  { href: "#sdk", label: "接入示例" },
  { href: "#platforms", label: "多端架构" },
];

export interface ProtocolStackLayer {
  name: string;
  scope: string;
  desc: string;
  active?: boolean;
}

export const stackLayers: ProtocolStackLayer[] = [
  { name: "MCP", scope: "智能体 ↔ 工具", desc: "连接数据源、API 与外部工具能力" },
  { name: "A2A", scope: "智能体 ↔ 智能体", desc: "协调分布式多智能体间的任务委派" },
  { name: "AG-UI", scope: "智能体 ↔ 用户", desc: "31 种标准事件 · 8 大事件族 · 实时双向界面通信", active: true },
];

export interface HeroScenario {
  id: "stream" | "state" | "hitl";
  label: string;
  prompt: string;
  reply: string;
  events: {
    type: string;
    meta: string;
    tone: "live" | "accent" | "rose" | "idle";
  }[];
  widget: {
    badge: string;
    title: string;
    rows: { k: string; v: string; highlight?: boolean }[];
    actionLabel?: string;
    resolvedReply?: string;
    resolvedEvent?: { type: string; meta: string };
  };
}

export const heroScenarios: HeroScenario[] = [
  {
    id: "stream",
    label: "流式与工具",
    prompt: "帮我查一下明天上海飞北京的直飞航班",
    reply: "已检索到 3 班早间直飞，耗时约 2 小时 15 分：",
    events: [
      { type: "RUN_STARTED", meta: "run_89a1 · thread_01", tone: "live" },
      { type: "TEXT_MESSAGE_CONTENT", meta: 'delta: "已检索到 3 班早间直飞…"', tone: "accent" },
      { type: "TOOL_CALL_START", meta: "search_flights()", tone: "rose" },
      { type: "TOOL_CALL_RESULT", meta: "3 results returned", tone: "idle" },
    ],
    widget: {
      badge: "后端工具已返回",
      title: "search_flights",
      rows: [
        { k: "CA1502", v: "08:30 SHA → PEK · ¥980", highlight: true },
        { k: "MU5105", v: "09:15 SHA → PEK · ¥1,040" },
      ],
    },
  },
  {
    id: "state",
    label: "共享状态",
    prompt: "把行程第二天调整为苏州博物馆 + 预算控制在 2500",
    reply: "已通过增量补丁更新共享行程状态：",
    events: [
      { type: "STATE_SNAPSHOT", meta: "init itinerary (3 keys)", tone: "idle" },
      { type: "STATE_DELTA", meta: 'replace /day2 → "苏州博物馆"', tone: "accent" },
      { type: "STATE_DELTA", meta: "replace /budget → 2500", tone: "rose" },
      { type: "RUN_FINISHED", meta: "outcome: success", tone: "live" },
    ],
    widget: {
      badge: "RFC 6902 增量同步",
      title: "Shared State",
      rows: [
        { k: "day2", v: "苏州博物馆（已更新）", highlight: true },
        { k: "budget", v: "¥2,500 · 实时双向可读" },
      ],
    },
  },
  {
    id: "hitl",
    label: "人机协同",
    prompt: "帮我把订单改签到 CA1502 并补差价",
    reply: "涉及支付差价 ¥180，请确认后继续执行：",
    events: [
      { type: "TOOL_CALL_ARGS", meta: '{"flight":"CA1502","fee":180}', tone: "rose" },
      { type: "RUN_FINISHED", meta: 'outcome: "interrupt"', tone: "accent" },
    ],
    widget: {
      badge: "等待人工审批",
      title: "Interrupt · 改签确认",
      rows: [
        { k: "目标航班", v: "CA1502 · 08:30 起飞" },
        { k: "差价确认", v: "¥180 · 需用户授权", highlight: true },
      ],
      actionLabel: "批准执行",
      resolvedReply: "已收到您的授权，改签 CA1502 完成！",
      resolvedEvent: { type: "RUN_FINISHED", meta: 'outcome: "success" · 已出票' },
    },
  },
];

export interface EcosystemItem {
  name: string;
  tag: string;
  href: string;
}

export const ecosystems: EcosystemItem[] = [
  { name: "LangGraph", tag: "Partner", href: "/integrations/" },
  { name: "CrewAI", tag: "Partner", href: "/integrations/" },
  { name: "Google ADK", tag: "Official", href: "/integrations/google-adk-js/" },
  { name: "Microsoft Agent Framework", tag: "Official", href: "/integrations/" },
  { name: "Mastra", tag: "TypeScript", href: "/integrations/" },
  { name: "Pydantic AI", tag: "Python", href: "/integrations/" },
  { name: "LlamaIndex", tag: "Official", href: "/integrations/" },
  { name: "AWS Strands", tag: "Official", href: "/integrations/" },
];

export type SandboxScenarioId = "hitl" | "state" | "genui";

export interface SandboxFrame {
  id: string;
  type: string;
  stage: number;
  label: string;
  wire: Record<string, unknown>;
  chatText?: string;
  tool?: {
    name: string;
    status: string;
    detail: string;
  };
  genCard?: {
    title: string;
    bars: { label: string; pct: number; value: string }[];
  };
  state?: Record<string, unknown>;
  changedKeys?: string[];
  pauseForApproval?: boolean;
}

export interface SandboxScenario {
  id: SandboxScenarioId;
  name: string;
  tagline: string;
  userPrompt: string;
  stages: string[];
  frames: SandboxFrame[];
  approvalFrame?: {
    buttonApprove: string;
    buttonReject: string;
    approveOutcome: SandboxFrame[];
    rejectOutcome: SandboxFrame[];
  };
  stateToggleKey?: {
    label: string;
    path: string;
    values: [string, string];
  };
}

export const sandboxScenarios: SandboxScenario[] = [
  {
    id: "hitl",
    name: "机票改签 · HITL 中断",
    tagline: "执行高风险工具前暂停运行，收集人类确认后恢复执行",
    userPrompt: "把我的北京出差回程改签到明天早班 CA1502。",
    stages: ["RUN_STARTED", "TEXT_MESSAGE_*", "TOOL_CALL_*", "HITL 中断", "RUN_FINISHED"],
    frames: [
      {
        id: "h1",
        type: "RUN_STARTED",
        stage: 0,
        label: "建立 threadId 与 runId 会话上下文",
        wire: { type: "RUN_STARTED", threadId: "th_travel_01", runId: "run_a01" },
        chatText: "",
        state: { flight: "MU5101", status: "searching", confirmed: false },
      },
      {
        id: "h2",
        type: "TEXT_MESSAGE_CONTENT",
        stage: 1,
        label: "流式返回助手引导文本片段",
        wire: {
          type: "TEXT_MESSAGE_CONTENT",
          messageId: "msg_01",
          delta: "正在查询 CA1502 余票并核对改签差价…",
        },
        chatText: "正在查询 CA1502 余票并核对改签差价…",
        state: { flight: "CA1502", status: "checking_fare", confirmed: false },
        changedKeys: ["flight", "status"],
      },
      {
        id: "h3",
        type: "TOOL_CALL_ARGS",
        stage: 2,
        label: "流式构建工具参数并发起预校验",
        wire: {
          type: "TOOL_CALL_ARGS",
          toolCallId: "tc_rebook",
          delta: '{"flight":"CA1502","fareDiff":180}',
        },
        chatText: "已查到 CA1502 剩余座位，改签需补差价 ¥180：",
        tool: { name: "rebook_flight", status: "待审批", detail: "CA1502 · 08:30 起飞 · 差价 ¥180" },
        state: { flight: "CA1502", fareDiff: 180, status: "awaiting_approval", confirmed: false },
        changedKeys: ["fareDiff", "status"],
      },
      {
        id: "h4",
        type: "RUN_FINISHED",
        stage: 3,
        label: "以 interrupt 状态暂停，等待人类审批按钮输入",
        wire: {
          type: "RUN_FINISHED",
          runId: "run_a01",
          outcome: "interrupt",
          interrupt: { reason: "rebook_approval", amount: 180 },
        },
        chatText: "改签涉及扣款 ¥180，已触发人机协同中断，请确认操作：",
        tool: { name: "rebook_flight", status: "等待人类确认", detail: "点击下方按钮发送恢复输入" },
        state: { flight: "CA1502", fareDiff: 180, status: "interrupted", confirmed: false },
        changedKeys: ["status"],
        pauseForApproval: true,
      },
    ],
    approvalFrame: {
      buttonApprove: "批准改签 (¥180)",
      buttonReject: "取消改签",
      approveOutcome: [
        {
          id: "h5",
          type: "TOOL_CALL_RESULT",
          stage: 4,
          label: "携带用户批准恢复运行，回传工具结果并结束回合",
          wire: {
            type: "RUN_FINISHED",
            runId: "run_a02",
            outcome: "success",
            result: { ticketNo: "E-992014", status: "confirmed" },
          },
          chatText: "已收到您的授权，CA1502 改签成功！电子客票号 E-992014。",
          tool: { name: "rebook_flight", status: "已完成", detail: "客票 E-992014 已签发" },
          state: { flight: "CA1502", fareDiff: 180, status: "confirmed", confirmed: true },
          changedKeys: ["status", "confirmed"],
        },
      ],
      rejectOutcome: [
        {
          id: "h5r",
          type: "RUN_FINISHED",
          stage: 4,
          label: "记录用户取消决策，保持原航班不变并结束回合",
          wire: { type: "RUN_FINISHED", runId: "run_a02", outcome: "success", result: { cancelled: true } },
          chatText: "已按您的选择取消改签，原航班 MU5101 保留有效。",
          tool: { name: "rebook_flight", status: "已取消", detail: "未产生任何扣费" },
          state: { flight: "MU5101", fareDiff: 0, status: "cancelled", confirmed: false },
          changedKeys: ["flight", "fareDiff", "status"],
        },
      ],
    },
  },
  {
    id: "state",
    name: "共享状态 · 双向 Diff",
    tagline: "通过 SNAPSHOT 初始化并以 RFC 6902 DELTA 增量保持前后端状态同源",
    userPrompt: "把苏州行程加入“拙政园”，再把酒店预算微调到 ¥900。",
    stages: ["RUN_STARTED", "STATE_SNAPSHOT", "STATE_DELTA #1", "STATE_DELTA #2", "RUN_FINISHED"],
    frames: [
      {
        id: "s1",
        type: "RUN_STARTED",
        stage: 0,
        label: "智能体加载现有前端共享状态并启动运行",
        wire: { type: "RUN_STARTED", threadId: "th_plan_02", runId: "run_b01" },
        chatText: "已读取当前苏州周末行程，正在规划调整…",
        state: { city: "苏州", spots: ["平江路"], hotelBudget: 1200, pickup: "暂不需要" },
      },
      {
        id: "s2",
        type: "STATE_SNAPSHOT",
        stage: 1,
        label: "发布基准快照，确保客户端与服务端起点一致",
        wire: {
          type: "STATE_SNAPSHOT",
          snapshot: { city: "苏州", spots: ["平江路"], hotelBudget: 1200, pickup: "暂不需要" },
        },
        chatText: "基线状态已对齐，即将增量写入新景点与预算。",
        state: { city: "苏州", spots: ["平江路"], hotelBudget: 1200, pickup: "暂不需要" },
      },
      {
        id: "s3",
        type: "STATE_DELTA",
        stage: 2,
        label: "仅下发 JSON Patch 数组增量，避免整对象重传",
        wire: {
          type: "STATE_DELTA",
          delta: [{ op: "add", path: "/spots/-", value: "拙政园" }],
        },
        chatText: "已加入上午景点“拙政园”，正在重算酒店预算…",
        state: { city: "苏州", spots: ["平江路", "拙政园"], hotelBudget: 1200, pickup: "暂不需要" },
        changedKeys: ["spots"],
      },
      {
        id: "s4",
        type: "STATE_DELTA",
        stage: 3,
        label: "同步预算变更，你也可点击下方按钮体验前端反向改状态",
        wire: {
          type: "STATE_DELTA",
          delta: [{ op: "replace", path: "/hotelBudget", value: 900 }],
        },
        chatText: "行程已更新为平江路 + 拙政园，酒店预算调整至 ¥900。",
        state: { city: "苏州", spots: ["平江路", "拙政园"], hotelBudget: 900, pickup: "暂不需要" },
        changedKeys: ["hotelBudget"],
      },
      {
        id: "s5",
        type: "RUN_FINISHED",
        stage: 4,
        label: "运行完成，前后端继续共享同一状态对象",
        wire: { type: "RUN_FINISHED", runId: "run_b01", outcome: "success" },
        chatText: "已同步完成！试试在下方直接切换“接站服务”查看双向状态回传。",
        state: { city: "苏州", spots: ["平江路", "拙政园"], hotelBudget: 900, pickup: "暂不需要" },
      },
    ],
    stateToggleKey: {
      label: "切换前端状态：接站服务",
      path: "/pickup",
      values: ["暂不需要", "高铁北站接站 (客户端注入)"],
    },
  },
  {
    id: "genui",
    name: "生成式 UI · 工具可视化",
    tagline: "将步骤进展与工具结构化结果实时映射为受控界面组件",
    userPrompt: "对比近三个季度 AI 应用接口的流式采用率。",
    stages: ["RUN_STARTED", "STEP_STARTED", "TOOL_CALL_START", "TOOL_CALL_RESULT", "RUN_FINISHED"],
    frames: [
      {
        id: "g1",
        type: "RUN_STARTED",
        stage: 0,
        label: "开启分析回合，准备执行数据查询工具",
        wire: { type: "RUN_STARTED", threadId: "th_bi_03", runId: "run_c01" },
        chatText: "正在启动数据分析流程…",
      },
      {
        id: "g2",
        type: "STEP_STARTED",
        stage: 1,
        label: "通知客户端当前正在执行指标汇总步骤",
        wire: { type: "STEP_STARTED", stepName: "query_adoption_metrics" },
        chatText: "步骤 1/2：查询各季度事件流集成比例…",
        tool: { name: "query_metrics", status: "执行中", detail: "维度：Q1 / Q2 / Q3 协议采用" },
      },
      {
        id: "g3",
        type: "TOOL_CALL_START",
        stage: 2,
        label: "绑定工具 ID 准备流式传参并渲染图表组件",
        wire: { type: "TOOL_CALL_START", toolCallId: "tc_chart", toolCallName: "render_bar_chart" },
        chatText: "已拿到统计结果，正在渲染生成式图表组件…",
        tool: { name: "render_bar_chart", status: "渲染中", detail: "映射为受控图表卡片" },
      },
      {
        id: "g4",
        type: "TOOL_CALL_RESULT",
        stage: 3,
        label: "返回结构化数据结果，应用直接挂载声明式 UI",
        wire: {
          type: "TOOL_CALL_RESULT",
          toolCallId: "tc_chart",
          content: '{"q1":38,"q2":64,"q3":89}',
        },
        chatText: "近三个季度采用率呈显著上升趋势：",
        genCard: {
          title: "事件驱动交互采用率 · 内部示例",
          bars: [
            { label: "Q1", pct: 38, value: "38%" },
            { label: "Q2", pct: 64, value: "64%" },
            { label: "Q3", pct: 89, value: "89%" },
          ],
        },
      },
      {
        id: "g5",
        type: "RUN_FINISHED",
        stage: 4,
        label: "完成推理步骤与 UI 渲染收尾",
        wire: { type: "RUN_FINISHED", runId: "run_c01", outcome: "success" },
        chatText: "可视化组件已挂载完毕，可点击图表条目继续追问细节。",
        genCard: {
          title: "事件驱动交互采用率 · 内部示例",
          bars: [
            { label: "Q1", pct: 38, value: "38%" },
            { label: "Q2", pct: 64, value: "64%" },
            { label: "Q3", pct: 89, value: "89%" },
          ],
        },
      },
    ],
  },
];

export interface Feature {
  icon: string;
  eventTag: string;
  title: string;
  desc: string;
  href: string;
  tone?: "rose" | "teal" | "orchid";
}

export const features: Feature[] = [
  {
    icon: "ph:chats-circle",
    eventTag: "TEXT_MESSAGE_*",
    title: "实时流式对话",
    desc: "通过 Start / Content / End 三段式或 Chunk 增量传输 token，支持随时取消、多轮续写与低延迟首字响应。",
    href: "/concepts/messages/",
  },
  {
    icon: "ph:arrows-clockwise",
    eventTag: "STATE_SNAPSHOT / DELTA",
    title: "双向共享状态",
    desc: "前后端围绕同一份类型化状态协作：初始化下发全量快照，随后仅推送 RFC 6902 JSON Patch 增量差异。",
    href: "/concepts/state/",
    tone: "teal",
  },
  {
    icon: "ph:wrench",
    eventTag: "TOOL_CALL_*",
    title: "工具调用与前端交接",
    desc: "流式推送工具参数与结果事件，既可在聊天中可视化后端执行，也可把动作安全交接给前端浏览器执行。",
    href: "/concepts/tools/",
    tone: "orchid",
  },
  {
    icon: "ph:user-switch",
    eventTag: "HITL · INTERRUPT",
    title: "人机协同中断",
    desc: "智能体在敏感操作或关键决策前以 interrupt 暂停运行，收集人类批准、编辑或补充参数后无损恢复。",
    href: "/concepts/interrupts/",
    tone: "rose",
  },
  {
    icon: "ph:layout",
    eventTag: "GENERATIVE UI",
    title: "静态与声明式生成式 UI",
    desc: "将模型意图映射为前端受控的强类型组件，或结合 A2UI 等声明式规范动态挂载丰富交互界面。",
    href: "/concepts/generative-ui/",
  },
  {
    icon: "ph:stack",
    eventTag: "REASONING · SUBAGENT",
    title: "推理、子智能体与扩展",
    desc: "内置可读推理步骤、嵌套子智能体追踪与活动进度事件，并提供 RAW / CUSTOM 满足业务私有扩展。",
    href: "/concepts/events/",
    tone: "teal",
  },
];

export interface QuickPath {
  icon: string;
  title: string;
  desc: string;
  href: string;
}

export const quickPaths: QuickPath[] = [
  {
    icon: "ph:app-window",
    title: "构建智能体应用",
    desc: "用脚手架或 @ag-ui/client 连接兼容后端，快速上线流式与工具交互。",
    href: "/quickstart/applications/",
  },
  {
    icon: "ph:hard-drives",
    title: "为服务端发射标准事件",
    desc: "在自研智能体、FastAPI 或现有编排框架中编码并推送 SSE 事件流。",
    href: "/quickstart/server/",
  },
  {
    icon: "ph:terminal-window",
    title: "从零构建自定义客户端",
    desc: "将同一套标准事件订阅模型接入终端 CLI、Slack/Teams 或原生端。",
    href: "/quickstart/clients/",
  },
];

export interface SdkSnippet {
  id: "ts" | "py" | "dotnet" | "wire";
  label: string;
  filename: string;
  install: string;
  code: string;
  docHref: string;
}

export const sdkSnippets: SdkSnippet[] = [
  {
    id: "ts",
    label: "TypeScript 客户端",
    filename: "client.ts · @ag-ui/client",
    install: "pnpm add @ag-ui/client",
    code: `import { HttpAgent } from "@ag-ui/client"

const agent = new HttpAgent({
  url: "https://api.example.com/v1/agent",
})

const sub = agent.subscribe({
  onTextMessageContentEvent: ({ delta }) => {
    process.stdout.write(delta)
  },
  onStateDeltaEvent: ({ delta }) => {
    applyJsonPatch(state, delta)
  },
})

await agent.runAgent({ threadId: "th_01" })
sub.unsubscribe()`,
    docHref: "/sdk/js/client/http-agent/",
  },
  {
    id: "py",
    label: "Python 服务端",
    filename: "server.py · ag-ui-protocol",
    install: "pip install ag-ui-protocol fastapi",
    code: `from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse
from ag_ui.core import RunAgentInput
from ag_ui.encoder import EventEncoder

app = FastAPI()

@app.post("/agent")
async def agent_endpoint(input: RunAgentInput, request: Request):
    encoder = EventEncoder(accept=request.headers.get("accept"))

    async def stream():
        async for event in run_agent_events(input):
            yield encoder.encode(event)

    return StreamingResponse(stream(), media_type="text/event-stream")`,
    docHref: "/sdk/python/encoder/overview/",
  },
  {
    id: "dotnet",
    label: ".NET 客户端",
    filename: "Program.cs · AGUI.Client",
    install: "dotnet add package AGUI.Client",
    code: `using AGUI.Client;
using Microsoft.Extensions.AI;

using HttpClient httpClient = new();
IChatClient client = new AGUIChatClient(
    new(httpClient, "https://api.example.com/agent")
);

List<ChatMessage> messages = [
    new(ChatRole.User, "用一段话解释 AG-UI"),
];

await foreach (var update in client.GetStreamingResponseAsync(messages))
{
    Console.Write(update.Text);
}`,
    docHref: "/sdk/dotnet/client/chat-client/",
  },
  {
    id: "wire",
    label: "SSE 标准线缆格式",
    filename: "text/event-stream · 协议报文",
    install: "POST /agent  (Accept: text/event-stream)",
    code: `data: {"type":"RUN_STARTED","threadId":"th_01","runId":"run_01"}

data: {"type":"TEXT_MESSAGE_START","messageId":"m_1","role":"assistant"}

data: {"type":"TEXT_MESSAGE_CONTENT","messageId":"m_1","delta":"已检索到 "}

data: {"type":"STATE_DELTA","delta":[{"op":"replace","path":"/step","value":"done"}]}

data: {"type":"TEXT_MESSAGE_END","messageId":"m_1"}

data: {"type":"RUN_FINISHED","runId":"run_01","outcome":"success"}`,
    docHref: "/spec/1-0/basic/transports/http-sse/",
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
    channel: "HTTP SSE / WebSocket",
    guest: "浏览器客户端",
    guestNote: "订阅事件流，渲染流式对话、状态面板与生成式 UI 组件",
    badge: "Copilot / 对话工作台",
    desc: "结合 @ag-ui/client 或 CopilotKit，构建高可观测的网页智能体界面。",
    href: "/sdk/",
  },
  {
    id: "chat",
    name: "聊天协作平台",
    icon: "ph:chat-text",
    channel: "Webhook / 平台适配器",
    guest: "Slack / Microsoft Teams",
    guestNote: "将工具调用与审批中断事件映射为消息、交互卡片与回调",
    badge: "团队 IM 协作入口",
    desc: "同一套智能体无需重写交互逻辑，即可接入常见协同工具消息卡片。",
    href: "/integrations/",
  },
  {
    id: "terminal",
    name: "终端与工具",
    icon: "ph:terminal-window",
    channel: "HTTP Stream · CLI",
    guest: "命令行客户端",
    guestNote: "流式打印文本增量与工具日志，支持本地审批与键盘交互",
    badge: "开发 / 自动化工作流",
    desc: "轻量直观地监听协议事件流，适合调试、运维脚本与开发工具。",
    href: "/quickstart/clients/",
  },
];

export const howStats = [
  { value: "31", unit: "种", label: "标准事件类型", desc: "归属 8 个事件族，覆盖生命周期、消息、状态、工具与推理。" },
  { value: "3", unit: "层", label: "协议栈协同", desc: "MCP 提供工具，A2A 连接智能体，AG-UI 连接用户界面。" },
  { value: "∞", unit: "", label: "传输与扩展", desc: "独立于 HTTP SSE / WebSocket，并可通过 CUSTOM 事件扩展。" },
];
