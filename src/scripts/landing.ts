/**
 * Landing page interactivity for the AG-UI Chinese site:
 * navigation chrome, Hero protocol inspector, interactive AG-UI event sandbox,
 * multi-language SDK code switcher, and multi-platform architecture diagram.
 * All listeners and timers tear down cleanly on `astro:before-swap`.
 */
import {
  heroScenarios,
  sandboxScenarios,
  sdkSnippets,
  highlightSdkCode,
  platforms,
  navLinks,
  type SandboxFrame,
} from "../lib/landing";

type Teardown = () => void;
let teardowns: Teardown[] = [];

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, "");
const withBase = (path: string) => `${baseUrl}${path}`;

const nativeView =
  typeof CSS !== "undefined" && CSS.supports("(animation-timeline: view()) and (animation-range: entry)");
const nativeScroll =
  typeof CSS !== "undefined" && CSS.supports("(animation-timeline: scroll()) and (animation-range: 0% 100%)");
const nativeSpy = typeof CSS !== "undefined" && CSS.supports("scroll-target-group: auto");

function listen<K extends keyof HTMLElementEventMap>(
  el: HTMLElement | Document | Window,
  type: K | string,
  fn: (ev: never) => void,
  opts?: AddEventListenerOptions,
) {
  el.addEventListener(type, fn as EventListener, opts);
  teardowns.push(() => el.removeEventListener(type, fn as EventListener, opts));
}

function q<T extends Element>(root: ParentNode, sel: string): T | null {
  return root.querySelector<T>(sel);
}

function every<T extends Element>(root: ParentNode, sel: string): T[] {
  return Array.from(root.querySelectorAll<T>(sel));
}

function esc(s: string) {
  return s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c] as string);
}

/** Shared accessible tablist controller (click + Left/Right/Home/End keyboard roving). */
function bindTablist(
  tabs: HTMLButtonElement[],
  panel: HTMLElement | null,
  onSelect: (tab: HTMLButtonElement) => void,
) {
  if (!tabs.length) return;

  const activate = (btn: HTMLButtonElement) => {
    tabs.forEach((b) => {
      const on = b === btn;
      b.classList.toggle("is-on", on);
      b.setAttribute("aria-selected", String(on));
      b.tabIndex = on ? 0 : -1;
    });
    if (panel && btn.id) panel.setAttribute("aria-labelledby", btn.id);
    onSelect(btn);
  };

  tabs.forEach((btn, idx) => {
    listen(btn, "click", () => activate(btn));
    listen(btn, "keydown", (ev: KeyboardEvent) => {
      const keyIdx: Record<string, number> = {
        ArrowRight: (idx + 1) % tabs.length,
        ArrowLeft: (idx - 1 + tabs.length) % tabs.length,
        Home: 0,
        End: tabs.length - 1,
      };
      const next = keyIdx[ev.key];
      if (next === undefined) return;
      ev.preventDefault();
      tabs[next].focus();
      activate(tabs[next]);
    });
  });
}

/* ------------------------------------------------------------------ chrome */

function initChrome(root: HTMLElement) {
  const nav = q<HTMLElement>(root, "[data-k-nav]");
  const progress = q<HTMLElement>(root, "[data-k-progress]");
  const top = q<HTMLElement>(root, "[data-k-top]");
  const burger = q<HTMLButtonElement>(root, "[data-k-burger]");
  const mobile = q<HTMLElement>(root, "[data-k-mobile]");

  let max = 1;
  const measure = () => {
    max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  };
  measure();
  const ro = new ResizeObserver(measure);
  ro.observe(document.body);
  teardowns.push(() => ro.disconnect());
  listen(window, "resize", measure, { passive: true });

  const spies = every<HTMLAnchorElement>(root, "[data-k-spy]");
  const setCurrent = (id: string | null) => {
    spies.forEach((a) => {
      const on = a.dataset.kSpy === id;
      a.classList.toggle("is-active", on);
      if (on) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  };

  let queued = false;
  const onScroll = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      const y = window.scrollY;
      nav?.classList.toggle("is-scrolled", y > 8);
      if (progress && !nativeScroll) progress.style.setProperty("--k-p", String(Math.min(1, y / max)));
      top?.classList.toggle("is-on", y > 700);
      if (y <= 8) setCurrent(null);
    });
  };
  listen(window, "scroll", onScroll, { passive: true });
  onScroll();

  if (burger && mobile) {
    listen(burger, "click", () => {
      const open = mobile.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "关闭菜单" : "打开菜单");
    });
    every<HTMLAnchorElement>(mobile, "a").forEach((a) =>
      listen(a, "click", () => {
        mobile.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
        burger.setAttribute("aria-label", "打开菜单");
      }),
    );
    listen(document, "keydown", (ev: KeyboardEvent) => {
      if (ev.key !== "Escape" || !mobile.classList.contains("is-open")) return;
      mobile.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
      burger.setAttribute("aria-label", "打开菜单");
      burger.focus();
    });
  }

  const themeBtn = q<HTMLButtonElement>(root, "[data-k-theme]");
  if (themeBtn) {
    const sync = () =>
      themeBtn.setAttribute(
        "aria-pressed",
        String(document.documentElement.getAttribute("data-mode") === "dark"),
      );
    sync();
    listen(themeBtn, "click", () => {
      const dark = document.documentElement.getAttribute("data-mode") === "dark";
      const next = dark ? "light" : "dark";
      let persisted = false;
      try {
        localStorage.setItem("ui-mode", next);
        persisted = true;
      } catch {
        /* ignore refused storage */
      }
      const apply = (window as unknown as { __nbApplyTheme?: (m?: string) => void }).__nbApplyTheme;
      if (apply) apply(persisted ? undefined : next);
      else document.documentElement.setAttribute("data-mode", next);
      sync();
    });
    const mo = new MutationObserver(sync);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-mode"] });
    teardowns.push(() => mo.disconnect());
  }

  if (top) listen(top, "click", () => window.scrollTo({ top: 0, behavior: reduced() ? "auto" : "smooth" }));

  if (spies.length && nativeSpy) {
    const sync = () => {
      const cur = q<HTMLAnchorElement>(root, "[data-k-spy]:target-current");
      spies.forEach((a) => {
        if (a === cur) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    };
    sync();
    listen(document, "scrollend", () => requestAnimationFrame(() => requestAnimationFrame(sync)), {
      passive: true,
    });
  } else if (spies.length) {
    const sections = navLinks
      .map((l) => document.getElementById(l.href.slice(1)))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length) {
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) setCurrent(e.target.id);
          }
        },
        { rootMargin: "-45% 0px -50% 0px" },
      );
      sections.forEach((s) => io.observe(s));
      teardowns.push(() => io.disconnect());
    }
  }

  const items = every<HTMLElement>(root, "[data-reveal]");
  if (!nativeView && !reduced()) {
    root.classList.add("k-js-reveal");
    items.forEach((el) => el.style.setProperty("--k-i", el.dataset.i ?? "0"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    items.forEach((el) => io.observe(el));
    teardowns.push(() => io.disconnect());
  }

  every<HTMLButtonElement>(root, "[data-copy]").forEach((btn) => {
    const original = btn.innerHTML;
    let timer = 0;
    listen(btn, "click", async () => {
      const text = btn.dataset.copy ?? "";
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        return;
      }
      window.clearTimeout(timer);
      btn.classList.add("is-done");
      btn.textContent = btn.classList.contains("k-copy") ? "✓" : "已复制";
      timer = window.setTimeout(() => {
        btn.classList.remove("is-done");
        btn.innerHTML = original;
      }, 1500);
    });
    teardowns.push(() => window.clearTimeout(timer));
  });
}

/* --------------------------------------------------------- hero inspector */

function initHeroInspector(root: HTMLElement) {
  const box = q<HTMLElement>(root, "[data-k-hero-inspector]");
  if (!box) return;

  const tabs = every<HTMLButtonElement>(box, "[data-k-h-tab]");
  const panel = q<HTMLElement>(box, "[data-k-h-panel]");
  const wireList = q<HTMLElement>(box, "[data-k-h-wire]");
  const badge = q<HTMLElement>(box, "[data-k-h-badge]");
  const promptEl = q<HTMLElement>(box, "[data-k-h-prompt]");
  const replyEl = q<HTMLElement>(box, "[data-k-h-reply]");
  const wTitle = q<HTMLElement>(box, "[data-k-h-wtitle]");
  const wRows = q<HTMLElement>(box, "[data-k-h-wrows]");
  const actBox = q<HTMLElement>(box, "[data-k-h-act]");
  const approveBtn = q<HTMLButtonElement>(box, "[data-k-h-approve]");

  let current = heroScenarios[0];
  let resolved = false;

  const toneDot = (tone: "live" | "accent" | "rose" | "idle") => {
    if (tone === "idle") return "is-idle";
    if (tone === "rose") return "is-share";
    if (tone === "accent") return "is-accent";
    return "";
  };

  const renderScenario = (id: string) => {
    const sc = heroScenarios.find((item) => item.id === id) ?? heroScenarios[0];
    current = sc;
    resolved = false;

    if (wireList) {
      wireList.innerHTML = sc.events
        .map(
          (ev) => `<li class="k-row">
            <span class="k-row-dot ${toneDot(ev.tone)}"></span>
            <span class="k-row-name">${esc(ev.type)}</span>
            <span class="k-row-img">${esc(ev.meta)}</span>
          </li>`,
        )
        .join("");
    }
    if (badge) {
      badge.textContent = sc.widget.badge;
      badge.classList.toggle("is-wait", Boolean(sc.widget.actionLabel));
    }
    if (promptEl) promptEl.textContent = sc.prompt;
    if (replyEl) replyEl.textContent = sc.reply;
    if (wTitle) wTitle.textContent = sc.widget.title;
    if (wRows) {
      wRows.innerHTML = sc.widget.rows
        .map(
          (r) =>
            `<div class="k-wrow ${r.highlight ? "is-hi" : ""}"><span>${esc(r.k)}</span><b>${esc(r.v)}</b></div>`,
        )
        .join("");
    }
    if (actBox && approveBtn) {
      actBox.hidden = !sc.widget.actionLabel;
      if (sc.widget.actionLabel) {
        approveBtn.textContent = sc.widget.actionLabel;
        approveBtn.disabled = false;
      }
    }
  };

  bindTablist(tabs, panel, (btn) => {
    renderScenario(btn.dataset.kHTab ?? "stream");
  });

  if (approveBtn) {
    listen(approveBtn, "click", () => {
      if (resolved || !current.widget.resolvedEvent) return;
      resolved = true;
      approveBtn.disabled = true;
      approveBtn.textContent = "已授权执行";
      if (badge) {
        badge.textContent = "运行已恢复 · 完成";
        badge.classList.remove("is-wait");
      }
      if (replyEl && current.widget.resolvedReply) replyEl.textContent = current.widget.resolvedReply;
      if (wireList) {
        const ev = current.widget.resolvedEvent;
        const li = document.createElement("li");
        li.className = "k-row is-new";
        li.innerHTML = `<span class="k-row-dot"></span><span class="k-row-name">${esc(ev.type)}</span><span class="k-row-img">${esc(ev.meta)}</span>`;
        wireList.appendChild(li);
      }
    });
  }
}

/* -------------------------------------------------------- protocol sandbox */

function initSandbox(root: HTMLElement) {
  const box = q<HTMLElement>(root, "[data-k-sb]");
  if (!box) return;

  const tabs = every<HTMLButtonElement>(box, "[data-k-sb-tab]");
  const panel = q<HTMLElement>(box, "[data-k-sb-panel]");
  const playBtn = q<HTMLButtonElement>(box, "[data-k-sb-play]");
  const playLabel = q<HTMLElement>(box, "[data-k-sb-play-label]");
  const stepBtn = q<HTMLButtonElement>(box, "[data-k-sb-step]");
  const resetBtn = q<HTMLButtonElement>(box, "[data-k-sb-reset]");
  const speedSelect = q<HTMLSelectElement>(box, "[data-k-sb-speed]");
  const liveEl = q<HTMLElement>(box, "[data-k-sb-live]");
  const stateBadge = q<HTMLElement>(box, "[data-k-sb-state]");
  const track = q<HTMLElement>(box, "[data-k-sb-track]");
  const fill = q<HTMLElement>(box, "[data-k-sb-fill]");
  const token = q<HTMLElement>(box, "[data-k-sb-token]");
  const stepLabel = q<HTMLElement>(box, "[data-k-sb-step-label]");
  const caption = q<HTMLElement>(box, "[data-k-sb-caption]");
  const uiMode = q<HTMLElement>(box, "[data-k-sb-ui-mode]");
  const userEl = q<HTMLElement>(box, "[data-k-sb-user]");
  const assistantEl = q<HTMLElement>(box, "[data-k-sb-assistant]");
  const slotEl = q<HTMLElement>(box, "[data-k-sb-slot]");
  const hitlBox = q<HTMLElement>(box, "[data-k-sb-hitl]");
  const approveBtn = q<HTMLButtonElement>(box, "[data-k-sb-approve]");
  const rejectBtn = q<HTMLButtonElement>(box, "[data-k-sb-reject]");
  const stateCtl = q<HTMLElement>(box, "[data-k-sb-state-ctl]");
  const stateBtn = q<HTMLButtonElement>(box, "[data-k-sb-state-btn]");
  const taglineEl = q<HTMLElement>(box, "[data-k-sb-tagline]");
  const logEl = q<HTMLElement>(box, "[data-k-sb-log]");
  const jsonEl = q<HTMLElement>(box, "[data-k-sb-json]");

  let scenario = sandboxScenarios[0];
  let timeline: SandboxFrame[] = [...scenario.frames];
  let index = 0;
  let playing = false;
  let timer = 0;
  let pickupToggled = false;
  let stops: HTMLElement[] = [];

  const clearTimer = () => {
    window.clearTimeout(timer);
    timer = 0;
  };
  teardowns.push(clearTimer);

  const setStatus = (text: string, mode: "idle" | "running" | "wait" | "done") => {
    if (stateBadge) stateBadge.textContent = text;
    if (liveEl) {
      liveEl.classList.toggle("is-running", mode === "running");
      liveEl.classList.toggle("is-wait", mode === "wait");
      liveEl.classList.toggle("is-done", mode === "done");
    }
    if (playBtn) playBtn.classList.toggle("is-playing", mode === "running");
    if (playLabel) {
      if (mode === "running") playLabel.textContent = "暂停";
      else if (timeline[index]?.pauseForApproval) playLabel.textContent = "重播";
      else playLabel.textContent = index >= timeline.length - 1 ? "重播" : "播放";
    }
  };

  const buildTrack = () => {
    if (!track || !token) return;
    every(track, ".k-sb-stop").forEach((s) => s.remove());
    stops = scenario.stages.map((label, i) => {
      const stop = document.createElement("span");
      stop.className = "k-sb-stop";
      stop.style.left = `${(i / (scenario.stages.length - 1)) * 100}%`;
      const span = document.createElement("span");
      span.textContent = label;
      stop.appendChild(span);
      track.insertBefore(stop, token);
      return stop;
    });
  };

  const renderStateJson = (obj: Record<string, unknown>, changed: string[] = []) => {
    if (!jsonEl) return;
    const raw = JSON.stringify(obj, null, 2);
    if (!changed.length) {
      jsonEl.textContent = raw;
      return;
    }
    const html = esc(raw)
      .split("\n")
      .map((line) => {
        const hit = changed.some((k) => line.includes(`&quot;${k}&quot;`) || line.includes(`"${k}"`));
        return hit ? `<span class="k-sb-json-hi">${line}</span>` : line;
      })
      .join("\n");
    jsonEl.innerHTML = html;
  };

  const renderSlot = (frame: SandboxFrame) => {
    if (!slotEl) return;
    if (frame.tool) {
      slotEl.hidden = false;
      slotEl.innerHTML = `<div class="k-sb-card">
        <div class="k-sb-card-head">
          <code>${esc(frame.tool.name)}</code>
          <span class="k-chip ${frame.tool.status === "已完成" ? "k-chip-moss" : "k-chip-ember"}">${esc(frame.tool.status)}</span>
        </div>
        <p>${esc(frame.tool.detail)}</p>
      </div>`;
      return;
    }
    if (frame.genCard) {
      slotEl.hidden = false;
      slotEl.innerHTML = `<div class="k-sb-card">
        <div class="k-sb-card-head">
          <strong>${esc(frame.genCard.title)}</strong>
          <span class="k-chip k-chip-moss">Generative UI</span>
        </div>
        <div class="k-sb-bars">
          ${frame.genCard.bars
            .map(
              (b) => `<div class="k-sb-bar-row">
                <span>${esc(b.label)}</span>
                <span class="k-sb-bar"><span style="width:${b.pct}%"></span></span>
                <b>${esc(b.value)}</b>
              </div>`,
            )
            .join("")}
        </div>
      </div>`;
      return;
    }
    slotEl.hidden = true;
    slotEl.innerHTML = "";
  };

  const renderFrame = (i: number) => {
    index = Math.max(0, Math.min(timeline.length - 1, i));
    const frame = timeline[index];
    const pct = (frame.stage / (scenario.stages.length - 1)) * 100;

    if (fill) fill.style.width = `${pct}%`;
    if (token) token.style.left = `${pct}%`;
    stops.forEach((s, idx) => s.classList.toggle("is-hit", idx <= frame.stage));

    if (stepLabel) stepLabel.textContent = `事件 ${index + 1} / ${timeline.length} · ${frame.type}`;
    if (caption) caption.textContent = frame.label;
    if (assistantEl && frame.chatText !== undefined) {
      assistantEl.textContent = frame.chatText || "已连接 AG-UI 端点，准备接收流式事件…";
    }
    renderSlot(frame);

    if (logEl) {
      const visible = timeline.slice(0, index + 1);
      logEl.innerHTML = visible
        .map(
          (f, idx) => `<li class="${idx === visible.length - 1 ? "is-latest" : ""}">
            <code>${esc(f.type)}</code>
            <pre>${esc(JSON.stringify(f.wire).replace(/,"/g, ', "').replace(/":/g, '": '))}</pre>
          </li>`,
        )
        .join("");
      logEl.scrollTop = logEl.scrollHeight;
    }

    if (frame.state) renderStateJson(frame.state, frame.changedKeys ?? []);
    else renderStateJson({ step: frame.type, chartMounted: Boolean(frame.genCard) });

    if (hitlBox && scenario.approvalFrame) {
      const paused = Boolean(frame.pauseForApproval);
      hitlBox.hidden = !paused;
      if (approveBtn) approveBtn.textContent = scenario.approvalFrame.buttonApprove;
      if (rejectBtn) rejectBtn.textContent = scenario.approvalFrame.buttonReject;
      if (uiMode) {
        uiMode.textContent = paused ? "等待人工审批 · interrupt" : "Agent ↔ UI 同步中";
        uiMode.className = paused ? "k-chip k-chip-rose" : "k-chip k-chip-moss";
      }
      if (paused) {
        playing = false;
        clearTimer();
        setStatus("等待人工确认", "wait");
      }
    } else if (hitlBox) {
      hitlBox.hidden = true;
      if (uiMode) {
        uiMode.textContent = "Agent ↔ UI 同步中";
        uiMode.className = "k-chip k-chip-moss";
      }
    }

    if (stateCtl) {
      stateCtl.hidden = !(scenario.stateToggleKey && index === timeline.length - 1);
    }
  };

  const scheduleNext = () => {
    clearTimer();
    if (!playing) return;
    if (index >= timeline.length - 1) {
      playing = false;
      const currentFrame = timeline[index];
      if (!currentFrame.pauseForApproval) setStatus("已完成", "done");
      return;
    }
    const delay = reduced() ? 180 : Number(speedSelect?.value || 850);
    timer = window.setTimeout(() => {
      if (!playing) return;
      renderFrame(index + 1);
      if (playing) scheduleNext();
    }, delay);
  };

  const loadScenario = (id: string, autoPlay = false) => {
    clearTimer();
    playing = false;
    pickupToggled = false;
    if (stateBtn) stateBtn.setAttribute("aria-pressed", "false");
    scenario = sandboxScenarios.find((s) => s.id === id) ?? sandboxScenarios[0];
    timeline = [...scenario.frames];
    if (userEl) userEl.textContent = scenario.userPrompt;
    if (taglineEl) taglineEl.textContent = scenario.tagline;
    buildTrack();
    renderFrame(0);
    setStatus("就绪", "idle");
    if (autoPlay && !reduced()) {
      playing = true;
      setStatus("播放中", "running");
      scheduleNext();
    }
  };

  bindTablist(tabs, panel, (btn) => loadScenario(btn.dataset.kSbTab ?? "hitl", true));

  if (playBtn) {
    listen(playBtn, "click", () => {
      if (playing) {
        playing = false;
        clearTimer();
        setStatus("已暂停", "idle");
        return;
      }
      if (timeline[index]?.pauseForApproval) {
        loadScenario(scenario.id, true);
        return;
      }
      if (index >= timeline.length - 1) index = 0;
      renderFrame(index);
      playing = true;
      setStatus("播放中", "running");
      scheduleNext();
    });
  }

  if (stepBtn) {
    listen(stepBtn, "click", () => {
      playing = false;
      clearTimer();
      if (timeline[index]?.pauseForApproval) return;
      const next = index < timeline.length - 1 ? index + 1 : 0;
      renderFrame(next);
      if (!timeline[next]?.pauseForApproval) {
        setStatus(next === timeline.length - 1 ? "已完成" : "单步调试", next === timeline.length - 1 ? "done" : "idle");
      }
    });
  }

  if (resetBtn) listen(resetBtn, "click", () => loadScenario(scenario.id, false));

  const resumeInterrupt = (frames: SandboxFrame[]) => {
    if (!timeline[index]?.pauseForApproval) return;
    timeline = [...timeline, ...frames];
    renderFrame(index + 1);
    setStatus("已恢复并完成", "done");
  };

  if (approveBtn) {
    listen(approveBtn, "click", () => {
      if (scenario.approvalFrame) resumeInterrupt(scenario.approvalFrame.approveOutcome);
    });
  }
  if (rejectBtn) {
    listen(rejectBtn, "click", () => {
      if (scenario.approvalFrame) resumeInterrupt(scenario.approvalFrame.rejectOutcome);
    });
  }

  if (stateBtn) {
    listen(stateBtn, "click", () => {
      if (!scenario.stateToggleKey) return;
      pickupToggled = !pickupToggled;
      stateBtn.setAttribute("aria-pressed", String(pickupToggled));
      const nextVal = scenario.stateToggleKey.values[pickupToggled ? 1 : 0];
      const baseState = { ...(timeline[index].state ?? {}) };
      baseState.pickup = nextVal;
      const patchFrame: SandboxFrame = {
        id: `client_${Date.now()}`,
        type: "STATE_DELTA (Client)",
        stage: 4,
        label: "客户端直接发起状态变更，服务端下个回合立即感知",
        wire: {
          type: "STATE_DELTA",
          source: "client_input",
          delta: [{ op: "replace", path: scenario.stateToggleKey.path, value: nextVal }],
        },
        chatText: `前端已更新接站服务为：${nextVal}`,
        state: baseState,
        changedKeys: ["pickup"],
      };
      timeline = [...scenario.frames, patchFrame];
      renderFrame(timeline.length - 1);
      setStatus("双向状态已同步", "done");
    });
  }

  loadScenario(scenario.id, false);
}

/* ----------------------------------------------------------- sdk switcher */

function initSdkTabs(root: HTMLElement) {
  const box = q<HTMLElement>(root, "[data-k-sdk]");
  if (!box) return;

  const tabs = every<HTMLButtonElement>(box, "[data-k-sdk-tab]");
  const panel = q<HTMLElement>(box, "[data-k-sdk-panel]");
  const fileEl = q<HTMLElement>(box, "[data-k-sdk-file]");
  const codeEl = q<HTMLElement>(box, "[data-k-sdk-code]");
  const installEl = q<HTMLElement>(box, "[data-k-sdk-install]");
  const copyBtn = q<HTMLButtonElement>(box, "[data-k-sdk-copy]");
  const docLink = q<HTMLAnchorElement>(box, "[data-k-sdk-link]");

  bindTablist(tabs, panel, (btn) => {
    const id = btn.dataset.kSdkTab;
    const item = sdkSnippets.find((s) => s.id === id) ?? sdkSnippets[0];
    if (fileEl) fileEl.textContent = item.filename;
    if (codeEl) codeEl.innerHTML = highlightSdkCode(item.code, item.id);
    if (installEl) installEl.textContent = item.install;
    if (copyBtn) copyBtn.dataset.copy = item.code;
    if (docLink) docLink.setAttribute("href", withBase(item.docHref));
  });
}

/* ----------------------------------------------------------- platforms tabs */

function initPlatforms(root: HTMLElement) {
  const box = q<HTMLElement>(root, "[data-k-platforms]");
  if (!box) return;

  const tabs = every<HTMLButtonElement>(box, "[data-k-platform]");
  const panel = q<HTMLElement>(box, "[data-k-platform-panel]");
  const channel = q<HTMLElement>(box, "[data-k-channel]");
  const guest = q<HTMLElement>(box, "[data-k-guest]");
  const note = q<HTMLElement>(box, "[data-k-guest-note]");
  const badgeEl = q<HTMLElement>(box, "[data-k-plat-badge]");
  const caption = q<HTMLElement>(box, "[data-k-plat-caption]");

  bindTablist(tabs, panel, (btn) => {
    const item = platforms.find((p) => p.id === btn.dataset.kPlatform) ?? platforms[0];
    if (channel) channel.textContent = item.channel;
    if (guest) guest.textContent = item.guest;
    if (note) note.textContent = item.guestNote;
    if (badgeEl) badgeEl.textContent = item.badge;
    if (caption) caption.textContent = item.desc;
  });
}

/* --------------------------------------------------------------- lifecycle */

function init() {
  cleanup();
  const root = document.querySelector<HTMLElement>(".kiri");
  if (!root) return;
  initChrome(root);
  initHeroInspector(root);
  initSandbox(root);
  initSdkTabs(root);
  initPlatforms(root);
}

function cleanup() {
  for (const fn of teardowns) fn();
  teardowns = [];
}

document.addEventListener("astro:page-load", init);
document.addEventListener("astro:before-swap", cleanup);
if (document.readyState !== "loading") init();
