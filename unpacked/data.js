/* =================================================================
   Qwen Code Unpacked — content data
   All file:line references checked against the qwen-code repo on
   the main branch as of April 2026.
   ================================================================= */

// ---------- Agent loop steps ----------
const LOOP_STEPS = [
  {
    n: 1, label: 'Input',
    title: 'User input',
    desc: 'User types a message in the terminal or pipes input through stdin.',
    detail: 'Interactive input goes through Ink-based React components in the CLI package. In headless mode (qwen -p), input comes straight from the argv string or piped stdin and skips the UI entirely.',
    file: 'packages/cli/src/ui/  +  packages/cli/src/nonInteractiveCli.ts',
  },
  {
    n: 2, label: 'Build msg',
    title: 'Message creation',
    desc: 'The text is wrapped into a multi-part Content object compatible with the Gemini SDK shape.',
    detail: 'Even when you target an OpenAI- or Anthropic-protocol provider, Qwen Code internally normalizes everything to Gemini\'s {role, parts[]} structure. Provider adapters convert at the SDK boundary.',
    file: 'packages/core/src/core/geminiChat.ts',
  },
  {
    n: 3, label: 'History',
    title: 'History append',
    desc: 'GeminiChat.addHistory() pushes the new turn onto the in-memory conversation array.',
    detail: 'The session keeps the full transcript in RAM until /clear or /compress. Auto-compaction kicks in when the window approaches the model\'s limit; older turns are summarized into a synthetic system message.',
    file: 'packages/core/src/core/geminiChat.ts',
  },
  {
    n: 4, label: 'System',
    title: 'System prompt assembly',
    desc: 'getCoreSystemPrompt() assembles the system instruction.',
    detail: 'Order: built-in base prompt → user memory (QWEN.md / GEMINI.md / AGENTS.md) → append instructions. Conditional reminders are injected for plan mode, subagent mode, and arena mode. The QWEN_SYSTEM_MD env var can override the entire base prompt.',
    file: 'packages/core/src/core/prompts.ts',
  },
  {
    n: 5, label: 'API',
    title: 'Stream the request',
    desc: 'chat.sendMessageStream() opens a streaming request to whichever provider is configured.',
    detail: 'Qwen Code is multi-protocol: openai / anthropic / gemini / vertex-ai are first-class. The provider is chosen by security.auth.selectedType in settings.json. Tokens arrive over SSE.',
    file: 'packages/core/src/core/turn.ts',
  },
  {
    n: 6, label: 'Tokens',
    title: 'Token parsing',
    desc: 'The Turn class parses the stream into typed events.',
    detail: 'Each chunk yields a GeminiEventType — Thought (for thinking-enabled models), Content (regular text), ToolCallRequest, ToolCallResponse, Retry, Error, or Finished. The UI subscribes and renders incrementally.',
    file: 'packages/core/src/core/turn.ts',
  },
  {
    n: 7, label: 'Tools?',
    title: 'Tool detection',
    desc: 'If the response carries functionCalls, each is converted into a ToolCallRequestInfo.',
    detail: 'CoreToolScheduler validates parameters against the tool\'s declared schema, runs preToolUse hooks, and asks the PermissionManager whether to allow / ask / deny.',
    file: 'packages/core/src/core/coreToolScheduler.ts',
  },
  {
    n: 8, label: 'Loop',
    title: 'Tool execution + loop back',
    desc: 'Approved tools are run; results become functionResponse parts; the model is invoked again.',
    detail: 'Tool calls can run in parallel. Live output streams through OutputUpdateHandler so long-running shell commands show progress. After all tools finish, the conversation is sent back through Turn.run() — that\'s the agentic loop. Capped at MAX_TURNS = 100.',
    file: 'packages/core/src/core/coreToolScheduler.ts',
  },
  {
    n: 9, label: 'Render',
    title: 'Render to terminal',
    desc: 'Markdown, code blocks, and tool output are rendered through Ink components.',
    detail: 'Code fences get syntax highlighting; tool calls show as collapsible cards; diffs render inline. The UI tree is React, the layout engine is Yoga (flexbox).',
    file: 'packages/cli/src/ui/',
  },
  {
    n: 10, label: 'Hooks',
    title: 'Post-turn hooks & memory',
    desc: 'Auto-compact if needed, run dream mode, fire postToolUse hooks.',
    detail: 'Background tasks: dream mode (memory consolidation, optionally on a lighter model via lightweightModel), durable-memory extraction, and any user-defined hooks for stop / preCompact / userPromptSubmit events.',
    file: 'packages/core/src/memory/dream.ts',
  },
  {
    n: 11, label: 'Await',
    title: 'Wait for next input',
    desc: 'The REPL idles until the user presses a key.',
    detail: 'Ctrl+C cancels in-flight tool calls cleanly, preserving conversation history. Ctrl+D exits.',
    file: 'packages/cli/src/gemini.tsx',
  },
];

// ---------- Architecture packages ----------
const ARCH_PACKAGES = [
  { name: 'packages/cli',                  files: 866, loc: '239K', desc: 'The terminal UI, command implementations, REPL, and Ink-based renderer. The interactive face of qwen.' },
  { name: 'packages/core',                 files: 603, loc: '240K', desc: 'The brain: agent loop, tool registry, scheduler, prompts, permissions, MCP, subagents, skills, memory.' },
  { name: 'packages/vscode-ide-companion', files: 131, loc: '30K',  desc: 'VS Code extension that lets the IDE host Qwen Code sessions and exchange context with the CLI.' },
  { name: 'packages/webui',                files: 117, loc: '15K',  desc: 'A browser-based UI that mirrors the terminal experience, reusing the core engine over WebSocket.' },
  { name: 'packages/channels',             files:  41, loc: '6K',   desc: 'Inter-process channels — UDS-based plumbing that lets agents and IDE hosts talk to each other.' },
  { name: 'packages/sdk-typescript',       files:  29, loc: '9K',   desc: 'TypeScript SDK to drive Qwen Code programmatically (analogous to Anthropic\'s Agent SDK).' },
  { name: 'packages/web-templates',        files:  20, loc: '3K',   desc: 'Static HTML templates served by the webui for setup, auth, and onboarding flows.' },
  { name: 'packages/sdk-python',           files: '—', loc: '—',    desc: 'Python SDK source. Generated/built from TS bindings; ships separately on PyPI.' },
  { name: 'packages/sdk-java',             files: '—', loc: '—',    desc: 'Java SDK source. Maven-published.' },
  { name: 'packages/zed-extension',        files: '—', loc: '—',    desc: 'Zed editor extension shell (extension manifest + bundled binaries).' },
];

// ---------- Tool catalog ----------
const TOOL_CATEGORIES = [
  {
    name: 'File operations',
    tools: [
      { name: 'Read',       internal: 'read_file',  desc: 'Read a file from the filesystem.', impl: 'Line-range support; binary detection; respects permission rules.', file: 'packages/core/src/tools/read-file.ts' },
      { name: 'Edit',       internal: 'edit',       desc: 'Targeted edit by exact-string search & replace.', impl: 'Old name was "replace". Requires the search string to appear exactly once. Multi-line OK.', file: 'packages/core/src/tools/edit.ts' },
      { name: 'WriteFile',  internal: 'write_file', desc: 'Write a complete new file or overwrite an existing one.', impl: 'Auto-creates parent dirs. Used for greenfield code, never for surgical edits.', file: 'packages/core/src/tools/write-file.ts' },
      { name: 'Glob',       internal: 'glob',       desc: 'Find files matching a glob pattern.', impl: 'Project-rooted, gitignore-aware.', file: 'packages/core/src/tools/glob.ts' },
      { name: 'Grep',       internal: 'grep_search',desc: 'Regex search across project files.', impl: 'Backed by ripgrep when available; falls back to a JS implementation otherwise. Old name: "search_file_content".', file: 'packages/core/src/tools/ripGrep.ts' },
      { name: 'ListFiles',  internal: 'list_directory', desc: 'List directory contents.', impl: 'Old display name: "ReadFolder".', file: 'packages/core/src/tools/ls.ts' },
    ],
  },
  {
    name: 'Execution',
    tools: [
      { name: 'Shell',  internal: 'run_shell_command', desc: 'Run a shell command.', impl: 'Goes through shell-semantics.ts which AST-parses the command, classifies read-only vs mutating, and consults the permission engine. Optional sandbox wrapper (Docker/Podman/Seatbelt).', file: 'packages/core/src/tools/shell.ts' },
      { name: 'LSP',    internal: 'lsp', desc: 'Language Server Protocol operations: go-to-def, references, completions, diagnostics.', impl: 'Talks to whatever LSP servers the project has configured.', file: 'packages/core/src/tools/lsp.ts' },
    ],
  },
  {
    name: 'Search & fetch',
    tools: [
      { name: 'WebFetch', internal: 'web_fetch', desc: 'Fetch a URL and return Markdown.', impl: 'HTML → Markdown; processed by a small model with the user\'s prompt. Network egress goes through proxy/sandbox if enabled.', file: 'packages/core/src/tools/web-fetch.ts' },
    ],
  },
  {
    name: 'Agents & tasks',
    tools: [
      { name: 'Agent',       internal: 'agent',        desc: 'Spawn a subagent.', impl: 'Loads a SubagentConfig, builds a fresh GeminiChat, runs AgentCore.runReasoningLoop. Supports run_in_background.', file: 'packages/core/src/tools/agent/agent.ts' },
      { name: 'SendMessage', internal: 'send_message', desc: 'Inject a message into a running background agent.', impl: 'Delivered at the next tool-round boundary so the agent sees it cleanly.', file: 'packages/core/src/tools/send-message.ts' },
      { name: 'TaskStop',    internal: 'task_stop',    desc: 'Cancel a running background agent or shell.', impl: 'Sends an abort signal and reaps the runtime.', file: 'packages/core/src/tools/task-stop.ts' },
    ],
  },
  {
    name: 'Planning',
    tools: [
      { name: 'ExitPlanMode', internal: 'exit_plan_mode', desc: 'Signal that planning is done — ready to execute.', impl: 'Plan mode is a global ApprovalMode setting; this tool transitions back to default.', file: 'packages/core/src/tools/exitPlanMode.ts' },
      { name: 'TodoWrite',    internal: 'todo_write',     desc: 'Persist a structured task list for the session.', impl: 'Items have id, status (not-started / in-progress / completed) and description.', file: 'packages/core/src/tools/todoWrite.ts' },
    ],
  },
  {
    name: 'Skills',
    tools: [
      { name: 'Skill', internal: 'skill', desc: 'Invoke a bundled or user-defined skill.', impl: 'Loads SKILL.md, fills in {{params}}, runs as a subagent. Can run in background.', file: 'packages/core/src/tools/skill.ts' },
    ],
  },
  {
    name: 'Scheduling',
    tools: [
      { name: 'CronCreate', internal: 'cron_create', desc: 'Schedule a prompt to run on a cron expression.', impl: 'Standard 5-field cron. Persisted unless in-memory mode. Gated by cronEnabled config.', file: 'packages/core/src/tools/cron-create.ts' },
      { name: 'CronList',   internal: 'cron_list',   desc: 'List scheduled cron jobs.', impl: '', file: 'packages/core/src/tools/cron-list.ts' },
      { name: 'CronDelete', internal: 'cron_delete', desc: 'Delete a scheduled cron job.', impl: '', file: 'packages/core/src/tools/cron-delete.ts' },
    ],
  },
  {
    name: 'MCP',
    tools: [
      { name: 'MCPTool', internal: '(dynamic)', desc: 'Dynamically wrapped tool from a connected MCP server.', impl: 'Discovered at startup via mcp-client-manager.ts; merged into the same registry as built-ins. Supports OAuth.', file: 'packages/core/src/tools/mcp-tool.ts' },
    ],
  },
  {
    name: 'System',
    tools: [
      { name: 'AskUserQuestion', internal: 'ask_user_question', desc: 'Ask the user a structured question and wait for an answer.', impl: 'Used when the agent genuinely needs a decision rather than guessing.', file: 'packages/core/src/tools/askUserQuestion.ts' },
    ],
  },
];

// ---------- Slash commands ----------
const COMMANDS = [
  {
    name: 'Setup & config',
    items: ['/init', '/auth', '/login', '/logout', '/model', '/manageModels', '/theme', '/editor', '/language', '/terminalSetup', '/setupGithub', '/extensions', '/mcp', '/hooks'],
  },
  {
    name: 'Daily workflow',
    items: ['/help', '/clear', '/compress', '/context', '/copy', '/export', '/summary', '/stats', '/skills', '/agents', '/tasks', '/plan', '/approvalMode', '/tools'],
  },
  {
    name: 'Sessions & memory',
    items: ['/resume', '/restore', '/rewind', '/recap', '/memory', '/remember', '/forget', '/dream', '/insight', '/delete', '/rename'],
  },
  {
    name: 'Diagnostics',
    items: ['/about', '/doctor', '/bug', '/permissions', '/trust', '/directory', '/ide', '/statusline', '/vim'],
  },
  {
    name: 'Advanced',
    items: ['/arena', '/btw', '/docs', '/quit'],
  },
];

// ---------- Built-in subagents ----------
const SUBAGENTS = [
  {
    name: 'general-purpose',
    where: 'subagents/builtin-agents.ts',
    desc: 'A capable do-anything agent for complex multi-step research or implementation. Has the full tool set minus the recursion-blockers in EXCLUDED_TOOLS_FOR_SUBAGENTS (no Agent, no Cron*, no TaskStop, no SendMessage).',
  },
  {
    name: 'Explore',
    where: 'subagents/builtin-agents.ts',
    desc: 'Read-only investigation agent. Used for "where is X defined?" / "find all callers of Y" / "summarize this directory" — search-heavy, no edits. Returns a focused report rather than dumping every file it touched.',
  },
  {
    name: 'statusline-setup',
    where: 'subagents/builtin-agents.ts',
    desc: 'Narrow-scope agent that walks the user through configuring the terminal status line. Has only Read + Edit. Spawned by the /statusline command.',
  },
];

// ---------- Bundled skills ----------
const SKILLS = [
  { name: 'loop',      where: 'skills/bundled/loop',      desc: 'Run a prompt or slash command on a recurring interval. The "/loop 5m /foo" pattern.' },
  { name: 'batch',     where: 'skills/bundled/batch',     desc: 'Schedule batches of jobs against the cron infrastructure.' },
  { name: 'review',    where: 'skills/bundled/review',    desc: 'Review a pull request — checks out the diff, runs analysis, posts a structured review.' },
  { name: 'qc-helper', where: 'skills/bundled/qc-helper', desc: 'Quality-control helpers — lint sweeps, test triage, common cleanup recipes.' },
];

// ---------- Notable internals ----------
const NOTABLE = [
  { name: 'Dream mode',         desc: 'Background memory-consolidation task spawned between sessions. Runs as a subagent on a (configurable) lightweight model so the cost stays low. dreamCommand.ts triggers it on demand.' },
  { name: 'Arena',              desc: 'Multi-agent comparison mode where two or more agents tackle the same task and you compare diffs side by side. Lives in packages/core/src/agents/arena/.' },
  { name: 'Background tasks',   desc: 'Subagents and shells launched with run_in_background:true. Tracked in BackgroundTaskRegistry; their stdout becomes a notification stream the parent can subscribe to.' },
  { name: 'Channels (UDS)',     desc: 'Unix domain socket plumbing between the CLI, IDE host, and webui. The webui is just another consumer of the same engine over a channel.' },
  { name: 'Sandbox image',      desc: 'qwen-code-sandbox Docker/Podman image. ApprovalMode + sandbox is the orthogonal way to grant the agent room to move without prompting on every action.' },
  { name: 'Loop detector',      desc: 'LoopDetectionService watches the agent for repeated states (same tool call args, same model output) and breaks the loop before it eats your quota.' },
  { name: 'Prompt-cached cores',desc: 'For Anthropic-protocol providers, the system prompt is broken into cache-anchored chunks so warm turns skip re-reading 10K+ tokens of base prompt.' },
  { name: 'QWEN_SYSTEM_MD',     desc: 'Env var that overrides the entire core system prompt with the contents of a file. Useful for per-deployment customization or research experiments.' },
];
