<p align="center">
<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/libracoder/kiri/main/brand/logo/kiri-horizontal-dark.svg">
<img src="https://raw.githubusercontent.com/libracoder/kiri/main/brand/logo/kiri-horizontal-light.svg" alt="Kiri" width="220">
</picture>
</p>

<p align="center">
<b>适用于 macOS、Windows 和 Linux 的小巧、快速的容器运行时。</b><br>
直接运行你的 Docker 镜像，并与你熟悉的 <code>docker</code> CLI、Compose 和 buildx 配合使用。
</p>

<p align="center">
<a href="https://runkiri.com/releases/">下载</a> ·
<a href="src/content/docs/features.mdx">功能特性</a> ·
<a href="https://github.com/libracoder/kiri/blob/main/docs/development.md">从源码构建</a> ·
<a href="https://github.com/libracoder/kiri/releases">发布版本</a>
</p>

<p align="center">
<a href="https://github.com/libracoder/kiri/releases/latest"><img alt="最新版本" src="https://img.shields.io/github/v/release/libracoder/kiri?label=release&color=2f6feb"></a>
<a href="https://github.com/libracoder/kiri/blob/main/LICENSE"><img alt="许可证：Apache-2.0" src="https://img.shields.io/badge/license-Apache--2.0-555"></a>
<a href=""><img alt="支持 38 种语言" src="https://img.shields.io/badge/languages-38-2ea043"></a>
</p>

<p align="center">
🇬🇧 🇮🇩 🇩🇪 🇪🇸 🇫🇷 🇮🇹 🇵🇱 🇧🇷 🇻🇳 🇹🇷 🇷🇺 🇸🇦 🇯🇵 🇰🇷 🇨🇳 🇹🇼<br>
Kiri 支持 38 种语言。<a href="">有你的语言吗？</a>
</p>

<p align="center">
<img src="https://raw.githubusercontent.com/libracoder/kiri/main/docs/images/kiri-window.png" alt="Kiri 窗口：按 Compose 项目分组的容器，显示状态、端口、本地域名与占用大小" width="900">
</p>

Kiri 是用 Rust 编写的 Docker Desktop 与 OrbStack 轻量替代方案。它在一个精简的
Linux 虚拟机中运行容器（在 Linux 上则直接运行于宿主机内核），并实现 Docker Engine
API，因此你现有的工具都能照常工作。

名字来自伊博语单词 *ntakịrị*，意为“小”。

本仓库是 Kiri 的中文文档站点，源码位于本仓库的 `src/content/docs/`。

## 为什么选择 Kiri

- **快速**：通过 Docker API 启动并退出一个容器约需 2.5 ms，比 Docker Desktop 快约 80 倍。
- **轻量**：虚拟机空闲 60 秒后休眠，守护进程常驻内存约 15 MB，唤醒约需 0.15 秒。
- **兼容**：支持 `docker`、Compose、buildx、`docker login`，并可通过 Rosetta 运行 amd64 镜像。
- **本地域名**：`http://<name>.kiri.local`，并由 Kiri 自带的证书颁发机构提供 HTTPS。
- **不止容器**：一条命令启动 Kubernetes 集群，还可创建 Linux 机器。
- **原生窗口**：管理容器、镜像、卷和网络，并提供菜单栏入口。
- **多语言**：支持 38 种语言，在 macOS、Windows 和 Linux 上均可使用。

### 界面语言

Kiri 的窗口和设置向导提供以下语言。它会跟随系统语言，你也可以在“设置 → 外观”中修改。在阿拉伯语、波斯语和中库尔德语下，整个窗口从右到左显示。

|  | 语言 |  | 语言 |  | 语言 |  | 语言 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 🇬🇧 | English | 🇳🇴 | Norsk bokmål | 🇧🇬 | Български | 🇮🇳 | తెలుగు |
| 🇮🇩 | Bahasa Indonesia | 🇵🇱 | Polski | 🇷🇺 | Русский | 🇹🇭 | ไทย |
| 🇦🇩 | Català | 🇧🇷 | Português (Brasil) | 🇺🇦 | Українська | 🇱🇦 | ລາວ |
| 🇨🇿 | Čeština | 🇷🇴 | Română | 🇰🇿 | Қазақша | 🇯🇵 | 日本語 |
| 🇩🇪 | Deutsch | 🇦🇱 | Shqip | 🇸🇦 | العربية | 🇰🇷 | 한국어 |
| 🇪🇸 | Español | 🇸🇮 | Slovenščina | 🇮🇷 | فارسی | 🇨🇳 | 简体中文 |
| 🇫🇷 | Français | 🇫🇮 | Suomi | 🇮🇶 | کوردیی ناوەندی | 🇹🇼 | 繁體中文 |
| 🇮🇹 | Italiano | 🇻🇳 | Tiếng Việt | 🇮🇳 | हिन्दी | 🇪🇹 | አማርኛ |
| 🇱🇹 | Lietuvių | 🇹🇷 | Türkçe | 🇧🇩 | বাংলা |  |  |
| 🇭🇺 | Magyar | 🇬🇷 | Ελληνικά | 🇮🇳 | தமிழ் |  |  |

缺少你的语言？翻译文件位于 `crates/kiri/src/ui/lang`，参见“贡献”一节。

## 安装

| 平台 | 获取方式 |
| --- | --- |
| macOS 14+（Apple 芯片或 Intel） | 从 [runkiri.com/releases](https://runkiri.com/releases/) 下载 `.dmg` |
| Windows 10 和 11（x86-64 或 Arm，通过 WSL 2） | 从 [runkiri.com/releases](https://runkiri.com/releases/) 下载 `.msi` |
| Linux（Ubuntu、Fedora 等） | 从 [runkiri.com/releases](https://runkiri.com/releases/) 下载 `.deb` 或 `.rpm` |

首次打开 Kiri 时，它会创建一个名为 `kiri` 的 Docker context。Kiri 会自动更新，并在安装每个新版本前先校验其签名。

## 快速开始

```sh
docker --context kiri run --rm alpine echo hello
docker --context kiri compose up -d
kiri k8s start                      # 以 `kiri` kubectl context 启动单节点 Kubernetes
kiri machine create dev --distro ubuntu && kiri machine shell dev
kiri import                         # 从 OrbStack 或 Docker Desktop 迁移镜像、卷和容器
```

Docker 的命令也可以作为 `kiri` 命令使用（`kiri run`、`kiri ps`、`kiri compose up` 等），并且始终指向 Kiri。

## 性能数据

运行 `alpine` 执行 `true` 后删除容器，30 次运行的中位数，三者使用相同的 `docker` CLI：

|  | Docker Engine API | `docker` CLI |
| --- | --- | --- |
| **Kiri** | **2.55 ms** | **14.2 ms** |
| Docker Desktop | 213 ms | 243 ms |
| OrbStack | 380 ms | 442 ms |

测试方法与其余数据见 `bench/results.json`。可用 `kiri bench` 重新运行。

## 工作原理

```
docker CLI ─┐
compose ────┼─ Docker Engine API ─► kiri daemon ── vsock ──► guest agent (PID 1)
buildx ─────┤                         owns the VM           clone3 → container
kiri UI ────┘
```

虚拟机使用定制的 10 MB 内核，其 PID 1 是一个约 900 KB 的 Rust agent。该 agent 通过一次 `clone3` 进入命名空间和 cgroup 来启动容器，没有 runc、没有 shim，也没有 dockerd。更多细节见 `docs/development.md`。

## 文档

- [功能特性](src/content/docs/features.mdx)：当前支持的全部能力、各版本文件与已知问题
- [从源码构建](https://github.com/libracoder/kiri/blob/main/docs/development.md)：构建、从源码运行、架构与仓库结构
- [更新日志](src/content/docs/guide/whats-new.mdx)

## 路线图

下一步是内置构建器。Kiri 将实现 Docker 自己的构建接口，因此 buildx 可以像对 Docker Desktop 那样，用它的 docker driver 连接 Kiri。这将为 BuildKit 构建带来 `host-gateway` 支持，镜像也会直接载入 Kiri。

## 贡献

欢迎提交 issue 和 pull request。请参阅 `CONTRIBUTING.md` 与行为准则。如需私下报告安全问题，请参阅 `SECURITY.md`。

## 许可证

Apache-2.0。第三方许可证见 `NOTICE`。虚拟机的客户内核为 Linux（GPL-2.0），其配置、补丁与源码获取方式位于 `guest/kernel`。

“Kiri”名称与 Kiri 标志不在许可证覆盖范围内。欢迎分叉，但请使用不同的名称与标志。
