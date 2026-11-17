<div align="center">

<a href="https://docs.ag-ui.com"><img alt="AG-UI" src="https://raw.githubusercontent.com/ag-ui-protocol/ag-ui/main/.github/readme/wordmark.svg" width="320"></a>

### 连接任意智能体与任意应用的开源协议。

<a href="https://www.npmjs.com/package/@ag-ui/core"><img src="https://img.shields.io/npm/v/%40ag-ui%2Fcore?logo=npm&logoColor=white&label=npm&color=6963ff" alt="npm version"></a>
<a href="https://www.npmjs.com/package/@ag-ui/core"><img src="https://img.shields.io/npm/dw/%40ag-ui%2Fcore?logo=npm&logoColor=white&label=downloads&color=6963ff" alt="npm weekly downloads"></a>
<a href="https://pypi.org/project/ag-ui-protocol/"><img src="https://img.shields.io/pypi/v/ag-ui-protocol?logo=pypi&logoColor=white&label=pypi&color=6963ff" alt="PyPI version"></a>
<a href="https://discord.gg/Jd3FzfdJa8"><img src="https://img.shields.io/discord/1379082175625953370?logo=discord&logoColor=white&label=discord&color=6963ff" alt="Discord"></a>
<a href="https://github.com/ag-ui-protocol/ag-ui/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-6963ff" alt="License: MIT"></a>

**[文档](https://docs.ag-ui.com)** · **[示例](https://dojo.ag-ui.com)** · **[规范](https://docs.ag-ui.com/spec/1.0)** · **[Discord](https://discord.gg/Jd3FzfdJa8)**

<a href="https://docs.ag-ui.com/talk-to-us"><img alt="在生产环境中使用 AG-UI？与团队联系" src="https://raw.githubusercontent.com/ag-ui-protocol/ag-ui/main/.github/readme/talk-to-the-team.svg" width="400"></a>

<a href="https://trendshift.io/repositories/27961?utm_source=repository-badge&utm_medium=badge&utm_campaign=badge-repository-27961"><img src="https://trendshift.io/api/badge/repositories/27961" alt="ag-ui-protocol%2Fag-ui | Trendshift" width="250" height="55"></a>

</div>

<br>

**AG-UI 是一个开放、轻量、基于事件的协议，用于标准化 AI 智能体与面向用户的应用之间的连接方式。**

智能体并不适合请求／响应模型。它们会流式输出 token、在回复过程中调用工具、更新共享状态、暂停等待人工介入，还会派生（spawn）子智能体，而每个框架的做法各不相同。AG-UI 用一条双向事件流取代这些自定义接线：智能体发出带类型的事件，任何客户端都能渲染它们，无论智能体是由哪个框架构建的。同一个智能体可以同时驱动 Web 应用、移动应用、终端或 Slack。

<a href="https://docs.ag-ui.com"><img alt="AG-UI 把任意智能体连接到任意应用：Web 应用、移动端、Slack 与 Teams、终端客户端通过 AG-UI 与用 LangChain、CrewAI、Mastra、Google ADK、Microsoft Agent Framework、Pydantic AI 或任意框架构建的智能体双向通信，支持流式对话、生成式 UI、共享状态、人工介入、前端工具与子智能体；AG-UI 与负责工具的 MCP、负责智能体之间协作的 A2A 并存。" src="https://raw.githubusercontent.com/ag-ui-protocol/ag-ui/main/.github/readme/overview.svg" width="880"></a>

> [!IMPORTANT]
> **AG-UI 1.0 已发布。** 协议现在有了稳定、已冻结的[规范](https://docs.ag-ui.com/spec/1.0)，并由 JSON Schema 支撑，TypeScript、Python 和 .NET SDK 均由该规范生成。1.0 双向向后兼容：0.x 的智能体可与 1.0 的客户端配合，反之亦然。[有何变化 →](https://docs.ag-ui.com/spec/1.0/changelog) · [迁移指南 →](https://docs.ag-ui.com/migrating-to-1-0)

## 快速开始

**新建一个应用。** CLI 会搭建一个前端（Next.js 上的 [CopilotKit](https://github.com/CopilotKit/CopilotKit)，或终端客户端），并接好你选择的智能体框架：

```bash
npx create-ag-ui-app@latest
```

然后按它打印的后续步骤操作。生成的模板会调用 OpenAI，因此在 `npm run dev` 之前先设置你的密钥：

```bash
export OPENAI_API_KEY="sk-..."
```

<details>
<summary><b>或者直接使用协议本身：一个 30 行的智能体服务端与客户端</b></summary>
<br>

AG-UI 智能体就是任意一个接受 `RunAgentInput`、流式返回事件的 HTTP 端点。这个例子不需要任何 API 密钥。

**1. 智能体（Python）。** 需要 Python 3.9+。

```bash
pip install ag-ui-protocol fastapi uvicorn
```

```python
# server.py
import uuid

from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse
from ag_ui.core import (
    PROTOCOL_VERSION,
    RunAgentInput,
    RunStartedEvent,
    RunFinishedEvent,
    TextMessageStartEvent,
    TextMessageContentEvent,
    TextMessageEndEvent,
)
from ag_ui.encoder import EventEncoder

app = FastAPI()

@app.post("/")
async def run_agent(input_data: RunAgentInput, request: Request):
    encoder = EventEncoder(accept=request.headers.get("accept"))

    async def events():
        yield encoder.encode(RunStartedEvent(
            thread_id=input_data.thread_id,
            run_id=input_data.run_id,
            protocol_version=PROTOCOL_VERSION,
        ))
        message_id = str(uuid.uuid4())
        yield encoder.encode(TextMessageStartEvent(message_id=message_id, role="assistant"))
        for chunk in ["Hello ", "from ", "AG-UI!"]:
            yield encoder.encode(TextMessageContentEvent(message_id=message_id, delta=chunk))
        yield encoder.encode(TextMessageEndEvent(message_id=message_id))
        yield encoder.encode(RunFinishedEvent(thread_id=input_data.thread_id, run_id=input_data.run_id))

    return StreamingResponse(events(), media_type=encoder.get_content_type())
```

```bash
uvicorn server:app --port 8000
```

**2. 客户端（TypeScript）。** 在第二个终端、一个新目录中进行。需要 Node.js 20+。

```bash
npm init -y && npm pkg set type=module
npm install @ag-ui/client tsx
```

```ts
// client.ts
import { HttpAgent } from "@ag-ui/client";

const agent = new HttpAgent({ url: "http://localhost:8000/" });

agent.addMessage({ id: crypto.randomUUID(), role: "user", content: "Hi there!" });

await agent.runAgent({}, {
  onRunStartedEvent: ({ event }) => console.log(`run started (AG-UI ${event.protocolVersion})`),
  onTextMessageContentEvent: ({ event }) => { process.stdout.write(event.delta); },
  onRunFinishedEvent: () => console.log("\nrun finished"),
});
```

```bash
npx tsx client.ts
```

你应该会看到 `Hello from AG-UI!` 流式输出。把服务端换成任意[支持的框架](#集成)，客户端无需改动。

</details>

## AG-UI 的定位

![示意图展示 AG-UI 的定位：用户在应用中进行操作，应用通过 AG-UI（智能体到用户）连接你的智能体；智能体通过 MCP 访问工具与数据，通过 A2A 与其他智能体协作；一个智能体常常同时使用三者。](https://raw.githubusercontent.com/ag-ui-protocol/ag-ui/main/.github/readme/protocol-stack.svg)

AG-UI 是三个开放且互补的智能体协议之一。**MCP** 为智能体提供工具与上下文，**A2A** 让智能体与其他智能体协作，**AG-UI** 把智能体带给用户。一个智能体常常同时使用三者，而 AG-UI 也可以在前端对接使用 MCP 或 A2A 的智能体。[了解更多 →](https://docs.ag-ui.com/agentic-protocols)

> [!NOTE]
> **AG-UI 还是 A2UI？** 两者可以配合使用。[A2UI](https://github.com/google/A2UI)、MCP Apps 和 Open-JSON-UI 属于*生成式 UI 规范*：它们描述智能体想展示的 UI。AG-UI 是*运行时协议*，负责把这些负载连同其他所有内容一起在智能体与应用之间传输。[进一步了解 →](https://docs.ag-ui.com/concepts/generative-ui-specs)

## 集成

AG-UI 已被 Google、Microsoft、Amazon 和 Oracle 采用，并内置于大多数智能体框架中。下表中的每个框架在 [Dojo](https://dojo.ag-ui.com) 中都有在线演示。

<table>
  <tr>
    <td align="center" valign="top" width="25%"><img src="https://raw.githubusercontent.com/ag-ui-protocol/ag-ui/main/.github/readme/logos/langchain.svg" width="40" height="40" alt="LangChain logo"><br><b>LangChain</b><br><sub><a href="https://docs.copilotkit.ai/langgraph/">文档</a> · <a href="https://dojo.ag-ui.com/langgraph-fastapi/feature/agentic_chat">演示</a></sub></td>
    <td align="center" valign="top" width="25%"><img src="https://raw.githubusercontent.com/ag-ui-protocol/ag-ui/main/.github/readme/logos/crewai.svg" width="40" height="40" alt="CrewAI logo"><br><b>CrewAI</b><br><sub><a href="https://docs.copilotkit.ai/crewai-flows">文档</a> · <a href="https://dojo.ag-ui.com/crewai/feature/agentic_chat">演示</a></sub></td>
    <td align="center" valign="top" width="25%"><img src="https://raw.githubusercontent.com/ag-ui-protocol/ag-ui/main/.github/readme/logos/microsoft-agent-framework.svg" width="40" height="40" alt="Microsoft Agent Framework logo"><br><b>Microsoft Agent Framework</b><br><sub><a href="https://docs.copilotkit.ai/microsoft-agent-framework">文档</a> · <a href="https://dojo.ag-ui.com/microsoft-agent-framework-python/feature/agentic_chat">演示</a></sub></td>
    <td align="center" valign="top" width="25%"><img src="https://raw.githubusercontent.com/ag-ui-protocol/ag-ui/main/.github/readme/logos/google-adk.svg" width="40" height="40" alt="Google ADK logo"><br><b>Google ADK</b><br><sub><a href="https://docs.copilotkit.ai/adk">文档</a> · <a href="https://dojo.ag-ui.com/adk-middleware/feature/agentic_chat">演示</a></sub></td>
  </tr>
  <tr>
    <td align="center" valign="top" width="25%"><img src="https://raw.githubusercontent.com/ag-ui-protocol/ag-ui/main/.github/readme/logos/aws-strands.svg" width="40" height="40" alt="AWS Strands Agents logo"><br><b>AWS Strands Agents</b><br><sub><a href="https://docs.copilotkit.ai/aws-strands">文档</a> · <a href="https://dojo.ag-ui.com/aws-strands/feature/agentic_chat">演示</a></sub></td>
    <td align="center" valign="top" width="25%"><img src="https://raw.githubusercontent.com/ag-ui-protocol/ag-ui/main/.github/readme/logos/mastra.svg" width="40" height="40" alt="Mastra logo"><br><b>Mastra</b><br><sub><a href="https://docs.copilotkit.ai/mastra/">文档</a> · <a href="https://dojo.ag-ui.com/mastra/feature/agentic_chat">演示</a></sub></td>
    <td align="center" valign="top" width="25%"><img src="https://raw.githubusercontent.com/ag-ui-protocol/ag-ui/main/.github/readme/logos/pydantic-ai.svg" width="40" height="40" alt="Pydantic AI logo"><br><b>Pydantic AI</b><br><sub><a href="https://docs.copilotkit.ai/pydantic-ai/">文档</a> · <a href="https://dojo.ag-ui.com/pydantic-ai/feature/agentic_chat">演示</a></sub></td>
    <td align="center" valign="top" width="25%"><img src="https://raw.githubusercontent.com/ag-ui-protocol/ag-ui/main/.github/readme/logos/llamaindex.svg" width="40" height="40" alt="LlamaIndex logo"><br><b>LlamaIndex</b><br><sub><a href="https://docs.copilotkit.ai/llamaindex/">文档</a> · <a href="https://dojo.ag-ui.com/llama-index/feature/agentic_chat">演示</a></sub></td>
  </tr>
  <tr>
    <td align="center" valign="top" width="25%"><img src="https://raw.githubusercontent.com/ag-ui-protocol/ag-ui/main/.github/readme/logos/agno.svg" width="40" height="40" alt="Agno logo"><br><b>Agno</b><br><sub><a href="https://docs.copilotkit.ai/agno/">文档</a> · <a href="https://dojo.ag-ui.com/agno/feature/agentic_chat">演示</a></sub></td>
    <td align="center" valign="top" width="25%"><img src="https://raw.githubusercontent.com/ag-ui-protocol/ag-ui/main/.github/readme/logos/ag2.svg" width="40" height="40" alt="AG2 logo"><br><b>AG2</b><br><sub><a href="https://docs.copilotkit.ai/ag2/">文档</a> · <a href="https://dojo.ag-ui.com/ag2/feature/agentic_chat">演示</a></sub></td>
    <td align="center" valign="top" width="25%"><img src="https://raw.githubusercontent.com/ag-ui-protocol/ag-ui/main/.github/readme/logos/claude-agent-sdk.svg" width="40" height="40" alt="Claude Agent SDK logo"><br><b>Claude Agent SDK</b><br><sub><a href="https://github.com/ag-ui-protocol/ag-ui/tree/main/integrations/claude-agent-sdk">文档</a> · <a href="https://dojo.ag-ui.com/claude-agent-sdk-python/feature/agentic_chat">演示</a></sub></td>
    <td align="center" valign="top" width="25%"><br><b><a href="https://docs.ag-ui.com/integrations">还有 11 个</a></b><br><sub>Antigravity、OpenAI Agents、watsonx、Spring AI 等，见<a href="#完整集成列表">完整列表</a></sub></td>
  </tr>
</table>

**协议：** [A2A](https://docs.copilotkit.ai/a2a-protocol) · [MCP](https://github.com/ag-ui-protocol/ag-ui/tree/main/middlewares/mcp-middleware) · [MCP Apps](https://docs.copilotkit.ai/generative-ui-specs/mcp-apps) · [A2UI](https://github.com/ag-ui-protocol/ag-ui/tree/main/middlewares/a2ui-middleware)\
**客户端：** [CopilotKit](https://github.com/CopilotKit/CopilotKit)（React、Angular、Vue、React Native） · [Slack 与 Teams](https://github.com/CopilotKit/channels-sdk) · [终端](https://docs.ag-ui.com/quickstart/clients) · [OpenBot](https://open.bot/builders)

没有看到你用的框架？[编写一个集成 →](https://docs.ag-ui.com/quickstart/introduction)

### 完整集成列表

<details>
<summary><b>展开全部集成</b></summary>
<br>

- **合作伙伴：** [LangChain](https://docs.copilotkit.ai/langgraph/) · [CrewAI](https://docs.copilotkit.ai/crewai-flows)
- **内置支持：** [Microsoft Agent Framework](https://docs.copilotkit.ai/microsoft-agent-framework) · [Google ADK](https://docs.copilotkit.ai/adk)（[JS](https://docs.ag-ui.com/integrations/google-adk-js)） · [Google Antigravity](https://docs.copilotkit.ai/google-antigravity) · [AWS Strands Agents](https://docs.copilotkit.ai/aws-strands) · [Mastra](https://docs.copilotkit.ai/mastra/) · [Pydantic AI](https://docs.copilotkit.ai/pydantic-ai/) · [Agno](https://docs.copilotkit.ai/agno/) · [LlamaIndex](https://docs.copilotkit.ai/llamaindex/) · [AG2](https://docs.copilotkit.ai/ag2/)
- **更多框架：** [Claude Agent SDK](https://github.com/ag-ui-protocol/ag-ui/tree/main/integrations/claude-agent-sdk) · [Claude Managed Agents](https://github.com/ag-ui-protocol/ag-ui/tree/main/integrations/claude-managed-agents) · [IBM watsonx Orchestrate](https://github.com/ag-ui-protocol/ag-ui/tree/main/integrations/watsonx) · [Langroid](https://github.com/ag-ui-protocol/ag-ui/tree/main/integrations/langroid) · [Spring AI](https://github.com/ag-ui-protocol/ag-ui/tree/main/integrations/community/spring-ai) · [Cloudflare Agents](https://github.com/ag-ui-protocol/ag-ui/tree/main/integrations/community/cloudflare-agents) · [Omnara](https://docs.ag-ui.com/integrations/omnara) · [Genkit (Go)](https://github.com/ag-ui-protocol/ag-ui/tree/main/integrations/community/genkit/go) · [OpenAI Agents](https://github.com/ag-ui-protocol/ag-ui/tree/main/integrations/openai-agents)
- **规范：** [Oracle Agent Spec](https://go.copilotkit.ai/copilotkit-oracle-docs)
- **部署：** [Amazon Bedrock AgentCore](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-agui.html)

所有集成的源码位于 [`integrations/`](https://github.com/ag-ui-protocol/ag-ui/tree/main/integrations) 和 [`middlewares/`](https://github.com/ag-ui-protocol/ag-ui/tree/main/middlewares)，演示位于 [`apps/dojo`](https://github.com/ag-ui-protocol/ag-ui/tree/main/apps/dojo)。

</details>

## SDK

| 语言 | 安装 | 参考 |
| --- | --- | --- |
| **TypeScript** | `npm install @ag-ui/client` | [文档](https://docs.ag-ui.com/sdk/js/core/overview) · [源码](https://github.com/ag-ui-protocol/ag-ui/tree/main/sdks/typescript) |
| **Python** | `pip install ag-ui-protocol` | [文档](https://docs.ag-ui.com/sdk/python/core/overview) · [源码](https://github.com/ag-ui-protocol/ag-ui/tree/main/sdks/python) |
| **.NET** | `dotnet add package AGUI.Client` | [文档](https://docs.ag-ui.com/sdk/dotnet/client/overview) · [源码](https://github.com/ag-ui-protocol/ag-ui/tree/main/sdks/dotnet) |

**社区 SDK：** [Kotlin](https://github.com/ag-ui-protocol/ag-ui/tree/main/sdks/community/kotlin) · [Go](https://github.com/ag-ui-protocol/ag-ui/tree/main/sdks/community/go) · [Java](https://github.com/ag-ui-protocol/ag-ui/tree/main/sdks/community/java) · [Dart](https://github.com/ag-ui-protocol/ag-ui/tree/main/sdks/community/dart) · [Rust](https://github.com/ag-ui-protocol/ag-ui/tree/main/sdks/community/rust) · [Ruby](https://github.com/ag-ui-protocol/ag-ui/tree/main/sdks/community/ruby) · [C++](https://github.com/ag-ui-protocol/ag-ui/tree/main/sdks/community/c++) · [Swift](https://github.com/ag-ui-protocol/ag-ui/tree/main/sdks/community/swift)

## 能力：你能构建什么

每个能力对应规范中的事件，并且都在 [AG-UI Dojo](https://dojo.ag-ui.com) 中有在线演示。

| 能力 | 作用 | 试一试 |
| --- | --- | --- |
| **流式对话** | 跨多轮会话的逐 token 消息，支持取消与恢复 | [演示](https://dojo.ag-ui.com/langgraph-fastapi/feature/agentic_chat) |
| **生成式 UI** | 智能体渲染带类型的组件，或用 [A2UI](https://github.com/google/A2UI) 与 MCP Apps 渲染声明式 UI | [演示](https://dojo.ag-ui.com/langgraph-fastapi/feature/tool_based_generative_ui) |
| **共享状态** | 智能体与应用共同读写的带类型存储，通过快照与 JSON Patch 增量同步 | [演示](https://dojo.ag-ui.com/langgraph-fastapi/feature/shared_state) |
| **前端工具** | 智能体调用在应用中运行的工具，并取回结果 | [演示](https://dojo.ag-ui.com/langgraph-fastapi/feature/human_in_the_loop) |
| **人工介入** | 运行以 `interrupt` 结果结束；用户批准、编辑或拒绝后，下一次运行继续 | [演示](https://dojo.ag-ui.com/mastra/feature/interrupt) |
| **推理** | 在工作过程中展示智能体的推理，包括加密推理的往返传输 | [演示](https://dojo.ag-ui.com/langgraph-fastapi/feature/agentic_chat_reasoning) |
| **子智能体** | 嵌套委派，每个事件都可追溯到产生它的子智能体运行 | [演示](https://dojo.ag-ui.com/langgraph-fastapi/feature/deepagents_subagents) |
| **多模态** | 用户输入与工具结果中的图像、音频、视频和文档 | [演示](https://dojo.ag-ui.com/langgraph-fastapi/feature/agentic_chat_multimodal) |

工具输出流式传输、后端工具渲染、活动进度、token 用量与自定义事件在[文档](https://docs.ag-ui.com/concepts/events)中介绍。下面是 Dojo 的快速导览：

https://github.com/user-attachments/assets/c298eea8-3f39-4a94-b968-7712429b0c49

## 工作原理

![AG-UI 工作原理示意图：你的应用（CopilotKit、React、移动端、终端、Slack 或任意客户端）向你的智能体（LangChain、CrewAI、Mastra、Google ADK、Pydantic AI 或任意框架）发送一个包含消息、工具、状态和上下文的 RunAgentInput，智能体则通过 SSE、WebSockets 或 HTTP 二进制（Protobuf）等任意传输方式，流式返回用于生命周期、文本消息、工具调用、状态、推理、活动、子智能体以及自定义与原始数据的带类型 AG-UI 事件。](https://raw.githubusercontent.com/ag-ui-protocol/ag-ui/main/.github/readme/how-it-works.svg)

你的应用通过向智能体发送一个 `RunAgentInput` 来启动一次运行：对话内容、前端提供的工具、共享状态和上下文。智能体用八个事件族中的带类型事件流作为回应：运行生命周期、文本消息、工具调用、状态、推理、活动、子智能体和自定义事件（[完整列表](#事件参考)）。其中只有运行生命周期是必需的，因此一个最小化的智能体只需发出少量事件，再逐步扩展。

AG-UI 与传输方式无关。规范定义了 [HTTP + SSE](https://docs.ag-ui.com/spec/1.0/basic/transports/http-sse) 和二进制 [HTTP + Protobuf](https://docs.ag-ui.com/spec/1.0/basic/transports/http-protobuf) 绑定，中间件也可以适配任意来源的事件。完整图景见[架构概览](https://docs.ag-ui.com/concepts/architecture)。

## 事件参考

AG-UI 1.0 在八个事件族中定义了 31 种事件类型。每个字段的说明见[规范](https://docs.ag-ui.com/spec/1.0/events)。

| 事件族 | 事件 |
| --- | --- |
| [运行与步骤](https://docs.ag-ui.com/spec/1.0/events/lifecycle) | `RUN_STARTED` `RUN_FINISHED` `RUN_ERROR` `STEP_STARTED` `STEP_FINISHED` |
| [文本消息](https://docs.ag-ui.com/spec/1.0/events/text-messages) | `TEXT_MESSAGE_START` `TEXT_MESSAGE_CONTENT` `TEXT_MESSAGE_END` `TEXT_MESSAGE_CHUNK` |
| [工具调用](https://docs.ag-ui.com/spec/1.0/events/tool-calls) | `TOOL_CALL_START` `TOOL_CALL_ARGS` `TOOL_CALL_END` `TOOL_CALL_RESULT` `TOOL_CALL_CHUNK` |
| [状态](https://docs.ag-ui.com/spec/1.0/events/state) | `STATE_SNAPSHOT` `STATE_DELTA`（JSON Patch） `MESSAGES_SNAPSHOT` |
| [推理](https://docs.ag-ui.com/spec/1.0/events/reasoning) | `REASONING_START` `REASONING_MESSAGE_*` `REASONING_ENCRYPTED_VALUE` `REASONING_END` |
| [活动](https://docs.ag-ui.com/spec/1.0/events/activity) | `ACTIVITY_SNAPSHOT` `ACTIVITY_DELTA` |
| [子智能体](https://docs.ag-ui.com/spec/1.0/events/subagents) | `SUBAGENT_STARTED` `SUBAGENT_FINISHED` `SUBAGENT_ERROR` |
| [透传](https://docs.ag-ui.com/spec/1.0/events/passthrough) | `RAW` `CUSTOM` |

## 社区

- **提问与想法：** [Discord](https://discord.gg/Jd3FzfdJa8) 与 [GitHub Discussions](https://github.com/ag-ui-protocol/ag-ui/discussions)
- **缺陷报告：** [GitHub Issues](https://github.com/ag-ui-protocol/ag-ui/issues)
- **接下来做什么：** [路线图](https://github.com/orgs/ag-ui-protocol/projects/1) 与[草案规范](https://docs.ag-ui.com/spec/draft)

## 贡献

欢迎贡献：新的集成、SDK、文档与修复。请先阅读 [CONTRIBUTING.md](https://github.com/ag-ui-protocol/ag-ui/blob/main/CONTRIBUTING.md)，并以[服务端模板](https://github.com/ag-ui-protocol/ag-ui/tree/main/integrations/server-starter)和[中间件模板](https://github.com/ag-ui-protocol/ag-ui/tree/main/middlewares/middleware-starter)作为新集成的起点。安全问题请按 [SECURITY.md](https://github.com/ag-ui-protocol/ag-ui/blob/main/SECURITY.md) 中的说明报告。

AG-UI 由 [CopilotKit](https://copilotkit.ai) 创建，并与社区一起公开开发。

> 本文是 [ag-ui-protocol/ag-ui](https://github.com/ag-ui-protocol/ag-ui/blob/main/README.md) 官方 README 的中文翻译；如中英文表述有出入，以英文原文为准。

## 许可证

AG-UI 基于 [MIT 许可证](https://github.com/ag-ui-protocol/ag-ui/blob/main/LICENSE)开源。
