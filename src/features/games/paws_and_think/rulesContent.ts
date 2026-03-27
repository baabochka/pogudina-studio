export const SINGLE_CARD_RULES_PAGES = [
  {
    title: "How to play",
    paragraphs: [
      "Each object has one original color: cat is orange, mouse is grey, cheese is yellow, ball is blue, and pillow is red. The tokens on the right show the correct color for each object.",
      "If an object on the card has its original color, that object is the correct answer.",
      "Example: if you see an orange cat on a blue pillow, the correct answer is cat.",
    ],
  },
  {
    title: "How to play",
    paragraphs: [
      "If none of the objects on the card have their original colors, the answer is the object that is missing from the card and whose color is also missing.",
      "To solve it, first remove the objects that are already on the card.",
      "Then remove any object whose original color is already visible on the card.",
      "The only object left is the correct answer.",
    ],
  },
  {
    title: "How to play",
    paragraphs: [
      "Example: if you see a grey mouse on a blue pillow, first remove mouse and pillow because they are already on the card.",
      "Then remove mouse and ball because grey and blue are already on the card.",
      "The only answer left is cheese.",
      "Choose an answer by clicking one of the tokens on the right. If you choose wrong, the paw trail will guide you to the correct answer.",
    ],
  },
  {
    title: "How to play",
    paragraphs: [
      "Use the top-right paw to restart.",
      "Use the back-arrow paw to review the previous answer.",
    ],
  },
] as const;

export const FIVE_CARD_RULES_PAGES = [
  {
    title: "How to play",
    paragraphs: [
      "In the multiple-cards mode, the answer to the round is the answer that repeats twice across the cards.",
      "Solve each card using the one-card rules, then choose the answer that appears twice.",
      "One-card rules:",
      "Each object has one original color: cat is orange, mouse is grey, cheese is yellow, ball is blue, and pillow is red.",
      "If an object on the card has its original color, that object is the correct answer for that card.",
      "If none of the objects on the card have their original colors, remove the shown objects and any object whose original color is already visible on the card.",
      "The only answer left is the correct answer for that card. After solving all five cards, pick the answer that repeats twice.",
      "Use the top-right paw to restart and the back-arrow paw to review the previous answer.",
    ],
  },
] as const;
