export type Project = {
  slug: string
  title: string
  summary: string
  description: string
  stack: string[]
  overview: string[]
  role: string[]
  challenges: string[]
  decisions: string[]
}

export const projects: Project[] = [
  {
    slug: 'real-time-call-monitoring-intervention',
    title: 'Real-Time Call Monitoring & Intervention',
    summary:
      'Owned the UI implementation of a cross-team feature used by supervisors to monitor and manage live contact center calls.',
    description:
      'Led front-end development from design through QA for an Amazon Connect feature, defined UI contracts with backend teams, and adapted the interface through late-stage design changes and evolving requirements.',
    stack: ['React', 'JavaScript', 'Figma'],
    overview: [
      'This feature allows supervisors in a contact center environment to monitor live calls and intervene when necessary. The UI needed to reflect real-time changes in agent and call state while remaining clear and responsive for supervisors managing multiple interactions.',
      'The feature relied on live updates from the agent snapshot API, which publishes changes when call states change or at regular intervals. The front end needed to reliably consume these updates and present them in a way that allowed supervisors to quickly understand the situation and take action.',
    ],
    role: [
      'I owned the UI implementation of the monitoring experience. My work focused on integrating the feature with the existing application architecture, consuming the real-time snapshot data, and ensuring the UI accurately represented monitoring state.',
      'I also participated in design discussions with backend engineers and product teams to define how monitoring state should be represented and how it would interact with other call states.',
    ],
    challenges: [
      'One key design challenge involved how monitoring state should be represented within the existing agent snapshot model. An early proposal suggested encoding monitoring inside another state block, but this raised concerns about future extensibility.',
      'Another challenge was ensuring the UI behaved reliably while consuming frequent snapshot updates without introducing inconsistent state or confusing transitions in the interface.',
    ],
    decisions: [
      'I raised concerns during design reviews that monitoring and other call states were conceptually independent and might eventually need to coexist. Feedback from early test users confirmed this risk, which helped inform the final approach.',
      'On the front end, I used the existing contactContext hook that subscribes to agent snapshot updates and derived the monitoring state from that data. By isolating monitoring logic in the UI layer rather than embedding assumptions into shared state structures, the implementation remained flexible and easier to adapt when backend behavior evolved.',
    ],
  },
  {
    slug: 'agent-response-templates-shortcuts',
    title: 'Agent Response Templates & Shortcuts',
    summary:
      'Drove the front-end implementation of reusable response templates integrated into existing chat workflows.',
    description:
      'Extended an existing DraftJS rich text editor with custom controls, shortcut triggers, and inline discovery patterns based on Figma wireframes and styling requirements.',
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
  },
  {
    slug: 'real-time-voice-authentication',
    title: 'Real-Time Voice Authentication',
    summary:
      'Assumed UI ownership of a feature that enabled secure voice-based customer verification during live contact center interactions.',
    description:
      'Resolved UI defects, improved test coverage, and acted as a subject matter expert to maintain consistent behavior across releases while increasing deployment confidence.',
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
  },
  {
    slug: 'cloudscape-design-system-visual-update',
    title: 'Cloudscape Design System Visual Update',
    summary:
      'Took ownership of front-end work mid-migration to plan rollout and validation for a design system update.',
    description:
      'Identified and resolved accessibility regressions introduced during migration and developed a testing strategy to preserve behavioral consistency alongside visual updates.',
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
  },
  {
    slug: 'custom-theming-architecture-chat-ui',
    title: 'Custom Theming Architecture for Chat UI',
    summary:
      'Established a reusable theming pattern in a shared common package to support modular UI development.',
    description:
      'Authored a design document that guided theming ownership across packages and led technical discussions to align teams on a scalable, maintainable approach.',
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
  },
]
