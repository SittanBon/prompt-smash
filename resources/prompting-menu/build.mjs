import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const today = '8 October 2026';

const sources = [
  ['OpenAI, “Prompting” and “Prompt engineering”', 'https://developers.openai.com/api/docs/guides/prompting'],
  ['Anthropic, “Prompting best practices”', 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/prompt-templates-and-variables'],
  ['Google, “Prompt design strategies”', 'https://ai.google.dev/gemini-api/docs/prompting-strategies'],
  ['OpenAI, “Model optimization”', 'https://developers.openai.com/api/docs/guides/model-optimization'],
  ['OpenAI, “Reasoning best practices”', 'https://developers.openai.com/api/docs/guides/reasoning-best-practices'],
  ['OpenAI, “Structured model outputs”', 'https://developers.openai.com/api/docs/guides/structured-outputs'],
  ['Google, “Structured outputs”', 'https://ai.google.dev/gemini-api/docs/structured-output'],
  ['OpenAI, “Image prompting”', 'https://developers.openai.com/api/docs/guides/image-prompting'],
  ['Google, “Files API”', 'https://ai.google.dev/gemini-api/docs/files'],
  ['NIST, Artificial Intelligence Risk Management Framework: Generative AI Profile', 'https://doi.org/10.6028/NIST.AI.600-1'],
  ['NIST, AI Risk Management Framework', 'https://www.nist.gov/itl/ai-risk-management-framework'],
  ['OWASP, LLM Prompt Injection Prevention Cheat Sheet', 'https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html'],
  ['Wei et al., “Chain-of-Thought Prompting Elicits Reasoning in Large Language Models”', 'https://arxiv.org/abs/2201.11903'],
  ['Wang et al., “Self-Consistency Improves Chain of Thought Reasoning in Language Models”', 'https://arxiv.org/abs/2203.11171'],
  ['Lewis et al., “Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks”', 'https://arxiv.org/abs/2005.11401'],
  ['Yao et al., “ReAct: Synergizing Reasoning and Acting in Language Models”', 'https://arxiv.org/abs/2210.03629'],
  ['Schulhoff et al., “The Prompt Report: A Systematic Survey of Prompting Techniques”', 'https://arxiv.org/abs/2406.06608'],
  ['W3C, Web Content Accessibility Guidelines (WCAG) 2.2', 'https://www.w3.org/TR/WCAG22/'],
  ['OpenAI, “Function calling”', 'https://developers.openai.com/api/docs/guides/function-calling'],
  ['Yao et al., “Tree of Thoughts: Deliberate Problem Solving with Large Language Models”', 'https://arxiv.org/abs/2305.10601'],
  ['OpenAI, “The Instruction Hierarchy”', 'https://openai.com/index/the-instruction-hierarchy/'],
  ['Google, “Long context”', 'https://ai.google.dev/gemini-api/docs/long-context'],
  ['U.S. Copyright Office, Copyright and Artificial Intelligence', 'https://www.copyright.gov/ai/'],
];

const techniques = [
  {
    section: 'Prompting Specials', level: 'STARTER', name: 'Direct prompting', term: 'Zero-shot prompting',
    theory: 'Ask for a familiar task with clear instructions and no worked example.',
    why: 'Modern models often recognise common jobs such as summarising, rewriting and brainstorming. Starting simple gives you a useful baseline.',
    uses: ['A short summary', 'A first draft', 'Common classifications', 'Simple idea generation'],
    example: 'Sort each comment into Praise, Question or Complaint. Return only the label and one quoted reason.',
    tip: 'Start here. Add a technique only when a real test shows the direct prompt is not enough.',
    pro: 'Keep the direct version as your baseline. Compare every more complex version against the same test cases.',
    risk: '“Zero-shot” describes the prompt, not the quality. Unusual categories or ambiguous tasks may need examples.', refs: [3, 4]
  },
  {
    section: 'Prompting Specials', level: 'STARTER', name: 'Role and audience', term: 'Role prompting',
    theory: 'Give the AI a relevant point of view and name the people who will use the answer.',
    why: 'A role can focus vocabulary, priorities and tone. The audience tells the model what knowledge and language level to expect.',
    uses: ['Teaching', 'Accessibility review', 'Audience-specific writing', 'Simulated critique'],
    example: 'Act as a patient science tutor. Explain photosynthesis to a curious 10-year-old using one everyday comparison.',
    tip: 'Choose a role that changes the work. “Helpful expert” is usually too vague to add value.',
    pro: 'Specify responsibilities and review criteria, not invented credentials: “Review for plain language and explain every technical term.”',
    risk: 'A role does not create expertise, evidence or accountability. “Act as a doctor” does not make medical advice reliable.', refs: [2]
  },
  {
    section: 'Prompting Specials', level: 'SKILLED', name: 'Show the pattern', term: 'One-shot and few-shot prompting',
    theory: 'Provide one or several examples that demonstrate the pattern you want the AI to follow.',
    why: 'Examples can make an unusual format, tone or decision rule easier to recognise than a long explanation.',
    uses: ['Classification', 'Brand voice', 'Edge cases', 'Specialised formats'],
    example: 'Comment: “Great mug, but checkout failed.”\nLabels: Product praise; Website problem\n\nNow label: “Fast delivery, wrong colour.”',
    tip: 'Include at least one awkward example. Easy examples rarely teach the difficult boundary.',
    pro: 'Keep examples relevant, varied and consistently formatted. Treat their labels like maintained test data.',
    risk: 'Poor, biased or repetitive examples teach the wrong pattern. More examples also use more context.', refs: [1, 2, 3]
  },
  {
    section: 'Prompting Specials', level: 'STARTER', name: 'Label the parts', term: 'Structured prompting and delimiters',
    theory: 'Use headings, tags or fences to separate instructions, source material, examples and output rules.',
    why: 'Clear sections reduce accidental mixing and make a long prompt easier for people to read and maintain.',
    uses: ['Long source documents', 'Reusable templates', 'Several inputs', 'Document analysis'],
    example: 'TASK: Summarise the policy.\nSOURCE: <policy>…</policy>\nRULES: Use only the source.\nFORMAT: Five bullets.',
    tip: 'Use names that describe the job: TASK, SOURCE, RULES and OUTPUT. Keep the labels consistent.',
    pro: 'Choose Markdown, XML or another stable convention. Structure for maintainability, not decoration.',
    risk: 'A label is not a security wall. Malicious instructions inside a document can still influence a model.', refs: [2, 3, 12]
  },
  {
    section: 'Prompting Specials', level: 'STARTER', name: 'Set a checkable finish line', term: 'Constraint prompting',
    theory: 'State the limits and qualities that make an answer acceptable.',
    why: '“Make it good” is hard to inspect. Concrete requirements make the target visible to both the AI and the reviewer.',
    uses: ['Publishing', 'Interface copy', 'Regulated wording', 'Consistent deliverables'],
    example: 'Give three options. Each must be under 40 words, use plain English and include one drawback.',
    tip: 'If rules compete, rank them. Say which requirement matters most.',
    pro: 'Turn important requirements into acceptance criteria that can be checked by code or a human reviewer.',
    risk: 'Too many or conflicting constraints can reduce quality or cause silent trade-offs.', refs: [2, 3]
  },
  {
    section: 'Prompting Specials', level: 'SKILLED', name: 'Divide the work', term: 'Task decomposition and prompt chaining',
    theory: 'Split a complex job into smaller prompts whose results can be checked before the next stage.',
    why: 'Smaller stages are easier to inspect, repair and approve than one large request that hides several decisions.',
    uses: ['Research', 'Long documents', 'Data cleaning', 'Approval workflows'],
    situation: 'A policy summary mixes extraction, verification and writing.',
    basic: 'Summarise this policy accurately.',
    example: 'Run 1: Extract claims.\nRun 2: Attach source evidence.\nRun 3: Flag unsupported claims.\nRun 4: Write only from verified claims.',
    inspect: 'Check each intermediate result before it becomes the next input.',
    notProve: 'Smaller stages do not guarantee that the evidence is complete.',
    tip: 'Give every stage a visible input and output. Stop when a required check fails.',
    pro: 'Store intermediate results and evaluation notes. This creates a traceable workflow and makes regressions easier to find.',
    risk: 'Errors can travel from one stage to the next. Chaining adds time, cost and places that can fail.', refs: [2]
  },
  {
    section: 'Prompting Specials', level: 'PRO', name: 'Support multi-step reasoning', term: 'Worked-reasoning examples',
    theory: 'For some difficult tasks, a worked example can demonstrate a useful method before a new problem.',
    why: 'Original chain-of-thought studies found gains on some arithmetic, commonsense and symbolic reasoning benchmarks.',
    uses: ['Multi-step maths', 'Logic exercises', 'Planning with dependencies', 'Rule-based decisions'],
    situation: 'A scheduling problem has several dependencies and one valid result.',
    basic: 'Create the schedule.',
    example: 'Here is one solved example with its final constraint checks. Use the same method for the new case. Return the schedule and a concise constraint checklist.',
    inspect: 'Verify every listed constraint against the final schedule.',
    notProve: 'A fluent reasoning trace does not prove the schedule is valid.',
    tip: 'Ask for concise checks or calculations you can verify, not a long performance of certainty.',
    pro: 'Reasoning behaviour differs by model. Current reasoning models may work best with simple outcome-level instructions.',
    risk: 'A convincing explanation can support a wrong answer. Exposed reasoning is not proof, and some providers advise against asking for it.', refs: [5, 13]
  },
  {
    section: 'Prompting Specials', level: 'PRO', name: 'Compare independent attempts', term: 'Self-consistency',
    theory: 'Generate several independent attempts, compare their conclusions and verify the leading answer.',
    why: 'Multiple paths can reveal instability and, on some checkable reasoning tasks, improve benchmark results.',
    uses: ['Arithmetic', 'Multiple-choice reasoning', 'Option comparison', 'Uncertainty discovery'],
    situation: 'A checkable reasoning problem gives unstable answers across runs.',
    basic: 'Solve the problem once.',
    example: 'Run the same prompt separately several times with sampling enabled. Aggregate the final answers, then verify the leading answer with a calculator.',
    inspect: 'Record disagreement, the aggregation rule and the independent verification.',
    notProve: 'Agreement across sampled paths does not prove truth.',
    tip: 'Use disagreement as a signal to investigate. Do not hide it.',
    pro: 'The original method samples diverse reasoning paths and aggregates answers. Implementation is model/API-dependent and may require separate calls.',
    risk: 'Agreement is not truth. Several runs can repeat the same misconception or biased assumption.', refs: [14]
  },
  {
    section: 'Kitchen Tools', level: 'SKILLED', name: 'Ground the answer', term: 'Retrieval-augmented generation (RAG)',
    theory: 'Supply relevant external material so the answer can use information beyond the model’s built-in knowledge.',
    why: 'Retrieval can bring current or organisation-specific evidence into the prompt and make sources inspectable.',
    uses: ['Policy questions', 'Company handbooks', 'Current information', 'Large document collections'],
    situation: 'A team needs answers from a current internal handbook.',
    basic: 'What is our returns process?',
    example: 'Retrieve the three most relevant approved passages. Answer only from them. Cite the passage used for every policy claim and mark any gap “Not stated”.',
    inspect: 'Open every citation and confirm it supports the nearby claim.',
    notProve: 'Good citations do not prove the retrieval system found every relevant passage.',
    tip: 'Open the cited passage yourself. A citation is useful only when it actually supports the claim.',
    pro: 'Evaluate retrieval and generation separately: first “Did we fetch the right evidence?”, then “Did the answer use it correctly?”',
    risk: 'Retrieval can return stale, irrelevant or malicious material. RAG does not automatically remove hallucination, injection or source-quality risks.', refs: [10, 12, 15]
  },
  {
    section: 'Kitchen Tools', level: 'PRO', name: 'Use tools for evidence or action', term: 'Tool calling; ReAct is one advanced pattern',
    theory: 'Let the model call an approved tool for information, calculation or a permitted action, then use the result.',
    why: 'Tools can provide current data, exact calculations and controlled access to systems the model cannot know by itself.',
    uses: ['Search', 'Calculations', 'Databases', 'Approved business actions'],
    situation: 'A price conversion needs a live rate and could trigger a payment.',
    basic: 'Convert €500 to US dollars and pay the invoice.',
    example: 'Call the approved rate tool. Show the rate, source and timestamp. Calculate the total. Stop and request approval before any payment action.',
    inspect: 'Check the tool result, arguments, user permission and approval point.',
    notProve: 'A correct tool call does not authorise the next action.',
    tip: 'Use read-only tools first. Put approval immediately before any action that changes data or spends money.',
    pro: 'ReAct specifically interleaves reasoning, actions and observations. Ordinary function calling is broader. Validate names and arguments in code.',
    risk: 'Prompt injection can redirect tool use. A prompt asking the model to behave safely is not an access-control system.', refs: [12, 16, 19]
  },
  {
    section: 'Kitchen Tools', level: 'PRO', name: 'Give the answer a schema', term: 'Structured outputs',
    theory: 'Require named fields and data types so software can reliably locate each part of an answer.',
    why: 'On supported APIs, schema-constrained output is stronger than simply asking for “valid JSON”.',
    uses: ['Data extraction', 'Form filling', 'UI content', 'Application workflows'],
    situation: 'Software must import order details without guessing where each value is.',
    basic: 'Return the order as JSON.',
    example: 'Use the required schema: product (string), quantity (integer ≥ 1), dietary_warning (string or null). Reject extra fields.',
    inspect: 'Validate the structure, then separately check the values against the source.',
    notProve: 'Valid JSON does not prove that a product, quantity or warning is correct.',
    tip: 'Use a schema when software consumes the result. Use a table when a person consumes it.',
    pro: 'Validate meanings, ranges and permissions after parsing. Keep the schema small and version it like code.',
    risk: 'Correct shape does not mean correct facts. Features and supported schema keywords differ by provider.', refs: [6, 7]
  },
  {
    section: 'Kitchen Tools', level: 'SKILLED', name: 'Point to the evidence', term: 'Multimodal prompting',
    theory: 'Combine text with images, audio or files, and tell the model exactly which evidence matters.',
    why: '“Look at this” is vague. Named inputs, regions and questions help the model focus on the intended evidence.',
    uses: ['Charts', 'Scanned forms', 'Product photos', 'Mixed document packs'],
    example: 'In image 2, read only the departure-time column. Return the city and time for rows marked Delayed.',
    tip: 'Number the files or images. Refer to them by number and name the detail to inspect.',
    pro: 'Test at realistic image sizes and qualities. Keep OCR or computer-vision checks for critical values.',
    risk: 'Models can misread small text, counts and spatial relationships. Media can also contain hidden instructions.', refs: [9, 12]
  },
  {
    section: 'Special Orders', level: 'SKILLED', name: 'Brief a visual', term: 'Image prompting',
    theory: 'Describe the intended use, subject, scene, composition, style, lighting and constraints.',
    why: 'A visual brief gives the model relationships to aim for, while leaving room for variation.',
    uses: ['Illustrations', 'Campaign concepts', 'Product scenes', 'Image edits'],
    example: 'A4 cover illustration; seven-layer burger, front view; warm cream; tomato and mustard accents; blank space above; no text or logos.',
    tip: 'For an edit, say what changes and what must remain unchanged.',
    pro: 'Treat camera words as visual cues, not literal camera controls. Generate, inspect and revise one issue at a time.',
    risk: 'Check text, anatomy, counts, likeness, rights and representation. Repeated edits can drift from the original.', refs: [8]
  },
  {
    section: 'Special Orders', level: 'SKILLED', name: 'Brief code with proof', term: 'Code prompting',
    theory: 'State the goal, environment, relevant files, constraints, expected behaviour and verification method.',
    why: 'Code depends on versions and surrounding systems. Tests turn “looks right” into something inspectable.',
    uses: ['Bug fixes', 'Refactoring', 'Small features', 'Test creation'],
    example: 'In this React/TypeScript app, add keyboard navigation without visual changes. Preserve the public API and run existing accessibility tests.',
    tip: 'Ask for the smallest safe change. Name what must not change.',
    pro: 'Provide acceptance criteria, sample inputs and expected outputs. Review the diff and run tests in the real environment.',
    risk: 'Generated code may be insecure, incomplete or use invented packages and APIs. Verify dependencies before installing.', refs: [1, 4, 12]
  },
  {
    section: 'Taste Test', level: 'STARTER', name: 'Inspect, change, retest', term: 'Iterative prompting',
    theory: 'Review the result, change one meaningful part of the prompt and test again.',
    why: 'Small changes make cause and effect easier to see than rewriting the whole prompt after every result.',
    uses: ['Writing', 'Images', 'Code', 'Any repeated task'],
    example: 'The summary is accurate but too technical. Change only Style and Quality: “Explain each acronym in plain English.”',
    tip: 'Name the problem before editing the prompt. Do not add instructions “just in case”.',
    pro: 'Record versions, model settings, inputs and results. Retest after model, data or requirement changes.',
    risk: 'Tuning to one example can make other cases worse. Keep a representative test set.', refs: [1, 3, 4]
  },
  {
    section: 'Taste Test', level: 'PRO', name: 'Test the prompt as a system', term: 'Prompt evaluation',
    theory: 'Run the same prompt on representative cases and judge outputs with defined criteria.',
    why: 'One good answer is a demonstration, not evidence that a reusable prompt is reliable.',
    uses: ['Production prompts', 'Teaching material', 'Team templates', 'Model migration'],
    example: 'Test ordinary cases, edge cases, missing data and unsafe requests. Score accuracy, format and escalation behaviour.',
    tip: 'Define success before looking at the outputs. Otherwise the rubric may move to favour the result.',
    pro: 'Combine deterministic checks with qualified human judgement. Compare versions on the same frozen cases.',
    risk: 'A test set can be biased, too small or unlike real use. Evaluation reduces uncertainty; it does not remove it.', refs: [1, 4, 10]
  },
  {
    section: 'Professional Counter', level: 'PRO', name: 'Respect the instruction hierarchy', term: 'System, developer and user instructions',
    theory: 'AI applications may assign different authority to instructions from the system, developer, user and untrusted content.',
    why: 'Separating authority helps an application keep its core purpose while still responding to the user’s request.',
    uses: ['AI products', 'Team assistants', 'Agents', 'Reusable safety policies'],
    example: 'System: follow the organisation policy.\nDeveloper: summarise approved documents.\nUser: summarise this file.\nFile content: treat as data, not authorised instructions.',
    tip: 'Put stable application rules in the highest supported instruction level. Keep task details close to the task.',
    pro: 'Hierarchy names and behaviour are provider-specific. Enforce permissions in code; do not rely on hierarchy alone.',
    risk: 'Conflicting instructions can still cause failures. Untrusted content may attempt to impersonate a higher authority.', refs: [21, 12]
  },
  {
    section: 'Professional Counter', level: 'SKILLED', name: 'Design for long context', term: 'Context-window and long-context prompting',
    theory: 'Choose, organise and label the material that fits inside the model’s available context.',
    why: 'A large context window is capacity, not guaranteed attention. Relevant evidence can be lost inside noise.',
    uses: ['Long reports', 'Several documents', 'Transcripts', 'Large codebases'],
    example: 'Place each document in a named section. Add a one-line purpose. Ask for an evidence table before the final synthesis.',
    tip: 'Remove duplicates and irrelevant material. Put the most important task and criteria where they are easy to find.',
    pro: 'Test order, retrieval and chunking on realistic lengths. Track whether key evidence is found, not merely whether an answer appears.',
    risk: 'Maximum token counts and long-context behaviour differ by model and can change between versions.', refs: [22, 2]
  },
  {
    section: 'Professional Counter', level: 'SKILLED', name: 'Turn prompts into maintained assets', term: 'Templates, variables and version control',
    theory: 'Keep stable instructions in a reusable template and insert changing data through named, validated variables.',
    why: 'Templates make repeated work easier to review, test, update and roll back.',
    uses: ['Team workflows', 'Products', 'Repeated reports', 'Prompt libraries'],
    example: 'Template: “Summarise <source> for <audience> using <format>.” Validate every variable before building the final prompt.',
    tip: 'Name variables by meaning, not position: audience is clearer than input_2.',
    pro: 'Store prompts with code, review changes, keep test fixtures and tag releases. Record the model and settings used in evaluation.',
    risk: 'A template can spread a mistake at scale. Variables may carry secrets or injection attempts.', refs: [1, 4]
  },
  {
    section: 'Professional Counter', level: 'PRO', name: 'Explore alternative paths', term: 'Tree-of-Thought-style workflows',
    theory: 'Generate several candidate approaches, evaluate them and continue only with the most promising options.',
    why: 'Some planning and search problems benefit from considering alternatives before committing to one route.',
    uses: ['Planning', 'Puzzles', 'Design options', 'Decision preparation'],
    example: 'Propose three launch plans. Score each against budget, time and risk. Expand the top two, then compare their failure modes.',
    tip: 'Make the criteria visible. “Best” is meaningless until you say what matters.',
    pro: 'Tree-of-Thought is a research family, not a magic phrase. Implement branching and selection explicitly when the task justifies it.',
    risk: 'More branches cost more and can create false confidence. The evaluator may share the generator’s blind spots.', refs: [20]
  },
  {
    section: 'Professional Counter', level: 'PRO', name: 'Tune model settings carefully', term: 'Sampling and provider settings',
    theory: 'Some tools expose settings that influence variation, length, reasoning effort or reproducibility.',
    why: 'Settings can change the balance between consistency, exploration, cost and latency.',
    uses: ['Creative variation', 'Repeatable testing', 'Reasoning tasks', 'Production optimisation'],
    example: 'Keep the prompt and test set fixed. Compare the supported default with one lower-variation setting; record quality, time and cost.',
    tip: 'Change one setting at a time. Use the provider’s current documentation for the exact model.',
    pro: 'A seed may improve repeatability without guaranteeing identical output. Some current reasoning models ignore or restrict familiar controls.',
    risk: 'Parameter names and effects differ by provider and model. Old advice can become wrong after a model update.', refs: [1, 4, 5]
  },
  {
    section: 'Professional Counter', level: 'SKILLED', name: 'Prompt across languages', term: 'Multilingual and translation prompting',
    theory: 'Name the source language, target language, audience, locale and terms that must remain consistent.',
    why: 'Translation quality depends on context, register and regional use—not only word substitution.',
    uses: ['Translation', 'Localisation', 'Multilingual support', 'Plain-language adaptation'],
    example: 'Translate German onboarding text into UK English for new retail staff. Preserve product names. Flag idioms with no direct equivalent.',
    tip: 'Ask a fluent speaker to review high-impact or public text. Include an approved glossary for repeated terms.',
    pro: 'Evaluate meaning, tone and locale separately. Back-translation can reveal differences but is not proof of correctness.',
    risk: 'Low-resource languages, dialects and cultural references may be handled unevenly. Personal data rules still apply.', refs: [3, 10]
  },
  {
    section: 'Professional Counter', level: 'PRO', name: 'Budget the workflow', term: 'Cost and latency trade-offs',
    theory: 'Every added example, retrieved document, model call and review step uses time and computing resources.',
    why: 'A small quality gain may not justify a slower, more expensive workflow for every request.',
    uses: ['Production systems', 'Batch work', 'Repeated evaluation', 'Agent workflows'],
    example: 'Compare direct prompting with a five-run method on the same cases. Record accuracy, median response time and cost per accepted result.',
    tip: 'Measure cost per useful, reviewed result—not cost per model call.',
    pro: 'Route simple tasks to the simplest proven workflow. Reserve retrieval, multiple samples and high reasoning effort for cases that need them.',
    risk: 'Optimising only for speed or cost can hide quality and safety failures. Optimising only for quality can make a workflow impractical.', refs: [1, 4, 14]
  },
  {
    section: 'Professional Counter', level: 'SKILLED', name: 'Check rights and provenance', term: 'Copyright, licensing, likeness and content provenance',
    theory: 'Record where source material and generated assets came from, what permissions apply and what claims remain uncertain.',
    why: 'A technically good output may still be unsuitable to publish, reuse or attribute.',
    uses: ['Publications', 'Marketing', 'Image generation', 'Training and reference material'],
    example: 'Use only organisation-owned or licensed source images. Record the licence, creator, generation tool and review decision with the final asset.',
    tip: 'Do not paste private reference material into a tool until its use is authorised.',
    pro: 'Keep a provenance record and review the current law and platform terms for the relevant jurisdiction and use.',
    risk: 'Legal status varies by country and facts. A prompt cannot grant rights or prove consent.', refs: [23, 10]
  },
];

const esc = (s) => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const refLinks = (refs) => refs.map(n => `<a href="${sources[n-1][1]}">[${n}]</a>`).join(' ');
const slug = (s) => s.toLowerCase().replaceAll('&', 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const burger = `<img class="burger-image" src="assets/seven-layer-burger-diagram.png" alt="" aria-hidden="true"><p class="diagram-caption"><b>Seven layers:</b> Goal → Task → Context and Input → Requirements and Details → Style and Quality → Output Format → Rules and Boundaries.</p>`;

const page = (title, kicker, body, cls='') => `<section class="page ${cls}" id="${slug(title)}" aria-labelledby="${slug(title)}-title">
  <header class="running" aria-hidden="true"><span>${kicker}</span><span>Prompt Smash! · The Prompting Menu</span></header>
  <main><p class="kicker">${kicker}</p><h1 id="${slug(title)}-title">${title}</h1>${body}</main>
  <footer aria-hidden="true"><span>Research edition · ${today}</span><span class="pageno"></span></footer>
</section>`;

const techniquePage = (t, i) => page(t.name, `${String(i+1).padStart(2,'0')} · ${t.section}`,
`<div class="title-row"><p class="professional">Professional term: <b>${t.term}</b></p><span class="level">${t.level}</span></div>
<div class="definition"><h2>Theory</h2><p>${t.theory}</p><p class="why">${t.why}</p></div>
<div class="two-col">
  <section><h2>Best-fit use cases</h2><ul class="checks">${t.uses.map(x=>`<li>${x}</li>`).join('')}</ul></section>
  <section class="example"><h2>Example</h2>${t.situation ? `<p><b>Situation:</b> ${t.situation}</p><p><b>Basic prompt:</b></p><pre>${esc(t.basic)}</pre><p><b>Technique-enabled prompt:</b></p>` : ''}<pre>${esc(t.example)}</pre>${t.inspect ? `<p><b>What to inspect:</b> ${t.inspect}</p><p><b>Does not prove:</b> ${t.notProve}</p>` : ''}</section>
</div>
<div class="callouts"><aside class="tip"><h3>Counter Tip</h3><p>${t.tip}</p></aside><aside class="pro"><h3>Pro Tip</h3><p>${t.pro}</p></aside></div>
<aside class="risk"><h3>Watch out</h3><p>${t.risk}</p></aside>
<p class="evidence">Evidence ${refLinks(t.refs)} · Test this technique on the model, version and task you actually use.</p>`, 'technique-page');

let html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Prompt Smash! — The Prompting Menu</title><link rel="stylesheet" href="prompting-menu.css"></head><body>`;

html += `<section class="page cover"><main>
  <img class="logo" src="../../public/assets/brand/prompt-smash-logo-primary.png" alt="Prompt Smash!">
  <div class="cover-copy"><p class="edition">RESEARCH EDITION · 2026</p><h1>The Prompting<br><em>Menu</em></h1><p class="subtitle">Essential theories, techniques, examples and safety checks for better AI prompts.</p><div class="pills"><span>BEGINNER FRIENDLY</span><span>PRO TIPS INCLUDED</span></div></div>
  <img class="mascot" src="assets/prompt-builder-mascot.png" alt="A friendly seven-layer burger character holding a blank clipboard">
  <div class="cover-band"><b>Build clearer prompts, layer by layer.</b><span>A practical reference for text, images, code and real work.</span></div>
</main></section>`;

html += page('Welcome to the menu', 'Start here', `<div class="lead-grid"><div><p class="lead">Prompting is how you give an AI a job, the information it needs and a clear shape for the answer.</p><p>This guide collects the <b>essential, evidence-backed prompting theories and techniques</b> most useful to everyday people and working professionals. It is not a list of magic words.</p><aside class="tip"><h3>How to read each menu item</h3><p><b>Theory</b> explains it. <b>Use cases</b> show when it fits. <b>Example</b> demonstrates it. <b>Counter Tip</b> gives one action. <b>Pro Tip</b> adds depth. <b>Watch out</b> names the limit.</p></aside></div><div class="manifesto"><span>01</span><p>Start with a clear job.</p><span>02</span><p>Add only useful context.</p><span>03</span><p>Make success checkable.</p><span>04</span><p>Test the real result.</p><span>05</span><p>Review the risks.</p></div></div><div class="scope scope-grid"><div><b>Included</b><p>The seven-layer method, 24 practical techniques, text/image/code prompting, evaluation, BITE, risks, governance and professional workflow topics.</p></div><div><b>Not claimed</b><p>An exhaustive canon, universal model behaviour, legal advice, provider-specific guarantees or proof that an output is safe.</p></div><p class="scope-note">Research surveys describe dozens of text and multimodal techniques. Terminology and model behaviour continue to change. Examples here are illustrative and must be tested. ${refLinks([17])}</p></div>`);

html += page('Menu contents', 'Find your section', `<nav class="contents" aria-label="Document contents"><div><h2>Build your burger</h2><a href="#choose-your-route"><b>04</b> Choose your route</a><a href="#the-seven-layer-burger"><b>05</b> Seven-layer burger</a><a href="#from-rough-request-to-strong-brief"><b>09</b> Worked example</a><a href="#pick-the-smallest-useful-technique"><b>10</b> Technique selector</a><h2>Prompting Specials</h2><a href="#direct-prompting"><b>11</b> Direct prompting</a><a href="#role-and-audience"><b>12</b> Role and audience</a><a href="#show-the-pattern"><b>13</b> One-shot and few-shot</a><a href="#label-the-parts"><b>14</b> Structure and delimiters</a><a href="#set-a-checkable-finish-line"><b>15</b> Constraints</a><a href="#divide-the-work"><b>16</b> Decomposition and chaining</a><a href="#support-multi-step-reasoning"><b>17</b> Worked reasoning</a><a href="#compare-independent-attempts"><b>18</b> Self-consistency</a></div><div><h2>Kitchen Tools + Special Orders</h2><a href="#ground-the-answer"><b>19</b> Retrieval and grounding</a><a href="#use-tools-for-evidence-or-action"><b>20</b> Tool use</a><a href="#give-the-answer-a-schema"><b>21</b> Structured outputs</a><a href="#point-to-the-evidence"><b>22</b> Multimodal prompting</a><a href="#brief-a-visual"><b>23</b> Image prompting</a><a href="#brief-code-with-proof"><b>24</b> Code prompting</a><a href="#inspect-change-retest"><b>25</b> Iterative prompting</a><a href="#test-the-prompt-as-a-system"><b>26</b> Prompt evaluation</a><h2>Professional Counter</h2><a href="#respect-the-instruction-hierarchy"><b>27</b> Instruction hierarchy</a><a href="#design-for-long-context"><b>28</b> Long context</a><a href="#turn-prompts-into-maintained-assets"><b>29</b> Templates and versioning</a><a href="#explore-alternative-paths"><b>30</b> Alternative paths</a></div><div><h2>Professional Counter continued</h2><a href="#tune-model-settings-carefully"><b>31</b> Provider settings</a><a href="#prompt-across-languages"><b>32</b> Multilingual prompting</a><a href="#budget-the-workflow"><b>33</b> Cost and latency</a><a href="#check-rights-and-provenance"><b>34</b> Rights and provenance</a><h2>Review and safety</h2><a href="#bite-the-prompt-before-use"><b>35</b> BITE</a><a href="#what-could-still-go-wrong"><b>36</b> Responsible-AI review</a><a href="#hallucination-confident-can-still-be-wrong"><b>37</b> Hallucination</a><a href="#treat-untrusted-content-as-untrusted"><b>38</b> Prompt injection</a><a href="#bias-privacy-and-human-judgement"><b>39</b> Bias, privacy and judgement</a><h2>Take away</h2><a href="#ready-to-use-combinations"><b>40</b> Use-case menu</a><a href="#the-complete-workflow"><b>41</b> Complete workflow</a><a href="#pocket-glossary"><b>42</b> Glossary</a><a href="#research-notes-and-sources"><b>43</b> Sources</a><a href="#your-final-tray-check"><b>45</b> Final checklist</a></div></nav>`);

html += page('Choose your route', 'Quick-start map', `<p class="lead">You do not need every technique. Choose the smallest route that solves the real problem.</p><div class="route-grid">
<article><span>WRITE OR SUMMARISE</span><h2>Build the seven layers</h2><p>Start with Goal and Task. Add source material, requirements and the output shape.</p><b>Then try:</b> Direct prompting → examples → iteration</article>
<article><span>REPEAT A TASK</span><h2>Engineer and evaluate</h2><p>Define success, assemble representative test cases and compare prompt versions.</p><b>Then try:</b> Few-shot → structured output → evaluation</article>
<article><span>MAKE AN IMAGE</span><h2>Brief the visual</h2><p>Name the use, subject, composition, look and what must not change.</p><b>Then try:</b> Generate → inspect → edit one issue</article>
<article><span>BUILD OR FIX CODE</span><h2>Brief the environment</h2><p>Name versions, files, expected behaviour, boundaries and verification.</p><b>Then try:</b> Plan → implement → test → review</article>
</div><aside class="risk"><h3>Before you paste anything</h3><p>Remove secrets and unnecessary personal data. Check your chosen tool’s current retention, training and access settings.</p></aside>`);

html += page('The seven-layer burger', 'Build your burger', `<div class="burger-layout">${burger}<div class="layer-copy"><p class="lead">Each ingredient has one job. Stack only what the task needs.</p><ol><li><b>Goal</b> — why you need this.</li><li><b>Task</b> — the exact job.</li><li><b>Context and Input</b> — useful background and material.</li><li><b>Requirements and Details</b> — what the result must include.</li><li><b>Style and Quality</b> — how it should sound or look.</li><li><b>Output Format</b> — the shape of the answer.</li><li><b>Rules and Boundaries</b> — what must not happen.</li></ol></div></div><aside class="risk"><h3>The wrapper is not a safety switch</h3><p>Rules and Boundaries state limits in the prompt. The responsible-AI review checks what could still go wrong.</p></aside>`);

html += page('Goal + Task', 'Build your burger · 1–2', `<div class="layer-cards"><article class="layer-card tomato"><span>TOP BUN · REQUIRED</span><h2>1. Goal</h2><p><b>Theory:</b> Why you need this, and what the result should help you achieve.</p><p><b>Ask:</b> What should become possible after this is done?</p><pre>Help new staff understand our returns policy.</pre><aside class="tip"><h3>Tip</h3><p>Name the decision, action or outcome—not only the topic.</p></aside></article><article class="layer-card dark"><span>PATTY · REQUIRED</span><h2>2. Task</h2><p><b>Theory:</b> The exact job you want the AI to do.</p><p><b>Ask:</b> What action should the AI perform?</p><pre>Summarise the policy and extract the five steps.</pre><aside class="tip"><h3>Tip</h3><p>Lead with a strong verb: compare, extract, draft, classify or debug.</p></aside></article></div><aside class="pro"><h3>Pro Tip · Goal is not Task</h3><p>“Improve onboarding” is a Goal. “Write a one-page guide” is a Task. A strong prompt can contain both.</p></aside>`);

html += page('Context + Requirements', 'Build your burger · 3–4', `<div class="layer-cards"><article class="layer-card mustard"><span>CHEESE · RECOMMENDED</span><h2>3. Context and Input</h2><p><b>Theory:</b> The background and material the AI needs to know about.</p><p><b>Ask:</b> What evidence or situation changes the answer?</p><pre>Use only the approved policy text below.</pre><aside class="tip"><h3>Tip</h3><p>Include what is relevant. More context is not always better context.</p></aside></article><article class="layer-card pickle"><span>TOPPINGS · RECOMMENDED</span><h2>4. Requirements and Details</h2><p><b>Theory:</b> The facts, limits and audience needs the answer must include.</p><p><b>Ask:</b> What must be present for the result to work?</p><pre>Explain acronyms. Keep it under 400 words. Include owners.</pre><aside class="tip"><h3>Tip</h3><p>Write requirements so a person can check whether each one is present.</p></aside></article></div><aside class="pro"><h3>Pro Tip · Keep source and instructions apart</h3><p>Label source material clearly. This improves readability, but it does not prevent prompt injection.</p></aside>`);

html += page('Style + Format + Rules', 'Build your burger · 5–7', `<div class="three-stack"><article><span>SAUCE · OPTIONAL</span><h2>5. Style and Quality</h2><p>How it should sound or look, and how polished it needs to be.</p><pre>Plain English, calm and direct.</pre></article><article><span>BOTTOM BUN · RECOMMENDED</span><h2>6. Output Format</h2><p>The shape of the answer: list, table, code, image size and so on.</p><pre>One title, five numbered steps, then a glossary.</pre></article><article><span>WRAPPER · RECOMMENDED</span><h2>7. Rules and Boundaries</h2><p>What the AI must not do, change or include.</p><pre>Do not invent policy details. Mark missing information.</pre></article></div><div class="callouts"><aside class="tip"><h3>Counter Tip</h3><p>If Style genuinely does not matter, mark it “Not needed” and record why.</p></aside><aside class="risk"><h3>Check before using</h3><p>A stated boundary can still fail. Use workflow controls and human review for consequential work.</p></aside></div>`);

html += page('From rough request to strong brief', 'Worked example', `<div class="before-after"><article class="weak"><span>ROUGH REQUEST</span><pre>Summarise our returns policy.</pre><h3>What is missing?</h3><p>Purpose, audience, source, must-have details, output shape and a rule for missing information.</p></article><div class="arrow">→</div><article class="strong"><span>SEVEN LAYERS</span><pre><b>Goal:</b> Help new shop staff answer routine returns questions consistently.

<b>Task:</b> Summarise the approved policy and extract the process.

<b>Context and Input:</b> Use only the policy text inside &lt;source&gt; tags.

<b>Requirements and Details:</b> Cover eligibility, time limits, proof of purchase, exceptions and escalation.

<b>Style and Quality:</b> Plain English for first-week staff.

<b>Output Format:</b> Five numbered steps, then a short glossary.

<b>Rules and Boundaries:</b> Do not invent details. Write “Not stated” when the source is silent.</pre></article></div><aside class="pro"><h3>Pro Tip</h3><p>The best assembled order can differ from the burger’s learning order. With long source material, test whether repeating the Task after the source improves results.</p></aside>`);

html += page('Pick the smallest useful technique', 'Technique selector', `<div class="decision">
<div><b>Does a clear direct prompt work?</b><span>YES → Keep it simple.</span><span>NO ↓</span></div>
<div><b>Is the pattern hard to explain?</b><span>YES → Show examples.</span><span>NO ↓</span></div>
<div><b>Is the job too large to inspect?</b><span>YES → Decompose or chain.</span><span>NO ↓</span></div>
<div><b>Does the answer need outside facts or calculation?</b><span>YES → Ground it or use a tool.</span><span>NO ↓</span></div>
<div><b>Will software consume the result?</b><span>YES → Use structured output.</span><span>NO → Iterate and evaluate.</span></div>
</div><aside class="tip"><h3>Golden rule</h3><p>A technique is useful only when it improves the real result enough to justify its added effort, cost and review burden.</p></aside>`);

techniques.forEach((t, i) => { html += techniquePage(t, i); });

html += page('BITE the prompt before use', 'Final prompt-quality check', `<p class="lead">BITE checks whether the prompt says what it needs to say. It is a reflection tool—not a score and not a safety certificate.</p><div class="bite-grid"><article><b>B</b><h2>Brief</h2><p>Are the Goal and Task clear?</p></article><article><b>I</b><h2>Information</h2><p>Did you provide enough Context and Requirements?</p></article><article><b>T</b><h2>Taste</h2><p>Did you describe the intended Style and Quality?</p></article><article><b>E</b><h2>Expected result</h2><p>Did you specify the Output Format and state the Rules and Boundaries?</p></article></div><aside class="tip"><h3>When Taste is not needed</h3><p>Style and Quality may be marked <b>“Not needed” only when it genuinely does not apply—and you record the reason.</b></p></aside><aside class="risk"><h3>BITE does not mean “safe”</h3><p>A clear prompt can still produce a false, biased, unsafe or private result. BITE does not test or certify truth, fairness, privacy, legality or suitability for a high-stakes decision.</p></aside>`);

html += page('What could still go wrong?', 'Responsible-AI review', `<p class="lead">Run this review after BITE and before using the prompt or its output.</p><div class="risk-list"><article><span>01</span><div><h2>Risk</h2><p>What harm could follow if the answer is wrong, misleading or used too early?</p></div></article><article><span>02</span><div><h2>Injection</h2><p>Could hidden or untrusted instructions redirect the AI?</p></div></article><article><span>03</span><div><h2>Hallucination</h2><p>Could the AI invent unsupported information, citations or code?</p></div></article><article><span>04</span><div><h2>Bias</h2><p>Could the result represent or treat people unfairly?</p></div></article><article><span>05</span><div><h2>Data Protection</h2><p>Are personal, confidential or sensitive data being exposed?</p></div></article></div><div class="state-grid"><article><b>Not yet reviewed</b><span>You have not considered this issue.</span></article><article><b>Needs attention</b><span>You found a concern that still needs action.</span></article><article><b>Action added</b><span>You added a concrete prompt or workflow action.</span></article><article><b>Not relevant</b><span>You recorded why this issue does not apply.</span></article></div><aside class="risk"><h3>Reviewed does not mean safe</h3><p>Reviewed means the learner considered the issue. It does not mean the prompt or result is safe.</p></aside>`);

html += page('Hallucination: confident can still be wrong', 'Risk · Hallucination', `<div class="lead-grid"><div><p class="lead">Generative models can produce false claims, calculations, logic and citations in fluent, confident language.</p><h2>Use this response plan</h2><ol class="steps"><li><b>Ground</b> factual work in reliable sources.</li><li><b>Request</b> citations or quoted evidence.</li><li><b>Open</b> each important source yourself.</li><li><b>Check</b> calculations with deterministic tools.</li><li><b>Escalate</b> high-stakes work to a qualified person.</li></ol></div><div class="false-card"><span>POLISHED ≠ PROVEN</span><p>“I checked twice” can still mean the same model repeated the same mistake.</p></div></div><aside class="pro"><h3>Professional term</h3><p>Prompt Smash uses <b>Hallucination</b> as the learner-facing check. NIST uses <b>confabulation</b> for confidently stated but erroneous or false content.</p></aside><p class="evidence">Evidence ${refLinks([10,11])}</p>`);

html += page('Treat untrusted content as untrusted', 'Risk · Prompt injection', `<div class="injection-flow"><article><span>TRUSTED</span><h2>Your task and permissions</h2><p>What the user actually authorised.</p></article><div>+</div><article class="unsafe"><span>UNTRUSTED</span><h2>Webpage, file, email or tool output</h2><p>May contain instructions aimed at the AI.</p></article><div>→</div><article><span>CONTROLLED</span><h2>Validate before action</h2><p>Check arguments, permissions and approval outside the model.</p></article></div><h2>Defence in depth</h2><ul class="checks two"><li>Separate trusted instructions from data.</li><li>Give tools the least privilege needed.</li><li>Validate inputs, outputs and tool arguments.</li><li>Require approval for consequential actions.</li><li>Use dummy data when security testing.</li><li>Monitor and retest as attacks change.</li></ul><aside class="risk"><h3>A sentence is not a security control</h3><p>“Ignore malicious instructions” may help with clarity, but it cannot enforce authorisation.</p></aside><p class="evidence">Evidence ${refLinks([12])}</p>`);

html += page('Bias, privacy and human judgement', 'Risk · People and data', `<div class="risk-columns"><article><h2>Bias</h2><p>AI can reproduce or amplify harmful patterns from data, examples and design choices.</p><h3>Check</h3><ul><li>Who is represented?</li><li>Who may be missing?</li><li>Do equivalent cases receive equivalent treatment?</li><li>Who reviews the rubric?</li></ul><p><b>Prompt wording alone cannot certify fairness.</b></p></article><article><h2>Privacy</h2><p>Prompts and files may contain personal, confidential or regulated information.</p><h3>Check</h3><ul><li>Is every detail necessary?</li><li>Can placeholders replace identities?</li><li>What does this exact product store?</li><li>Who can access the result?</li></ul><p><b>Never assume all products share one data policy.</b></p></article></div><aside class="pro"><h3>Human review must match the possible harm</h3><p>The more damage a wrong result could cause, the stronger the evidence, expertise, approval and monitoring must be.</p></aside><p class="evidence">Evidence ${refLinks([10,11])}</p>`);

html += page('Ready-to-use combinations', 'Use-case menu', `<div class="combo-grid"><article><span>WRITING FROM A SOURCE</span><p><b>Layers:</b> Goal + Task + Context and Input + audience in Requirements and Details + Output Format + “do not invent” in Rules and Boundaries.</p><p><b>Technique:</b> Structured prompting.</p><p><b>Check:</b> Every claim against the source.</p></article><article><span>MEETING NOTES</span><p><b>Layers:</b> Goal + Task + notes in Context and Input + owners/dates in Requirements and Details + table as Output Format.</p><p><b>Technique:</b> Direct prompt, then examples if needed.</p><p><b>Check:</b> Names, dates and commitments.</p></article><article><span>COMPARE OPTIONS</span><p><b>Layers:</b> Goal + comparison Task + evidence in Context and Input + criteria in Requirements and Details + table as Output Format.</p><p><b>Technique:</b> Grounding and multiple candidates.</p><p><b>Check:</b> Source quality and assumptions.</p></article><article><span>CLASSIFY FEEDBACK</span><p><b>Layers:</b> Goal + classification Task + comments in Context and Input + multi-label rule + JSON or table as Output Format.</p><p><b>Technique:</b> Few-shot and evaluation.</p><p><b>Check:</b> Edge cases and group differences.</p></article><article><span>WEBSITE IMAGE</span><p><b>Layers:</b> use as Goal + generate/edit Task + references in Context and Input + composition + Style and Quality + size as Output Format + preservation Rules and Boundaries.</p><p><b>Technique:</b> Image briefing and iteration.</p><p><b>Check:</b> text, rights and crop.</p></article><article><span>SMALL CODE FEATURE</span><p><b>Layers:</b> outcome as Goal + implementation Task + repository Context and Input + acceptance criteria + diff as Output Format + no-secrets Rules and Boundaries.</p><p><b>Technique:</b> Decomposition and tests.</p><p><b>Check:</b> tests, diff and security.</p></article></div>`);

html += page('The complete workflow', 'From idea to use', `<div class="workflow" aria-label="Seven-step workflow"><div class="workflow__row"><article><b>1</b><span>Choose the task</span></article><div class="workflow__arrow" aria-hidden="true">→</div><article><b>2</b><span>Build seven layers</span></article><div class="workflow__arrow" aria-hidden="true">→</div><article><b>3</b><span>Pick the smallest technique</span></article><div class="workflow__arrow" aria-hidden="true">→</div><article><b>4</b><span>Run BITE</span></article></div><div class="workflow__turn" aria-hidden="true"><span></span></div><div class="workflow__row workflow__row--bottom"><article><b>5</b><span>Review five risks</span></article><div class="workflow__arrow" aria-hidden="true">→</div><article><b>6</b><span>Test the output</span></article><div class="workflow__arrow" aria-hidden="true">→</div><article><b>7</b><span>Approve or revise</span></article></div></div><div class="workflow-notes"><article><h2>For one-off work</h2><p>Use a small sample, inspect the answer and keep a person responsible for the final use.</p></article><article><h2>For repeated work</h2><p>Version the prompt, freeze representative test cases, define metrics and monitor failures over time.</p></article><article><h2>For high-stakes work</h2><p>Use qualified review, controlled data access, documented approval and a way to stop or correct the system.</p></article></div><aside class="tip"><h3>Accessible outputs</h3><p>When the result will become digital content, include accessibility requirements and verify the finished work against the relevant standard. ${refLinks([18])}</p></aside><aside class="risk"><h3>Remember</h3><p>A better prompt can improve an AI interaction. It cannot turn a probabilistic model into a guaranteed source of truth.</p></aside>`);

html += page('Pocket glossary', 'Plain-English terms', `<div class="glossary"><dl>
<dt>AI model</dt><dd>A system that finds patterns in data and generates a response.</dd><dt>Prompt</dt><dd>The instructions and information given to a model.</dd><dt>Prompt design</dt><dd>Writing a clear prompt for a task.</dd><dt>Prompt engineering</dt><dd>Systematically building, testing and maintaining prompts and workflows.</dd><dt>Zero-shot</dt><dd>Asking without a worked example.</dd><dt>One-shot / few-shot</dt><dd>Showing one or several examples.</dd><dt>Grounding</dt><dd>Connecting an answer to supplied evidence.</dd><dt>RAG</dt><dd>Retrieving relevant material and adding it to the model’s context.</dd><dt>Schema</dt><dd>A formal definition of fields and data types.</dd></dl><dl>
<dt>Multimodal</dt><dd>Using more than one kind of input, such as text, images, audio or files.</dd><dt>Hallucination</dt><dd>A false or unsupported response that may sound confident. NIST uses the related term “confabulation”.</dd><dt>Prompt injection</dt><dd>Untrusted instructions that try to redirect an AI system.</dd><dt>Evaluation</dt><dd>Testing outputs against defined criteria and representative cases.</dd><dt>Deterministic check</dt><dd>A check that gives the same result for the same input, such as a schema validator.</dd><dt>Human in the loop</dt><dd>A person reviews or approves a decision before it is used.</dd><dt>Least privilege</dt><dd>Giving a system only the access it needs.</dd></dl></div>`);

const sourceItems = (part) => part.map(([name,url]) => `<li><b>${name}</b><br><a href="${url}">Open the original source ↗</a> · reviewed ${today}</li>`).join('');
html += page('Research notes and sources', 'Evidence · 1 of 2', `<p class="lead">This guide combines Prompt Smash’s approved method with current provider guidance, original research and risk-management sources.</p><p>Provider advice can change. Links below open the original source and were reviewed on ${today}.</p><ol class="sources">${sourceItems(sources.slice(0,12))}</ol>`, 'sources-page');
html += page('Sources continued', 'Evidence · 2 of 2', `<p class="lead">Original research and advanced workflow sources.</p><ol class="sources" start="13">${sourceItems(sources.slice(12))}</ol><aside class="tip"><h3>How to use these sources</h3><p>Provider documentation describes current product behaviour. Research papers describe tested methods under specific conditions. Neither guarantees the same result on every model or task.</p></aside>`, 'sources-page');

html += page('Your final tray check', 'Take-away checklist', `<div class="final-grid"><div>${burger}</div><div><h2>Before you prompt</h2><ul class="checks"><li>Do I know the Goal and Task?</li><li>Is the input relevant and safe to share?</li><li>Can I describe a checkable result?</li></ul><h2>Before you use the output</h2><ul class="checks"><li>Did I run BITE?</li><li>Did I review Risk, Injection, Hallucination, Bias and Data Protection?</li><li>Did I verify the evidence?</li><li>Does a qualified person need to approve it?</li></ul><aside class="tip"><h3>One useful habit</h3><p>Save the prompt, the input, the output and the review decision together when the work matters.</p></aside></div></div><div class="last-word"><b>Build clearly. Test honestly. Review responsibly.</b></div>`, 'final-page');

html += `<script>document.querySelectorAll('.page').forEach((p,i)=>p.querySelector('.pageno')?.append(String(i+1)))</script></body></html>`;

writeFileSync(join(here, 'prompting-menu.html'), html);
console.log(`Wrote ${join(here, 'prompting-menu.html')}`);
