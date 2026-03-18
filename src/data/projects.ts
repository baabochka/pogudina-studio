export type Project = {
  slug: string
  title: string
  summary: string
  description: string
  roleLabel: string
  team: string
  timeline: string
  stack: string[]
  overview: string[]
  role: string[]
  challenges: string[]
  decisions: string[]
  decisionDetails?: string[]
  solution: string[]
  impact: string[]
  reflection: string[]
}

export const projects: Project[] = [
  {
    slug: 'real-time-call-monitoring-intervention',
    title: 'Real-Time Call Monitoring',
    summary:
      'Enabled supervisors to monitor and manage live calls in real time within a unified workflow, eliminating reliance on fragmented views and manual workarounds.',
    description:
      'Led front-end development from design through QA for an Amazon Connect feature, defining UI contracts with backend teams and adapting the interface as requirements evolved.',
    roleLabel: 'Front-End Engineer / UI Owner',
    team: 'Cross-functional team with backend, design, and product partners',
    timeline: 'Multi-sprint delivery',
    stack: ['React', 'JavaScript', 'Figma'],
    overview: [
      'Supervisors in a contact center environment needed to monitor live calls and intervene when necessary, but existing workflows required switching between multiple views and piecing together fragmented information.',
      'The UI needed to reflect real-time changes in agent and call state while remaining clear and responsive for supervisors managing multiple interactions simultaneously.',
      'The feature relied on live updates from the agent snapshot API, which publishes frequent state changes. The challenge was to consume and present this data in a way that allowed supervisors to quickly understand the situation and take action without confusion.',
    ],
    role: [
      'Owned the end-to-end implementation of the monitoring experience, integrating it into the existing application architecture while maintaining consistency with established interaction patterns.',
      'Focused on translating real-time snapshot data into meaningful UI state, ensuring clarity and stability under frequent updates.',
      'Partnered closely with backend and product teams to define how monitoring should behave and interact with other call states.',
    ],
    challenges: [
      'Monitoring state needed to fit within an existing agent snapshot model that wasn\'t originally designed for it',
      'Early proposals suggested embedding monitoring into another state block, raising concerns about long-term extensibility',
      'Frequent real-time updates introduced risk of inconsistent UI state and confusing transitions',
    ],
    decisions: [
      'Identified early that monitoring should remain conceptually independent from other call states',
      'Validated this through design reviews and early user feedback',
      'Decided to derive monitoring state in the UI layer rather than embedding it into shared backend state structures',
    ],
    decisionDetails: [
      'To implement this, I reused the existing contactContext hook that subscribes to agent snapshot updates and derived monitoring state from that data.',
      'By isolating monitoring logic in the UI layer, the implementation remained flexible and easier to adapt as backend behavior evolved.',
    ],
    solution: [
      'Built a monitoring interface that surfaces real-time agent and call state updates, allowing supervisors to track multiple calls simultaneously and intervene directly within the same workflow.',
      'The UI translates rapidly updating snapshot data into stable, understandable states, ensuring supervisors can quickly assess situations without being overwhelmed by transient changes.',
      'The implementation integrates seamlessly with the existing application architecture, avoiding duplication of state while maintaining clear separation of concerns.',
    ],
    impact: [
      'Enabled supervisors to monitor and manage live calls without leaving their primary workflow',
      'Reduced reliance on fragmented views and manual workarounds',
      'Introduced a resilient UI model that adapted to evolving backend behavior without requiring rework',
    ],
    reflection: [
      'Separating monitoring from other call states early made the interface easier to extend as the product direction matured.',
      'If I revisited the project, I would introduce clearer state diagrams earlier in cross-team discussions to accelerate alignment on edge cases and reduce ambiguity during implementation.',
    ],
  },
  {
    slug: 'agent-response-templates-shortcuts',
    title: 'Agent Response Templates',
    summary:
      'Drove the front-end implementation of reusable response templates integrated into existing chat workflows.',
    description:
      'Extended an existing DraftJS rich text editor with custom controls, shortcut triggers, and inline discovery patterns based on Figma wireframes and styling requirements.',
    roleLabel: 'Front-End Engineer',
    team: 'Cross-functional team with backend, design, and product partners',
    timeline: 'Multi-sprint feature rollout',
    stack: ['React', 'JavaScript', 'DraftJS'],
    overview: [
      'This feature enables contact center agents to quickly insert predefined responses while chatting with customers. The goal was to improve agent efficiency by reducing repetitive typing and making commonly used responses easily discoverable within the chat interface.',
      'The solution integrates with the chat input editor and allows agents to trigger a dropdown of predefined responses using keywords or UI controls.',
    ],
    role: [
      'I owned the front-end implementation of this feature and represented my team in cross-team discussions with backend engineers, designers, and product managers.',
      'My responsibilities included translating design specifications into implementation, defining the UI behavior, extending the rich-text editor, and implementing the interaction logic that allows agents to discover and insert responses.',
    ],
    challenges: [
      'The chat input was built using DraftJS, a rich-text editor framework that was not widely used elsewhere in the codebase. I needed to ramp up on the framework quickly in order to extend it safely without breaking existing editor behavior.',
      'Another challenge came from a design requirement to display a colored placeholder keyword within the editor. Because DraftJS does not support styled placeholders natively, this behavior had to be implemented as editor content, which introduced complex edge cases around text insertion and deletion.',
    ],
    decisions: [
      'I implemented custom logic to detect keyword triggers, display the response menu, and insert selected responses into the editor while preserving editor state.',
      'During implementation, I raised concerns with product and design teams about the technical complexity introduced by the custom placeholder requirement and documented potential edge cases. After discussing the tradeoffs, the team decided to keep the design, and I implemented defensive logic to handle those scenarios as reliably as possible.',
      'The feature was validated through unit tests, end-to-end Cypress tests, and accessibility verification using keyboard navigation and screen reader testing.',
    ],
    solution: [
      'Extended the existing DraftJS editor with response template controls, keyword triggers, and inline discovery patterns that fit naturally into the chat workflow.',
      'Built the interaction logic to open the template menu, insert responses reliably into the editor, and preserve editor state without disrupting existing typing behavior.',
      'Handled the custom styled placeholder requirement with defensive logic so the interface remained usable despite the edge cases introduced by the editor framework.',
    ],
    impact: [
      'Made reusable responses easier to discover and insert during live chats, reducing friction in repetitive agent workflows.',
      'Expanded a complex editor safely while preserving keyboard accessibility and confidence in the existing chat experience.',
    ],
    reflection: [
      'This project sharpened my ability to challenge design requirements constructively when the implementation cost is high but still deliver if the team decides to proceed.',
      'I would invest even earlier in editor edge-case documentation when extending highly customized rich text behavior.',
    ],
  },
  {
    slug: 'real-time-voice-authentication',
    title: 'Voice Authentication',
    summary:
      'Assumed UI ownership of a feature that enabled secure voice-based customer verification during live contact center interactions.',
    description:
      'Resolved UI defects, improved test coverage, and acted as a subject matter expert to maintain consistent behavior across releases while increasing deployment confidence.',
    roleLabel: 'Front-End Engineer / UI Owner',
    team: 'Feature team with QA and contact center platform partners',
    timeline: 'Ongoing feature ownership across releases',
    stack: ['React', 'JavaScript', 'Testing'],
    overview: [
      'This project enabled agents to verify a caller’s identity during a live call using voice authentication technology. The feature integrated authentication signals into the agent interface so agents could see verification status in real time while assisting customers.',
    ],
    role: [
      'I took ownership of the UI for this feature, ensuring that authentication states were clearly represented in the agent interface and integrated smoothly with the existing call workflow.',
      'I also resolved UI defects and improved the test coverage for the feature to ensure stable behavior across releases.',
    ],
    challenges: [
      'The UI had to represent authentication state transitions clearly while the call was ongoing, without distracting the agent or interfering with the call handling workflow.',
      'Another challenge was ensuring that the feature behaved consistently across releases and did not introduce regressions into other parts of the interface.',
    ],
    decisions: [
      'I focused on improving the reliability of the UI by addressing defects and strengthening the test coverage around the authentication flow.',
      'By validating the UI behavior across different call states and improving automated tests, we increased confidence in deployments and ensured that agents could rely on the authentication indicators during live interactions.',
    ],
    solution: [
      'Stabilized the authentication experience by clarifying how status changes were represented in the UI and ensuring those states fit naturally into the live-call workflow.',
      'Resolved defects and strengthened automated coverage so authentication indicators behaved consistently across call states and releases.',
      'Used maintenance and validation work to make the interface more dependable for agents who needed to interpret authentication results quickly during active conversations.',
    ],
    impact: [
      'Improved confidence in releases by strengthening UI reliability and expanding automated test coverage around a sensitive workflow.',
      'Made authentication status easier for agents to trust and interpret during active customer conversations.',
    ],
    reflection: [
      'Owning a feature across releases reinforced how much product trust depends on maintenance work, not just net-new UI.',
      'I would add more scenario-based regression coverage earlier whenever a feature depends on nuanced real-time state transitions.',
    ],
  },
  {
    slug: 'cloudscape-design-system-visual-update',
    title: 'Cloudscape Visual Update',
    summary:
      'Took ownership of front-end work mid-migration to plan rollout and validation for a design system update.',
    description:
      'Identified and resolved accessibility regressions introduced during migration and developed a testing strategy to preserve behavioral consistency alongside visual updates.',
    roleLabel: 'Front-End Engineer',
    team: 'Shared application team working across multiple product surfaces',
    timeline: 'Phased migration',
    stack: ['React', 'JavaScript', 'Cloudscape'],
    overview: [
      'This project involved migrating existing UI components to a new visual update of the Cloudscape design system. Because the application is large and shared across multiple teams, even small design system changes had the potential to introduce visual inconsistencies or accessibility regressions.',
    ],
    role: [
      'I took ownership of the front-end work during the migration and helped plan the rollout of the visual updates across the application.',
      'My work focused on validating UI behavior, identifying issues introduced during the migration, and ensuring that updated components remained accessible and consistent.',
    ],
    challenges: [
      'Updating a shared design system across an existing application created a risk of subtle regressions in layout, styling, and accessibility.',
      'Another challenge was ensuring that visual updates did not unintentionally affect component behavior or break existing workflows.',
    ],
    decisions: [
      'I reviewed the affected components, identified accessibility regressions introduced during the migration, and implemented fixes to restore proper keyboard navigation and screen reader behavior.',
      'I also developed a testing strategy that combined visual validation and automated tests to ensure that the updated components behaved consistently across the application.',
    ],
    solution: [
      'Planned and validated the migration so updated Cloudscape components could be introduced without destabilizing the rest of the application.',
      'Addressed accessibility regressions directly in the migrated UI, restoring keyboard and screen reader behavior while preserving the visual refresh.',
      'Paired implementation with a practical testing strategy so teams could roll out the update with more confidence and fewer surprises.',
    ],
    impact: [
      'Helped the product adopt a major design system update without sacrificing accessibility or introducing broad workflow regressions.',
      'Established a validation approach that made future migration work more predictable and less risky.',
    ],
    reflection: [
      'Design system migrations look visual on the surface, but they often expose behavioral and accessibility gaps that deserve equal attention.',
      'I would formalize migration checklists earlier so shared teams can align on validation standards from the start.',
    ],
  },
  {
    slug: 'custom-theming-architecture-chat-ui',
    title: 'Chat UI Theming',
    summary:
      'Established a reusable theming pattern in a shared common package to support modular UI development.',
    description:
      'Authored a design document that guided theming ownership across packages and led technical discussions to align teams on a scalable, maintainable approach.',
    roleLabel: 'Front-End Engineer / System Designer',
    team: 'Multiple frontend teams sharing common UI packages',
    timeline: 'Architecture initiative',
    stack: ['React', 'JavaScript', 'Architecture'],
    overview: [
      'This project focused on creating a reusable theming architecture for chat-related UI components. The goal was to support modular UI development and allow different parts of the application to share consistent styling patterns.',
    ],
    role: [
      'I designed and implemented a reusable theming pattern within a shared package used across multiple UI modules.',
      'I also authored a design document that defined how theming should be implemented and maintained across the codebase.',
    ],
    challenges: [
      'The main challenge was designing a theming system that could be reused across different packages without introducing tight coupling or duplication.',
      'Because multiple teams relied on the shared components, the architecture needed to be flexible and easy to adopt.',
    ],
    decisions: [
      'I implemented a theme configuration pattern that allowed components to consume styling values through a shared structure while remaining modular.',
      'To ensure alignment across teams, I led technical discussions and documented the architecture so that other engineers could adopt the theming approach consistently.',
    ],
    solution: [
      'Created a reusable theming pattern in a shared package so chat-related UI components could consume styling values through a common structure.',
      'Defined the architecture in a design document and used technical discussions to align teams on how theming ownership should work across packages.',
      'Focused on keeping the system modular so teams could adopt shared patterns without introducing tight coupling or duplicated styling logic.',
    ],
    impact: [
      'Created a reusable theming foundation that made shared chat UI components easier to scale across packages and teams.',
      'Improved long-term consistency by pairing implementation with documentation and team alignment work.',
    ],
    reflection: [
      'Architecture work lands best when documentation and implementation evolve together instead of as separate tracks.',
      'If I extended this further, I would include more adoption examples to help new teams apply the pattern faster.',
    ],
  },
]
