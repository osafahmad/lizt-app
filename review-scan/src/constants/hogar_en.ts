import {List} from '../redux/slices/list.slice';

const hogarList: List[] = [
  {
    id: 'diary',
    title: 'Diary',
    emoji: '🧹',
    items: [
      {
        title: 'Wash toilet',
        quantity: 1,
      },
      {
        title: 'Wash dishes',
        quantity: 1,
      },
      {
        title: 'Clean the floor',
        quantity: 1,
      },
      {
        title: 'Tidy up the bathroom',
        quantity: 1,
      },
      {
        title: 'Pick up dirty clothes',
        quantity: 1,
      },
      {
        title: 'Take out trash',
        quantity: 1,
      },
      {
        title: 'make bed',
        quantity: 1,
      },
    ],
  },
  {
    id: 'weekly',
    title: 'Weekly',
    emoji: '🛋️',
    items: [
      {
        title: 'Vacuum carpets',
        quantity: 1,
      },
      {
        title: 'Change bedding',
        quantity: 1,
      },
      {
        title: 'Disinfect the bathroom',
        quantity: 1,
      },
      {
        title: 'Wash and put away clothes',
        quantity: 1,
      },
      {
        title: 'Clean the floor thoroughly',
        quantity: 1,
      },
      {
        title: 'Clean appliances',
        quantity: 1,
      },
      {
        title: 'Clean stove',
        quantity: 1,
      },
      {
        title: 'Shake furniture',
        quantity: 1,
      },
    ],
  },
  {
    id: 'monthly',
    title: 'Monthly',
    emoji: '🪟',
    items: [
      {
        title: 'Fix the garage',
        quantity: 1,
      },
      {
        title: 'Wash water tanks',
        quantity: 1,
      },
      {
        title: 'wash towels',
        quantity: 1,
      },
      {
        title: 'Thoroughly clean upholstery and carpets',
        quantity: 1,
      },
      {
        title: 'Clean the fridge',
        quantity: 1,
      },
      {
        title: 'Clean windows',
        quantity: 1,
      },
      {
        title: 'Organize the closet',
        quantity: 1,
      },
    ],
  },
  {
    id: 'occasional',
    title: 'Occasional',
    emoji: '🕛',
    items: [
      {
        title: 'Discard clothes and accessories',
        quantity: 1,
      },
      {
        title: 'Waterproof roofs',
        quantity: 1,
      },
      {
        title: 'Paint facades and walls',
        quantity: 1,
      },
    ],
  },
];
export default hogarList;
