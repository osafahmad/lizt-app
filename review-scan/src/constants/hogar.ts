import {List} from '../redux/slices/list.slice';

const hogarList: List[] = [
  {
    id: 'diario',
    title: 'Diario',
    emoji: '🧹',
    items: [
      {
        title: 'Lavar WC',
        quantity: 1,
      },
      {
        title: 'Lavar trastes',
        quantity: 1,
      },
      {
        title: 'Limpiar el piso',
        quantity: 1,
      },
      {
        title: 'Ordenar el baño',
        quantity: 1,
      },
      {
        title: 'Recoger ropa sucia',
        quantity: 1,
      },
      {
        title: 'Sacar basura',
        quantity: 1,
      },
      {
        title: 'Tender cama',
        quantity: 1,
      },
    ],
  },
  {
    id: 'semanal',
    title: 'Semanal',
    emoji: '🛋️',
    items: [
      {
        title: 'Aspirar alfombras',
        quantity: 1,
      },
      {
        title: 'Cambiar ropa de cama',
        quantity: 1,
      },
      {
        title: 'Desinfectar el baño',
        quantity: 1,
      },
      {
        title: 'Lavar y guardar la ropa',
        quantity: 1,
      },
      {
        title: 'Limpiar el piso a fondo',
        quantity: 1,
      },
      {
        title: 'Limpiar electrodomésticos',
        quantity: 1,
      },
      {
        title: 'Limpiar estufa',
        quantity: 1,
      },
      {
        title: 'Sacudir muebles',
        quantity: 1,
      },
    ],
  },
  {
    id: 'mensual',
    title: 'Mensual',
    emoji: '🪟',
    items: [
      {
        title: 'Arreglar la cochera',
        quantity: 1,
      },
      {
        title: 'Lavar tinacos',
        quantity: 1,
      },
      {
        title: 'Lavar toallas',
        quantity: 1,
      },
      {
        title: 'Limpiar a fondo tapicerías y alfombras',
        quantity: 1,
      },
      {
        title: 'Limpiar el refrigerador',
        quantity: 1,
      },
      {
        title: 'Limpiar ventanas',
        quantity: 1,
      },
      {
        title: 'Ordenar el clóset',
        quantity: 1,
      },
    ],
  },
  {
    id: 'ocasional',
    title: 'Ocasional',
    emoji: '🕛',
    items: [
      {
        title: 'Desechar ropa y accesorios',
        quantity: 1,
      },
      {
        title: 'Impermeabilizar techos',
        quantity: 1,
      },
      {
        title: 'Pintar fachadas y paredes',
        quantity: 1,
      },
    ],
  },
];
export default hogarList;
