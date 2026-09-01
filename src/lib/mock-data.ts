export type Supplier = {
  id: string;
  name: string;
  code: string;
  total: number;
  types: { name: string; index: string; count: number }[];
};

export type ReturnDocument = {
  id: string;
  supplierId: string;
  supplier: string;
  createdAt: string;
  containers: number;
  status: 'open' | 'ready' | 'completed';
  document?: string;
};

export type ScannedContainer = {
  serial: string;
  name: string;
  index: string;
  warehouse: string;
};

export const suppliers: Supplier[] = [
  {
    id: 'nordchem', name: 'NordChem Polska Sp. z o.o.', code: 'D-00142', total: 26,
    types: [
      { name: 'Paletopojemnik IBC 1000 l', index: 'OP-IBC-1000', count: 14 },
      { name: 'Beczka stalowa 200 l', index: 'OP-BECZ-200', count: 8 },
      { name: 'Paleta CP1', index: 'OP-PAL-CP1', count: 4 }
    ]
  },
  {
    id: 'coloris', name: 'Coloris Industrial GmbH', code: 'D-00087', total: 18,
    types: [
      { name: 'Beczka stalowa 200 l', index: 'OP-BECZ-200', count: 12 },
      { name: 'Paletopojemnik IBC 1000 l', index: 'OP-IBC-1000', count: 6 }
    ]
  },
  {
    id: 'chemtrade', name: 'ChemTrade S.A.', code: 'D-00205', total: 9,
    types: [
      { name: 'Kanister HDPE 30 l', index: 'OP-KAN-030', count: 7 },
      { name: 'Paleta EUR', index: 'OP-PAL-EUR', count: 2 }
    ]
  },
  {
    id: 'pigment', name: 'Pigment Solutions s.r.o.', code: 'D-00118', total: 5,
    types: [{ name: 'Big Bag 1000 kg', index: 'OP-BB-1000', count: 5 }]
  }
];

export const initialReturns: ReturnDocument[] = [
  { id: '1', supplierId: 'nordchem', supplier: 'NordChem Polska Sp. z o.o.', createdAt: 'Dzisiaj, 08:42', containers: 9, status: 'open' },
  { id: '2', supplierId: 'coloris', supplier: 'Coloris Industrial GmbH', createdAt: 'Wczoraj, 14:18', containers: 18, status: 'ready' },
  { id: '3', supplierId: 'chemtrade', supplier: 'ChemTrade S.A.', createdAt: '28.08.2026, 11:07', containers: 7, status: 'completed', document: 'ZD/004821/26' }
];

export const scanPool: Record<string, ScannedContainer> = {
  'IBC-NC-240018': { serial: 'IBC-NC-240018', name: 'Paletopojemnik IBC 1000 l', index: 'OP-IBC-1000', warehouse: 'M01' },
  'IBC-NC-240021': { serial: 'IBC-NC-240021', name: 'Paletopojemnik IBC 1000 l', index: 'OP-IBC-1000', warehouse: 'M03' },
  'BEC-NC-008419': { serial: 'BEC-NC-008419', name: 'Beczka stalowa 200 l', index: 'OP-BECZ-200', warehouse: 'M01' },
  'PAL-NC-000774': { serial: 'PAL-NC-000774', name: 'Paleta CP1', index: 'OP-PAL-CP1', warehouse: 'M02' }
};
